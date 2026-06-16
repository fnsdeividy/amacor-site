import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import {
  errorHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ExternalServiceError,
} from './errorHandler';
import { DatabaseConnectionError, DatabaseConstraintError } from '../config/database';

// Mock logger to prevent actual output during tests
vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

function createMockRequest(overrides?: Partial<Request>): Request {
  return {
    method: 'POST',
    path: '/api/auth/login',
    ip: '127.0.0.1',
    get: vi.fn().mockReturnValue('test-agent'),
    ...overrides,
  } as unknown as Request;
}

function createMockResponse(): Response & { statusCode: number; body: unknown } {
  const res = {
    statusCode: 0,
    body: null as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: unknown) {
      res.body = data;
      return res;
    },
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
}

describe('errorHandler middleware', () => {
  let req: Request;
  let res: ReturnType<typeof createMockResponse>;
  const next = vi.fn();

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('DatabaseConnectionError', () => {
    it('should return 503 with generic message', () => {
      const err = new DatabaseConnectionError(new Error('ECONNREFUSED'));

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ erro: 'Serviço temporariamente indisponível' });
    });

    it('should not expose connection details', () => {
      const err = new DatabaseConnectionError(
        new Error('connection to server at "10.0.0.5", port 5432 failed')
      );

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).not.toContain('10.0.0.5');
      expect(body.erro).not.toContain('5432');
    });
  });

  describe('DatabaseConstraintError', () => {
    it('should return 409 with generic message', () => {
      const err = new DatabaseConstraintError(
        new Error('duplicate key value violates unique constraint "users_email_key"')
      );

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(409);
      expect(res.body).toEqual({ erro: 'Operação não pode ser realizada' });
    });

    it('should not expose table or constraint names', () => {
      const err = new DatabaseConstraintError(
        new Error('insert or update on table "solicitacoes" violates foreign key constraint')
      );

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).not.toContain('solicitacoes');
      expect(body.erro).not.toContain('foreign key');
    });
  });

  describe('ValidationError', () => {
    it('should return 400 with message and campos', () => {
      const err = new ValidationError('Dados inválidos', {
        email: 'Email é obrigatório',
        senha: 'Senha deve ter no mínimo 8 caracteres',
      });

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        erro: 'Dados inválidos',
        campos: {
          email: 'Email é obrigatório',
          senha: 'Senha deve ter no mínimo 8 caracteres',
        },
      });
    });
  });

  describe('AuthenticationError', () => {
    it('should return 401 with default message', () => {
      const err = new AuthenticationError();

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
    });

    it('should return 401 with custom message for invalid credentials', () => {
      const err = new AuthenticationError('Credenciais inválidas');

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Credenciais inválidas' });
    });
  });

  describe('NotFoundError', () => {
    it('should return 404 with default message', () => {
      const err = new NotFoundError();

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ erro: 'Recurso não encontrado' });
    });
  });

  describe('RateLimitError', () => {
    it('should return 429 with retry information', () => {
      const err = new RateLimitError(15);

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(429);
      expect(res.body).toEqual({ erro: 'Muitas tentativas. Tente novamente em 15 minutos.' });
    });
  });

  describe('ExternalServiceError', () => {
    it('should return 502 with CRM message', () => {
      const err = new ExternalServiceError();

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(502);
      expect(res.body).toEqual({ erro: 'Falha na comunicação com o CRM' });
    });
  });

  describe('Unhandled errors', () => {
    it('should return 500 with generic message for unknown errors', () => {
      const err = new Error('something went wrong internally');

      errorHandler(err, req, res as unknown as Response, next);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ erro: 'Erro interno do servidor' });
    });

    it('should not expose stack traces', () => {
      const err = new Error('TypeError at /app/src/services/auth.ts:42:15');
      err.stack = 'Error: ...\n    at Object.<anonymous> (/app/src/services/auth.ts:42:15)';

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).not.toContain('auth.ts');
      expect(body.erro).not.toContain('42:15');
      expect(body.erro).not.toContain('stack');
    });

    it('should not expose PostgreSQL internal details in error messages', () => {
      const err = new Error(
        'ERROR: duplicate key value violates unique constraint "users_email_key"'
      );

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).toBe('Erro interno do servidor');
      expect(body.erro).not.toContain('users_email_key');
      expect(body.erro).not.toContain('duplicate key');
    });

    it('should not expose table names from PostgreSQL errors', () => {
      const err = new Error(
        'relation "administradores" does not exist'
      );

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).toBe('Erro interno do servidor');
      expect(body.erro).not.toContain('administradores');
    });

    it('should not expose column names from PostgreSQL errors', () => {
      const err = new Error(
        'column "cpf_beneficiario" of relation "solicitacoes" does not exist'
      );

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).toBe('Erro interno do servidor');
      expect(body.erro).not.toContain('cpf_beneficiario');
      expect(body.erro).not.toContain('solicitacoes');
    });
  });

  describe('AppError with internal details in userMessage', () => {
    it('should sanitize userMessage if it accidentally contains DB details', () => {
      const err = new AppError(
        400,
        'violates unique constraint "users_email_key"'
      );

      errorHandler(err, req, res as unknown as Response, next);

      const body = res.body as { erro: string };
      expect(body.erro).toBe('Erro interno do servidor');
    });
  });
});
