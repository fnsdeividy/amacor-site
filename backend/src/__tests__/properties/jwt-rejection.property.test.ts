// Feature: admin-login-beneficiary-auth, Property 2: Rejeição de tokens JWT inválidos
// **Validates: Requirements 1.4, 4.1**

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../modules/auth/auth.service';

const TEST_SECRET = 'test-secret-for-jwt-rejection-property';
const DIFFERENT_SECRET = 'completely-different-secret-xyz-123';

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

describe('Property 2: Rejeição de tokens JWT inválidos', () => {
  it('deve rejeitar qualquer string aleatória que não é um JWT válido', () => {
    fc.assert(
      fc.property(fc.string(), (randomString) => {
        const result = verifyToken(randomString);
        expect(result).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('deve rejeitar strings vazias', () => {
    fc.assert(
      fc.property(fc.constant(''), (emptyString) => {
        const result = verifyToken(emptyString);
        expect(result).toBeNull();
      }),
      { numRuns: 10 }
    );
  });

  it('deve rejeitar tokens assinados com um segredo diferente', () => {
    fc.assert(
      fc.property(
        fc.record({
          sub: fc.uuid(),
          email: fc.emailAddress(),
          perfil: fc.constantFrom('admin' as const, 'operador' as const),
          nome: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        (payload) => {
          // Sign with a DIFFERENT secret than what verifyToken expects
          const token = jwt.sign(payload, DIFFERENT_SECRET, { algorithm: 'HS256', expiresIn: '8h' });
          const result = verifyToken(token);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('deve rejeitar tokens expirados', () => {
    fc.assert(
      fc.property(
        fc.record({
          sub: fc.uuid(),
          email: fc.emailAddress(),
          perfil: fc.constantFrom('admin' as const, 'operador' as const),
          nome: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        (payload) => {
          // Sign with correct secret but already expired (expiresIn: -1s)
          const token = jwt.sign(payload, TEST_SECRET, { algorithm: 'HS256', expiresIn: '-1s' });
          const result = verifyToken(token);
          expect(result).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('deve rejeitar tokens com payload manipulado (formato válido mas adulterado)', () => {
    fc.assert(
      fc.property(
        fc.record({
          sub: fc.uuid(),
          email: fc.emailAddress(),
          perfil: fc.constantFrom('admin' as const, 'operador' as const),
          nome: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        fc.string({ minLength: 1, maxLength: 5 }),
        (payload, tampering) => {
          // Generate a valid token
          const validToken = jwt.sign(payload, TEST_SECRET, { algorithm: 'HS256', expiresIn: '8h' });

          // Tamper with the payload portion (second segment of the JWT)
          const parts = validToken.split('.');
          if (parts.length === 3) {
            // Decode payload, modify it, re-encode without re-signing
            const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
            decodedPayload.nome = decodedPayload.nome + tampering;
            const tamperedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString('base64url');
            const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

            const result = verifyToken(tamperedToken);
            expect(result).toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
