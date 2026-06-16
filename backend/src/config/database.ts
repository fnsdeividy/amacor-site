import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[database] Erro inesperado no pool de conexões:', err.message);
});

/**
 * Erro personalizado para falhas de conexão com o banco de dados.
 * Usado para distinguir erros de conectividade de outros erros de query.
 */
export class DatabaseConnectionError extends Error {
  public readonly statusCode = 503;
  public readonly userMessage = 'Serviço temporariamente indisponível';

  constructor(originalError: Error) {
    super(originalError.message);
    this.name = 'DatabaseConnectionError';
  }
}

/**
 * Erro personalizado para violações de constraint no banco de dados.
 * Mensagens retornadas ao cliente não expõem detalhes internos.
 */
export class DatabaseConstraintError extends Error {
  public readonly statusCode = 409;
  public readonly userMessage = 'Operação não pode ser realizada';

  constructor(originalError: Error) {
    super(originalError.message);
    this.name = 'DatabaseConstraintError';
  }
}

/**
 * Verifica se o erro é uma falha de conexão com o banco.
 */
function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const connectionErrorCodes = [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',
    'EAI_AGAIN',
  ];

  const pgConnectionErrors = [
    '57P01', // admin_shutdown
    '57P02', // crash_shutdown
    '57P03', // cannot_connect_now
    '08000', // connection_exception
    '08001', // sqlclient_unable_to_establish_sqlconnection
    '08003', // connection_does_not_exist
    '08004', // sqlserver_rejected_establishment_of_sqlconnection
    '08006', // connection_failure
  ];

  const err = error as Error & { code?: string };

  if (err.code && connectionErrorCodes.includes(err.code)) {
    return true;
  }

  if (err.code && pgConnectionErrors.includes(err.code)) {
    return true;
  }

  if (err.message?.includes('Connection terminated') ||
    err.message?.includes('connection timeout') ||
    err.message?.includes('Cannot acquire connection')) {
    return true;
  }

  return false;
}

/**
 * Verifica se o erro é uma violação de constraint do PostgreSQL.
 */
function isConstraintError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const constraintErrorCodes = [
    '23000', // integrity_constraint_violation
    '23001', // restrict_violation
    '23502', // not_null_violation
    '23503', // foreign_key_violation
    '23505', // unique_violation
    '23514', // check_violation
  ];

  const err = error as Error & { code?: string };
  return !!(err.code && constraintErrorCodes.includes(err.code));
}

/**
 * Executa uma query SQL com tratamento de erros padronizado.
 *
 * - Erros de conexão resultam em DatabaseConnectionError (HTTP 503)
 * - Violações de constraint resultam em DatabaseConstraintError (HTTP 409)
 * - Nenhuma mensagem de erro expõe detalhes internos do banco
 *
 * @param text - Query SQL parametrizada
 * @param params - Parâmetros da query (previne SQL injection)
 * @returns Resultado da query
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  try {
    const result = await pool.query<T>(text, params);
    return result;
  } catch (error: unknown) {
    if (isConnectionError(error)) {
      throw new DatabaseConnectionError(error as Error);
    }

    if (isConstraintError(error)) {
      throw new DatabaseConstraintError(error as Error);
    }

    throw error;
  }
}

/**
 * Obtém o pool de conexões para uso direto (ex: transações).
 */
export function getPool(): Pool {
  return pool;
}

/**
 * Encerra o pool de conexões. Usado em shutdown graceful e testes.
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

export default { query, getPool, closePool };
