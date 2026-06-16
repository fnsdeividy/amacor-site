// Feature: admin-login-beneficiary-auth, Property 4: Bloqueio por tentativas falhas de login

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * Validates: Requirements 3.5
 *
 * Propriedade 4: Bloqueio por tentativas falhas de login
 * Para qualquer email de admin e qualquer sequência de N tentativas de login
 * com senha incorreta dentro de 15 minutos, se N >= 5 a próxima tentativa deve
 * retornar status 429 independente de a senha ser correta. Se N < 5, uma
 * tentativa com senha correta deve ser aceita.
 */

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Pure implementation of isUserLocked logic extracted from auth.service.ts.
 * This tests the lockout decision logic without database dependency.
 */
function isUserLocked(bloqueadoAte: Date | null): boolean {
  if (!bloqueadoAte) {
    return false;
  }
  const now = new Date();
  return now < new Date(bloqueadoAte);
}

/**
 * Pure implementation of the lockout threshold logic.
 * Returns whether the user should be locked after recording a failed attempt.
 */
function shouldLockAfterFailedAttempt(currentFailedAttempts: number): boolean {
  const newAttempts = currentFailedAttempts + 1;
  return newAttempts >= MAX_FAILED_ATTEMPTS;
}

describe('Property 4: Bloqueio por tentativas falhas de login', () => {
  describe('isUserLocked - bloqueado_ate no futuro implica bloqueio', () => {
    it('para qualquer bloqueado_ate no futuro, usuário deve estar bloqueado', () => {
      fc.assert(
        fc.property(
          // Generate a future date (1 second to 24 hours in the future)
          fc.integer({ min: 1000, max: 86400000 }).map(
            (ms) => new Date(Date.now() + ms)
          ),
          (futureDate) => {
            expect(isUserLocked(futureDate)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('para qualquer bloqueado_ate no passado, usuário NÃO deve estar bloqueado', () => {
      fc.assert(
        fc.property(
          // Generate a past date (1 second to 24 hours in the past)
          fc.integer({ min: 1000, max: 86400000 }).map(
            (ms) => new Date(Date.now() - ms)
          ),
          (pastDate) => {
            expect(isUserLocked(pastDate)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('para bloqueado_ate null, usuário NÃO deve estar bloqueado', () => {
      expect(isUserLocked(null)).toBe(false);
    });
  });

  describe('Threshold de tentativas falhas - bloqueio quando N >= 5', () => {
    it('para qualquer N >= 4 tentativas falhas anteriores (totalizando >= 5 após nova falha), sistema deve bloquear', () => {
      fc.assert(
        fc.property(
          // currentFailedAttempts before recording new failure: 4..9 (will become 5..10)
          fc.integer({ min: MAX_FAILED_ATTEMPTS - 1, max: 10 }),
          (currentAttempts) => {
            expect(shouldLockAfterFailedAttempt(currentAttempts)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('para qualquer N < 4 tentativas falhas anteriores (totalizando < 5 após nova falha), sistema NÃO deve bloquear', () => {
      fc.assert(
        fc.property(
          // currentFailedAttempts before recording new failure: 0..3 (will become 1..4)
          fc.integer({ min: 0, max: MAX_FAILED_ATTEMPTS - 2 }),
          (currentAttempts) => {
            expect(shouldLockAfterFailedAttempt(currentAttempts)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Login flow com mock do banco - comportamento de bloqueio integrado', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      process.env.JWT_SECRET = 'test-secret-key-lockout-property';
      process.env.JWT_EXPIRATION = '8h';
      vi.resetModules();
    });

    afterEach(() => {
      process.env = originalEnv;
      vi.restoreAllMocks();
    });

    it('para qualquer usuário bloqueado (bloqueado_ate no futuro), login retorna rate_limited independente da senha', () => {
      fc.assert(
        fc.asyncProperty(
          // Random future lockout time (1 min to LOCKOUT_DURATION_MINUTES in the future)
          fc.integer({ min: 60000, max: LOCKOUT_DURATION_MINUTES * 60 * 1000 }).map(
            (ms) => new Date(Date.now() + ms)
          ),
          // Random email
          fc.emailAddress(),
          // Random password (could be correct or incorrect - doesn't matter when locked)
          fc.string({ minLength: 8, maxLength: 50 }),
          // Random number of previous failed attempts (>= 5)
          fc.integer({ min: MAX_FAILED_ATTEMPTS, max: 10 }),
          async (lockUntil, email, password, failedAttempts) => {
            // Mock database to return a locked user
            const mockUser = {
              id: '123e4567-e89b-12d3-a456-426614174000',
              nome: 'Test Admin',
              email: email.toLowerCase(),
              senha_hash: '$2b$10$validhashbutdoesntmatterwhenlocked',
              perfil: 'admin',
              status: 'ativo',
              tentativas_login_falhas: failedAttempts,
              bloqueado_ate: lockUntil,
            };

            vi.doMock('../../config/database', () => ({
              query: vi.fn().mockResolvedValue({ rows: [mockUser] }),
            }));

            const { login } = await import('../../modules/auth/auth.service');
            const result = await login(email, password);

            expect(result.success).toBe(false);
            expect(result.error).toBe('rate_limited');

            vi.doUnmock('../../config/database');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('para qualquer usuário com < 5 tentativas falhas e senha correta, login deve ser aceito', () => {
      fc.assert(
        fc.asyncProperty(
          // Random email
          fc.emailAddress(),
          // Random number of previous failed attempts (< MAX)
          fc.integer({ min: 0, max: MAX_FAILED_ATTEMPTS - 1 }),
          async (email, failedAttempts) => {
            const password = 'correct-password-123';
            // Pre-hash the password with bcrypt
            const bcrypt = await import('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);

            const mockUser = {
              id: '123e4567-e89b-12d3-a456-426614174000',
              nome: 'Test Admin',
              email: email.toLowerCase(),
              senha_hash: hashedPassword,
              perfil: 'admin',
              status: 'ativo',
              tentativas_login_falhas: failedAttempts,
              bloqueado_ate: null, // Not locked
            };

            vi.doMock('../../config/database', () => ({
              query: vi.fn().mockResolvedValue({ rows: [mockUser] }),
            }));

            const { login } = await import('../../modules/auth/auth.service');
            const result = await login(email, password);

            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
            expect(result.usuario).toBeDefined();

            vi.doUnmock('../../config/database');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('para qualquer usuário com < 5 tentativas falhas e senha incorreta, login retorna invalid_credentials (não rate_limited)', () => {
      fc.assert(
        fc.asyncProperty(
          // Random email
          fc.emailAddress(),
          // Random wrong password
          fc.string({ minLength: 8, maxLength: 50 }),
          // Random number of previous failed attempts (< MAX)
          fc.integer({ min: 0, max: MAX_FAILED_ATTEMPTS - 2 }),
          async (email, wrongPassword, failedAttempts) => {
            // Hash a DIFFERENT password so bcrypt.compare returns false
            const bcrypt = await import('bcrypt');
            const correctHash = await bcrypt.hash('the-real-password-that-is-different', 10);

            const mockUser = {
              id: '123e4567-e89b-12d3-a456-426614174000',
              nome: 'Test Admin',
              email: email.toLowerCase(),
              senha_hash: correctHash,
              perfil: 'admin',
              status: 'ativo',
              tentativas_login_falhas: failedAttempts,
              bloqueado_ate: null, // Not locked
            };

            vi.doMock('../../config/database', () => ({
              query: vi.fn().mockResolvedValue({ rows: [mockUser] }),
            }));

            const { login } = await import('../../modules/auth/auth.service');
            const result = await login(email, wrongPassword);

            expect(result.success).toBe(false);
            expect(result.error).toBe('invalid_credentials');
            // Crucially, NOT rate_limited since below threshold
            expect(result.error).not.toBe('rate_limited');

            vi.doUnmock('../../config/database');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
