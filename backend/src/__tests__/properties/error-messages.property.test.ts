// Feature: admin-login-beneficiary-auth, Property 3: Mensagens de erro não expõem detalhes internos do banco
// **Validates: Requirements 2.6**

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import fc from 'fast-check';
import {
  errorHandler,
  AppError,
} from '../../middleware/errorHandler';
import {
  DatabaseConstraintError,
} from '../../config/database';

// Mock logger to prevent actual output during tests
vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

function createMockRequest(): Request {
  return {
    method: 'POST',
    path: '/api/test',
    ip: '127.0.0.1',
    get: vi.fn().mockReturnValue('test-agent'),
  } as unknown as Request;
}

function createMockResponse(): { statusCode: number; body: unknown; status: (code: number) => unknown; json: (data: unknown) => unknown } {
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
  return res;
}

/**
 * Arbitrary for PostgreSQL error codes that represent constraint violations.
 */
const pgConstraintCodes = fc.constantFrom(
  '23000', // integrity_constraint_violation
  '23001', // restrict_violation
  '23502', // not_null_violation
  '23503', // foreign_key_violation
  '23505', // unique_violation
  '23514', // check_violation
);

/**
 * Known response messages that the error handler returns.
 * We need to ensure generated names don't accidentally match substrings of these.
 */
const KNOWN_RESPONSES = [
  'Operação não pode ser realizada',
  'Erro interno do servidor',
  'Serviço temporariamente indisponível',
  'erro',
];

/**
 * Checks if a generated name could be a substring of known response messages.
 */
function isSubstringOfKnownResponse(name: string): boolean {
  const lower = name.toLowerCase();
  return KNOWN_RESPONSES.some(
    (resp) => resp.toLowerCase().includes(lower) || lower.includes('erro')
  );
}

/**
 * Arbitrary for random table names (simulating real PG table names).
 * Uses a prefix "tbl_" to avoid collisions with response message substrings.
 */
const tableNameArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
  { minLength: 4, maxLength: 20 }
).map((s) => `tbl_${s}`).filter((name) => !isSubstringOfKnownResponse(name));

/**
 * Arbitrary for random column names.
 * Uses a prefix "col_" to avoid collisions with response message substrings.
 */
const columnNameArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
  { minLength: 4, maxLength: 20 }
).map((s) => `col_${s}`).filter((name) => !isSubstringOfKnownResponse(name));

/**
 * Arbitrary for random constraint names (e.g. "users_email_key", "solicitacoes_pkey").
 */
const constraintNameArb = fc.tuple(tableNameArb, columnNameArb).map(
  ([table, col]) => `${table}_${col}_key`
);

/**
 * Arbitrary for stack traces.
 */
const stackTraceArb = fc.tuple(
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz/'.split('')), { minLength: 5, maxLength: 40 }),
  fc.nat({ max: 500 }),
  fc.nat({ max: 100 }),
).map(([path, line, col]) => `at Object.<anonymous> (${path}.ts:${line}:${col})`);

/**
 * Arbitrary that generates PostgreSQL constraint violation error objects.
 */
const pgConstraintErrorArb = fc.record({
  code: pgConstraintCodes,
  table: tableNameArb,
  column: columnNameArb,
  constraint: constraintNameArb,
  stack: stackTraceArb,
  message: fc.oneof(
    // unique violation
    fc.tuple(constraintNameArb, tableNameArb).map(
      ([constraint, table]) => `duplicate key value violates unique constraint "${constraint}" on table "${table}"`
    ),
    // not-null violation
    fc.tuple(columnNameArb, tableNameArb).map(
      ([col, table]) => `null value in column "${col}" of relation "${table}" violates not-null constraint`
    ),
    // foreign key violation
    fc.tuple(constraintNameArb, tableNameArb).map(
      ([constraint, table]) => `insert or update on table "${table}" violates foreign key constraint "${constraint}"`
    ),
    // check violation
    fc.tuple(constraintNameArb, tableNameArb).map(
      ([constraint, table]) => `new row for relation "${table}" violates check constraint "${constraint}"`
    ),
  ),
});

