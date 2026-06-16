import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateToken, verifyToken } from './auth.service';
import type { AdminUserPublic } from './auth.service';

describe('auth.service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';
    process.env.JWT_EXPIRATION = '8h';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('gera um token JWT válido', () => {
      const user: AdminUserPublic = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Admin Test',
        email: 'admin@test.com',
        perfil: 'admin',
      };

      const token = generateToken(user);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('lança erro se JWT_SECRET não configurado', () => {
      delete process.env.JWT_SECRET;
      const user: AdminUserPublic = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Admin Test',
        email: 'admin@test.com',
        perfil: 'admin',
      };

      expect(() => generateToken(user)).toThrow('JWT_SECRET não configurado');
    });
  });

  describe('verifyToken', () => {
    it('verifica e decodifica um token válido', () => {
      const user: AdminUserPublic = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Admin Test',
        email: 'admin@test.com',
        perfil: 'admin',
      };

      const token = generateToken(user);
      const payload = verifyToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe(user.id);
      expect(payload?.email).toBe(user.email);
      expect(payload?.perfil).toBe(user.perfil);
      expect(payload?.nome).toBe(user.nome);
    });

    it('retorna null para token inválido', () => {
      expect(verifyToken('invalid-token')).toBeNull();
    });

    it('retorna null para token com segredo diferente', () => {
      const user: AdminUserPublic = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Admin Test',
        email: 'admin@test.com',
        perfil: 'admin',
      };

      const token = generateToken(user);

      // Mudar o segredo
      process.env.JWT_SECRET = 'different-secret';
      expect(verifyToken(token)).toBeNull();
    });

    it('retorna null se JWT_SECRET não configurado', () => {
      const user: AdminUserPublic = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Admin Test',
        email: 'admin@test.com',
        perfil: 'admin',
      };

      const token = generateToken(user);
      delete process.env.JWT_SECRET;
      expect(verifyToken(token)).toBeNull();
    });

    it('retorna null para string vazia', () => {
      expect(verifyToken('')).toBeNull();
    });
  });
});
