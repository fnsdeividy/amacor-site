import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock pg module before importing
vi.mock('pg', () => {
  const mockQuery = vi.fn();
  const mockEnd = vi.fn();
  const mockOn = vi.fn();

  const MockPool = vi.fn(() => ({
    query: mockQuery,
    end: mockEnd,
    on: mockOn,
  }));

  return {
    Pool: MockPool,
    __mockQuery: mockQuery,
    __mockEnd: mockEnd,
  };
});

describe('database module', () => {
  let mockQuery: ReturnType<typeof vi.fn>;
  let mockEnd: ReturnType<typeof vi.fn>;
  let queryFn: typeof import('./database').query;
  let closePoolFn: typeof import('./database').closePool;
  let DatabaseConnectionError: typeof import('./database').DatabaseConnectionError;
  let DatabaseConstraintError: typeof import('./database').DatabaseConstraintError;

  beforeEach(async () => {
    vi.resetModules();
    const pgMock = await import('pg');
    mockQuery = (pgMock as unknown as { __mockQuery: ReturnType<typeof vi.fn> }).__mockQuery;
    mockEnd = (pgMock as unknown as { __mockEnd: ReturnType<typeof vi.fn> }).__mockEnd;

    const db = await import('./database');
    queryFn = db.query;
    closePoolFn = db.closePool;
    DatabaseConnectionError = db.DatabaseConnectionError;
    DatabaseConstraintError = db.DatabaseConstraintError;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('query', () => {
    it('deve executar query com sucesso e retornar resultados', async () => {
      const mockResult = { rows: [{ id: '1', nome: 'Teste' }], rowCount: 1 };
      mockQuery.mockResolvedValue(mockResult);

      const result = await queryFn('SELECT * FROM admin_users WHERE id = $1', ['1']);

      expect(result).toEqual(mockResult);
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM admin_users WHERE id = $1', ['1']);
    });

    it('deve executar query sem parâmetros', async () => {
      const mockResult = { rows: [], rowCount: 0 };
      mockQuery.mockResolvedValue(mockResult);

      const result = await queryFn('SELECT 1');

      expect(result).toEqual(mockResult);
      expect(mockQuery).toHaveBeenCalledWith('SELECT 1', undefined);
    });

    it('deve lançar DatabaseConnectionError para ECONNREFUSED', async () => {
      const error = new Error('connect ECONNREFUSED 127.0.0.1:5432');
      (error as Error & { code: string }).code = 'ECONNREFUSED';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('SELECT 1')).rejects.toThrow(DatabaseConnectionError);
      await expect(queryFn('SELECT 1')).rejects.toMatchObject({
        statusCode: 503,
        userMessage: 'Serviço temporariamente indisponível',
      });
    });

    it('deve lançar DatabaseConnectionError para ETIMEDOUT', async () => {
      const error = new Error('connection timeout');
      (error as Error & { code: string }).code = 'ETIMEDOUT';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('SELECT 1')).rejects.toThrow(DatabaseConnectionError);
    });

    it('deve lançar DatabaseConnectionError para erros de código PG de conexão', async () => {
      const error = new Error('connection_failure');
      (error as Error & { code: string }).code = '08006';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('SELECT 1')).rejects.toThrow(DatabaseConnectionError);
      await expect(queryFn('SELECT 1')).rejects.toMatchObject({
        statusCode: 503,
        userMessage: 'Serviço temporariamente indisponível',
      });
    });

    it('deve lançar DatabaseConnectionError para "Connection terminated"', async () => {
      const error = new Error('Connection terminated unexpectedly');
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('SELECT 1')).rejects.toThrow(DatabaseConnectionError);
    });

    it('deve lançar DatabaseConstraintError para unique_violation (23505)', async () => {
      const error = new Error('duplicate key value violates unique constraint "admin_users_email_key"');
      (error as Error & { code: string }).code = '23505';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('INSERT INTO admin_users (email) VALUES ($1)', ['dup@test.com']))
        .rejects.toThrow(DatabaseConstraintError);
      await expect(queryFn('INSERT INTO admin_users (email) VALUES ($1)', ['dup@test.com']))
        .rejects.toMatchObject({
          statusCode: 409,
          userMessage: 'Operação não pode ser realizada',
        });
    });

    it('deve lançar DatabaseConstraintError para not_null_violation (23502)', async () => {
      const error = new Error('null value in column "nome" violates not-null constraint');
      (error as Error & { code: string }).code = '23502';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('INSERT INTO admin_users (nome) VALUES ($1)', [null]))
        .rejects.toThrow(DatabaseConstraintError);
    });

    it('deve lançar DatabaseConstraintError para foreign_key_violation (23503)', async () => {
      const error = new Error('violates foreign key constraint "anexos_solicitacao_id_fkey"');
      (error as Error & { code: string }).code = '23503';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('INSERT INTO anexos (solicitacao_id) VALUES ($1)', ['invalid-uuid']))
        .rejects.toThrow(DatabaseConstraintError);
    });

    it('não deve expor detalhes internos do banco em DatabaseConnectionError', async () => {
      const error = new Error('connection to server at "10.0.0.1" port 5432 failed');
      (error as Error & { code: string }).code = 'ECONNREFUSED';
      mockQuery.mockRejectedValue(error);

      try {
        await queryFn('SELECT * FROM admin_users');
      } catch (e) {
        const dbError = e as InstanceType<typeof DatabaseConnectionError>;
        expect(dbError.userMessage).not.toContain('10.0.0.1');
        expect(dbError.userMessage).not.toContain('5432');
        expect(dbError.userMessage).not.toContain('admin_users');
        expect(dbError.userMessage).toBe('Serviço temporariamente indisponível');
      }
    });

    it('não deve expor detalhes internos do banco em DatabaseConstraintError', async () => {
      const error = new Error('duplicate key value violates unique constraint "admin_users_email_key"');
      (error as Error & { code: string }).code = '23505';
      mockQuery.mockRejectedValue(error);

      try {
        await queryFn('INSERT INTO admin_users (email) VALUES ($1)', ['dup@test.com']);
      } catch (e) {
        const dbError = e as InstanceType<typeof DatabaseConstraintError>;
        expect(dbError.userMessage).not.toContain('admin_users');
        expect(dbError.userMessage).not.toContain('email');
        expect(dbError.userMessage).not.toContain('23505');
        expect(dbError.userMessage).toBe('Operação não pode ser realizada');
      }
    });

    it('deve re-lançar erros não classificados sem modificá-los', async () => {
      const error = new Error('syntax error at or near "SELEC"');
      (error as Error & { code: string }).code = '42601';
      mockQuery.mockRejectedValue(error);

      await expect(queryFn('SELEC 1')).rejects.toThrow('syntax error at or near "SELEC"');
      await expect(queryFn('SELEC 1')).rejects.not.toBeInstanceOf(DatabaseConnectionError);
      await expect(queryFn('SELEC 1')).rejects.not.toBeInstanceOf(DatabaseConstraintError);
    });
  });

  describe('closePool', () => {
    it('deve encerrar o pool de conexões', async () => {
      mockEnd.mockResolvedValue(undefined);

      await closePoolFn();

      expect(mockEnd).toHaveBeenCalledOnce();
    });
  });

  describe('DatabaseConnectionError', () => {
    it('deve ter statusCode 503', () => {
      const error = new DatabaseConnectionError(new Error('test'));
      expect(error.statusCode).toBe(503);
    });

    it('deve ter mensagem genérica para o usuário', () => {
      const error = new DatabaseConnectionError(new Error('connection refused to 10.0.0.1:5432'));
      expect(error.userMessage).toBe('Serviço temporariamente indisponível');
    });

    it('deve ter o nome correto', () => {
      const error = new DatabaseConnectionError(new Error('test'));
      expect(error.name).toBe('DatabaseConnectionError');
    });
  });

  describe('DatabaseConstraintError', () => {
    it('deve ter statusCode 409', () => {
      const error = new DatabaseConstraintError(new Error('test'));
      expect(error.statusCode).toBe(409);
    });

    it('deve ter mensagem genérica para o usuário', () => {
      const error = new DatabaseConstraintError(
        new Error('duplicate key value violates unique constraint "admin_users_email_key"')
      );
      expect(error.userMessage).toBe('Operação não pode ser realizada');
    });

    it('deve ter o nome correto', () => {
      const error = new DatabaseConstraintError(new Error('test'));
      expect(error.name).toBe('DatabaseConstraintError');
    });
  });
});