describe('Property 3: Mensagens de erro não expõem detalhes internos do banco', () => {
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('DatabaseConstraintError responses never expose table names, column names, constraint names, PG error codes, or stack traces', () => {
    fc.assert(
      fc.property(pgConstraintErrorArb, (pgError) => {
        const req = createMockRequest();
        const res = createMockResponse();

        // Create an error object that simulates what pg library throws
        const originalError = new Error(pgError.message) as Error & { code?: string; table?: string; column?: string; constraint?: string };
        originalError.code = pgError.code;
        originalError.table = pgError.table;
        originalError.column = pgError.column;
        originalError.constraint = pgError.constraint;
        originalError.stack = `Error: ${pgError.message}\n    ${pgError.stack}`;

        // Pass through DatabaseConstraintError (as the database module would wrap it)
        const constraintErr = new DatabaseConstraintError(originalError);

        errorHandler(constraintErr, req, res as unknown as Response, next);

        const body = res.body as { erro: string };
        const responseText = JSON.stringify(body);

        // Response must NOT contain table name
        expect(responseText).not.toContain(pgError.table);
        // Response must NOT contain column name
        expect(responseText).not.toContain(pgError.column);
        // Response must NOT contain constraint name
        expect(responseText).not.toContain(pgError.constraint);
        // Response must NOT contain PG error code
        expect(responseText).not.toContain(pgError.code);
        // Response must NOT contain stack trace
        expect(responseText).not.toContain('.ts:');
        // Response must return a generic user-friendly message
        expect(body.erro).toBe('Operação não pode ser realizada');
        // Status must be 409
        expect(res.statusCode).toBe(409);
      }),
      { numRuns: 100 }
    );
  });

  it('Unhandled errors with PG-like messages never expose internal details', () => {
    fc.assert(
      fc.property(pgConstraintErrorArb, (pgError) => {
        const req = createMockRequest();
        const res = createMockResponse();

        // Simulate an unhandled error that contains PG details in its message
        const err = new Error(pgError.message) as Error & { code?: string };
        err.code = pgError.code;
        err.stack = `Error: ${pgError.message}\n    ${pgError.stack}`;

        errorHandler(err, req, res as unknown as Response, next);

        const body = res.body as { erro: string };
        const responseText = JSON.stringify(body);

        // Response must NOT contain table name
        expect(responseText).not.toContain(pgError.table);
        // Response must NOT contain column name
        expect(responseText).not.toContain(pgError.column);
        // Response must NOT contain constraint name
        expect(responseText).not.toContain(pgError.constraint);
        // Response must NOT contain PG error code
        expect(responseText).not.toContain(pgError.code);
        // Response must NOT contain stack trace paths
        expect(responseText).not.toContain('.ts:');
        // Must return generic error message
        expect(body.erro).toBe('Erro interno do servidor');
        // Status must be 500
        expect(res.statusCode).toBe(500);
      }),
      { numRuns: 100 }
    );
  });

  it('AppError with accidentally leaked PG details gets sanitized', () => {
    fc.assert(
      fc.property(
        pgConstraintErrorArb,
        fc.integer({ min: 400, max: 599 }),
        (pgError, statusCode) => {
          const req = createMockRequest();
          const res = createMockResponse();

          // Simulate an AppError where someone accidentally passes a raw PG message
          const err = new AppError(statusCode, pgError.message);

          errorHandler(err, req, res as unknown as Response, next);

          const body = res.body as { erro: string };
          const responseText = JSON.stringify(body);

          // Response must NOT contain table name
          expect(responseText).not.toContain(pgError.table);
          // Response must NOT contain column name
          expect(responseText).not.toContain(pgError.column);
          // Response must NOT contain constraint name
          expect(responseText).not.toContain(pgError.constraint);
          // The sanitized message should be generic
          expect(body.erro).toBe('Erro interno do servidor');
        }
      ),
      { numRuns: 100 }
    );
  });
});
