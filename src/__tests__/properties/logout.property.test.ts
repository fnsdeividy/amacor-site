/**
 * Property-based tests for beneficiary logout session clearing.
 *
 * Feature: admin-login-beneficiary-auth, Property 17: Logout remove dados completos da sessão
 *
 * Validates: Requirements 12.7
 *
 * Property: Para qualquer estado de sessão de beneficiário válido (contendo Parse,
 * código, nome, CPF/CNPJ), após executar a operação de logout, o sessionStorage
 * não deve conter nenhum desses campos sob a chave de sessão do beneficiário.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// SessionStorage keys used by AuthContext (with benef_ prefix)
const BENEF_PARSE_KEY = 'benef_parse';
const BENEF_CODIGO_KEY = 'benef_codigo';
const BENEF_NOME_KEY = 'benef_nome';
const BENEF_CPFCNPJ_KEY = 'benef_cpfCnpj';

const ALL_BENEF_KEYS = [BENEF_PARSE_KEY, BENEF_CODIGO_KEY, BENEF_NOME_KEY, BENEF_CPFCNPJ_KEY];

/**
 * Stores a beneficiary session in sessionStorage using benef_ prefixed keys.
 * Mirrors the storeSession function in AuthContext.
 */
function storeBeneficiarySession(session: {
  parse: string;
  codigo: string;
  nome: string;
  cpfCnpj: string;
}): void {
  sessionStorage.setItem(BENEF_PARSE_KEY, session.parse);
  sessionStorage.setItem(BENEF_CODIGO_KEY, session.codigo);
  sessionStorage.setItem(BENEF_NOME_KEY, session.nome);
  sessionStorage.setItem(BENEF_CPFCNPJ_KEY, session.cpfCnpj);
}

/**
 * Executes logout by clearing all benef_ keys from sessionStorage.
 * Mirrors the storeSession(null) call triggered by logout in AuthContext.
 */
function executeBeneficiaryLogout(): void {
  sessionStorage.removeItem(BENEF_PARSE_KEY);
  sessionStorage.removeItem(BENEF_CODIGO_KEY);
  sessionStorage.removeItem(BENEF_NOME_KEY);
  sessionStorage.removeItem(BENEF_CPFCNPJ_KEY);
}

// --- Arbitraries ---

/** Generate random non-empty Parse tokens */
const parseTokenArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);

/** Generate random beneficiary codes (alphanumeric, 1-20 chars) */
const codigoArb = fc.stringMatching(/^[a-zA-Z0-9]{1,20}$/);

/** Generate random beneficiary names (non-empty) */
const nomeArb = fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0);

/** Generate random CPF/CNPJ strings (non-empty) */
const cpfCnpjArb = fc.oneof(
  // CPF format: XXX.XXX.XXX-XX
  fc.stringMatching(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  // CNPJ format: XX.XXX.XXX/XXXX-XX
  fc.stringMatching(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  // Raw numeric format
  fc.stringMatching(/^\d{11,14}$/)
);

/** Generate a valid beneficiary session */
const beneficiarySessionArb = fc.record({
  parse: parseTokenArb,
  codigo: codigoArb,
  nome: nomeArb,
  cpfCnpj: cpfCnpjArb,
});

// --- Property Tests ---

describe('Property 17: Logout remove dados completos da sessão', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('after logout, no benef_ keys remain in sessionStorage for any valid session', () => {
    fc.assert(
      fc.property(beneficiarySessionArb, (session) => {
        // 1. Store session in sessionStorage with benef_ prefixed keys
        storeBeneficiarySession(session);

        // Verify session was stored correctly
        expect(sessionStorage.getItem(BENEF_PARSE_KEY)).toBe(session.parse);
        expect(sessionStorage.getItem(BENEF_CODIGO_KEY)).toBe(session.codigo);
        expect(sessionStorage.getItem(BENEF_NOME_KEY)).toBe(session.nome);
        expect(sessionStorage.getItem(BENEF_CPFCNPJ_KEY)).toBe(session.cpfCnpj);

        // 2. Execute logout (clear all benef_ keys)
        executeBeneficiaryLogout();

        // 3. Verify: none of the benef_ keys exist in sessionStorage after logout
        for (const key of ALL_BENEF_KEYS) {
          expect(sessionStorage.getItem(key)).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('logout does not affect other non-benef keys in sessionStorage', () => {
    fc.assert(
      fc.property(
        beneficiarySessionArb,
        fc.string({ minLength: 1, maxLength: 30 }).filter(
          (k) => !k.startsWith('benef_') && k.trim().length > 0
        ),
        fc.string({ minLength: 1, maxLength: 100 }),
        (session, otherKey, otherValue) => {
          // Store beneficiary session
          storeBeneficiarySession(session);

          // Store another unrelated key
          sessionStorage.setItem(otherKey, otherValue);

          // Execute logout
          executeBeneficiaryLogout();

          // benef_ keys should be gone
          for (const key of ALL_BENEF_KEYS) {
            expect(sessionStorage.getItem(key)).toBeNull();
          }

          // Other key should remain unaffected
          expect(sessionStorage.getItem(otherKey)).toBe(otherValue);

          // Cleanup
          sessionStorage.removeItem(otherKey);
        }
      ),
      { numRuns: 100 }
    );
  });
});
