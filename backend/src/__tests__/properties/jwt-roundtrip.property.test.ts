// Feature: admin-login-beneficiary-auth, Property 1: Round-trip de autenticação JWT
import { describe, it, expect, beforeAll } from 'vitest';
import fc from 'fast-check';
import { generateToken, verifyToken } from '../../modules/auth/auth.service';
import type { AdminUserPublic, JwtPayload } from '../../modules/auth/auth.service';

/**
 * Validates: Requirements 1.3, 3.1
 *
 * Property 1: Round-trip de autenticação JWT
 * Para qualquer payload de usuário admin válido (id, email, perfil),
 * assinar o payload com JWT (HS256) e depois verificar o token resultante
 * deve produzir um payload equivalente ao original (com campos adicionais iat e exp).
 */

// Arbitrary for generating valid AdminUserPublic data
const adminUserArbitrary: fc.Arbitrary<AdminUserPublic> = fc.record({
  id: fc.uuid(),
  nome: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
  email: fc.emailAddress(),
  perfil: fc.constantFrom('admin' as const, 'operador' as const),
});

describe('Property 1: Round-trip de autenticação JWT', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-for-property-based-testing-jwt-roundtrip';
  });

  it('generateToken followed by verifyToken should produce a payload equivalent to the original', () => {
    fc.assert(
      fc.property(adminUserArbitrary, (user: AdminUserPublic) => {
        // Generate token from user payload
        const token = generateToken(user);

        // Verify the token
        const decoded = verifyToken(token);

        // The decoded payload must not be null
        expect(decoded).not.toBeNull();

        // The decoded payload must match the original user data
        const payload = decoded as JwtPayload;
        expect(payload.sub).toBe(user.id);
        expect(payload.email).toBe(user.email);
        expect(payload.perfil).toBe(user.perfil);
        expect(payload.nome).toBe(user.nome);

        // JWT should include iat and exp fields
        const rawDecoded = decoded as JwtPayload & { iat: number; exp: number };
        expect(rawDecoded.iat).toBeTypeOf('number');
        expect(rawDecoded.exp).toBeTypeOf('number');
        expect(rawDecoded.exp).toBeGreaterThan(rawDecoded.iat);
      }),
      { numRuns: 100 }
    );
  });
});
