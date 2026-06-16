import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Request, Response } from 'express';
import { authMiddleware } from './auth';
import { generateToken } from '../modules/auth/auth.service';
import { AdminUserPublic } from '../modules/auth/auth.service';

// Set JWT_SECRET for tests
const TEST_SECRET = 'test-secret-key-for-middleware-tests';

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

afterAll(() => {
  delete process.env.JWT_SECRET;
});

/**
 * Helper to create a mock Express Request.
 */
function createMockRequest(authHeader?: string): Partial<Request> {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
  };
}

/**
 * Helper to create a mock Express Response.
 */
function createMockResponse(): Partial<Response> & { statusCode?: number; body?: unknown } {
  const res: Partial<Response> & { statusCode?: number; body?: unknown } = {};
  res.status = ((code: number) => {
    res.statusCode = code;
    return res;
  }) as unknown as Response['status'];
  res.json = ((data: unknown) => {
    res.body = data;
    return res;
  }) as unknown as Response['json'];
  return res;
}

describe('authMiddleware', () => {
  const validUser: AdminUserPublic = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Admin Test',
    email: 'admin@amacor.com.br',
    perfil: 'admin',
  };

  describe('rejects with 401', () => {
    it('should return 401 when Authorization header is missing', () => {
      const req = createMockRequest() as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });

    it('should return 401 when Authorization header is empty string', () => {
      const req = createMockRequest('') as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });

    it('should return 401 when token format is not Bearer', () => {
      const req = createMockRequest('Basic some-token') as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });

    it('should return 401 when token has no scheme prefix', () => {
      const req = createMockRequest('some-token-without-prefix') as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });

    it('should return 401 when token is an invalid JWT string', () => {
      const req = createMockRequest('Bearer not-a-valid-jwt') as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });

    it('should return 401 when token is signed with a different secret', () => {
      // Generate a token with a different secret
      const originalSecret = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'different-secret';
      const token = generateToken(validUser);
      process.env.JWT_SECRET = originalSecret;

      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });

    it('should return 401 when Bearer has extra spaces (malformed header)', () => {
      const req = createMockRequest('Bearer  extra-space-token') as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ erro: 'Não autorizado' });
      expect(nextCalled).toBe(false);
    });
  });

  describe('accepts valid tokens', () => {
    it('should call next() and attach user to request with a valid token', () => {
      const token = generateToken(validUser);
      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(nextCalled).toBe(true);
      expect(req.user).toBeDefined();
      expect(req.user!.sub).toBe(validUser.id);
      expect(req.user!.email).toBe(validUser.email);
      expect(req.user!.perfil).toBe(validUser.perfil);
      expect(req.user!.nome).toBe(validUser.nome);
    });

    it('should work with operador profile', () => {
      const operador: AdminUserPublic = {
        id: '987e6543-e21b-12d3-a456-426614174999',
        nome: 'Operador Test',
        email: 'operador@amacor.com.br',
        perfil: 'operador',
      };
      const token = generateToken(operador);
      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authMiddleware(req, res as Response, next);

      expect(nextCalled).toBe(true);
      expect(req.user).toBeDefined();
      expect(req.user!.sub).toBe(operador.id);
      expect(req.user!.perfil).toBe('operador');
    });
  });
});
