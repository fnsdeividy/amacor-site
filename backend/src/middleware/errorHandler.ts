import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionError, DatabaseConstraintError } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Erro de aplicação com status HTTP e mensagem segura para o cliente.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly campos?: Record<string, string>;

  constructor(
    statusCode: number,
    userMessage: string,
    options?: { campos?: Record<string, string>; internalMessage?: string }
  ) {
    super(options?.internalMessage || userMessage);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.campos = options?.campos;
  }
}

/**
 * Erro de validação de input (HTTP 400).
 */
export class ValidationError extends AppError {
  constructor(message: string, campos?: Record<string, string>) {
    super(400, message, { campos });
    this.name = 'ValidationError';
  }
}

/**
 * Erro de autenticação (HTTP 401).
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Não autorizado') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Erro de recurso não encontrado (HTTP 404).
 */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

/**
 * Erro de rate limit (HTTP 429).
 */
export class RateLimitError extends AppError {
  constructor(retryMinutes: number) {
    super(429, `Muitas tentativas. Tente novamente em ${retryMinutes} minutos.`);
    this.name = 'RateLimitError';
  }
}

/**
 * Erro de comunicação com serviço externo / CRM (HTTP 502).
 */
export class ExternalServiceError extends AppError {
  constructor(message = 'Falha na comunicação com o CRM') {
    super(502, message);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Verifica se o erro contém detalhes internos do PostgreSQL que não devem ser expostos.
 */
function containsInternalDetails(message: string): boolean {
  const internalPatterns = [
    /\b(pg_|information_schema)\b/i,
    /\b(SQLSTATE|ERROR:)\b/,
    /\bviolates?\s+(unique|foreign\s+key|check|not-null)\s+constraint\b/i,
    /\brelation\s+"[^"]+"\b/i,
    /\bcolumn\s+"[^"]+"\b/i,
    /\btable\s+"[^"]+"\b/i,
    /\bat\s+\S+\.(ts|js):\d+:\d+/,
    /\bnode_modules\b/,
  ];

  return internalPatterns.some((pattern) => pattern.test(message));
}

/**
 * Sanitiza uma mensagem de erro, removendo qualquer detalhe interno do banco.
 * Se detectar conteúdo interno, retorna mensagem genérica.
 */
function sanitizeErrorMessage(message: string): string {
  if (containsInternalDetails(message)) {
    return 'Erro interno do servidor';
  }
  return message;
}

/**
 * Middleware de tratamento de erros do Express.
 *
 * - Captura todos os erros e retorna respostas padronizadas
 * - Nunca expõe detalhes internos do PostgreSQL ao cliente
 * - Loga informações detalhadas para debugging interno
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const userId = (req as Request & { userId?: string }).userId || 'anonymous';
  const metadata: Record<string, unknown> = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  // Erro de conexão com banco de dados (503)
  if (err instanceof DatabaseConnectionError) {
    logger.error('database.connection', {
      userId,
      result: 'failure',
      metadata: { ...metadata, errorMessage: err.message },
    });

    res.status(503).json({ erro: 'Serviço temporariamente indisponível' });
    return;
  }

  // Violação de constraint do banco de dados (409)
  if (err instanceof DatabaseConstraintError) {
    logger.warn('database.constraint', {
      userId,
      result: 'failure',
      metadata: { ...metadata, errorMessage: err.message },
    });

    res.status(409).json({ erro: 'Operação não pode ser realizada' });
    return;
  }

  // Erros da aplicação (AppError e derivados)
  if (err instanceof AppError) {
    logger.warn(`app.error.${err.name}`, {
      userId,
      result: 'failure',
      metadata: { ...metadata, statusCode: err.statusCode, errorMessage: err.userMessage },
    });

    const response: { erro: string; campos?: Record<string, string> } = {
      erro: sanitizeErrorMessage(err.userMessage),
    };

    if (err.campos) {
      response.campos = err.campos;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Erro inesperado - nunca expor detalhes internos
  logger.error('server.unhandled', {
    userId,
    result: 'failure',
    metadata: {
      ...metadata,
      errorName: err.name,
      errorMessage: err.message,
      stack: err.stack,
    },
  });

  res.status(500).json({ erro: 'Erro interno do servidor' });
}

export default errorHandler;
