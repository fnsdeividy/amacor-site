/**
 * Property-based tests for beneficiary registration field validation.
 *
 * Feature: admin-login-beneficiary-auth, Property 16: Validação de campos de cadastro do beneficiário
 *
 * Validates: Requirements 13.1, 13.4, 12.5
 *
 * Property: For any pair (matrícula, senha) submitted to registration, validation
 * must accept if and only if: matrícula has between 1 and 20 alphanumeric characters
 * and senha has between 6 and 20 characters. Empty fields or fields outside these
 * limits must be rejected without sending to the webservice.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateMatricula, validateSenha } from '../../pages/Register';

// --- Arbitraries ---

/** Valid matrícula: 1-20 alphanumeric characters */
const validMatriculaArb = fc.stringMatching(/^[a-zA-Z0-9]{1,20}$/);

/** Invalid matrícula: empty string */
const emptyMatriculaArb = fc.constant('');

/** Invalid matrícula: whitespace-only strings */
const whitespaceOnlyArb = fc.stringOf(fc.constant(' '), { minLength: 1, maxLength: 10 });

/** Invalid matrícula: too long (>20 alphanumeric chars) */
const tooLongMatriculaArb = fc.stringMatching(/^[a-zA-Z0-9]{21,40}$/);

/** Invalid matrícula: contains non-alphanumeric characters */
const nonAlphanumericMatriculaArb = fc
  .tuple(
    fc.stringMatching(/^[a-zA-Z0-9]{0,9}$/),
    fc.constantFrom('!', '@', '#', '$', '%', ' ', '-', '_', '.', '/'),
    fc.stringMatching(/^[a-zA-Z0-9]{0,9}$/)
  )
  .map(([prefix, special, suffix]) => prefix + special + suffix)
  .filter((s) => s.length >= 1 && s.length <= 20);

/** Valid senha: 6-20 characters (any printable) */
const validSenhaArb = fc.string({ minLength: 6, maxLength: 20 }).filter((s) => s.length >= 6);

/** Invalid senha: empty string */
const emptySenhaArb = fc.constant('');

/** Invalid senha: too short (1-5 chars) */
const tooShortSenhaArb = fc.string({ minLength: 1, maxLength: 5 }).filter((s) => s.length >= 1 && s.length <= 5);

/** Invalid senha: too long (>20 chars) */
const tooLongSenhaArb = fc.string({ minLength: 21, maxLength: 50 }).filter((s) => s.length >= 21);

// --- Property Tests ---

describe('Property 16: Validação de campos de cadastro do beneficiário', () => {
  describe('validateMatricula', () => {
    it('accepts any string of 1-20 alphanumeric characters', () => {
      fc.assert(
        fc.property(validMatriculaArb, (matricula) => {
          const result = validateMatricula(matricula);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects empty strings', () => {
      fc.assert(
        fc.property(emptyMatriculaArb, (matricula) => {
          const result = validateMatricula(matricula);
          expect(result).not.toBeNull();
        }),
        { numRuns: 1 }
      );
    });

    it('rejects whitespace-only strings', () => {
      fc.assert(
        fc.property(whitespaceOnlyArb, (matricula) => {
          const result = validateMatricula(matricula);
          expect(result).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects strings longer than 20 characters', () => {
      fc.assert(
        fc.property(tooLongMatriculaArb, (matricula) => {
          const result = validateMatricula(matricula);
          expect(result).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects strings containing non-alphanumeric characters', () => {
      fc.assert(
        fc.property(nonAlphanumericMatriculaArb, (matricula) => {
          const result = validateMatricula(matricula);
          expect(result).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('acceptance is equivalent to matching /^[a-zA-Z0-9]{1,20}$/', () => {
      const anyStringArb = fc.string({ minLength: 0, maxLength: 30 });
      fc.assert(
        fc.property(anyStringArb, (input) => {
          const result = validateMatricula(input);
          const isValid = /^[a-zA-Z0-9]{1,20}$/.test(input);
          if (isValid) {
            expect(result).toBeNull();
          } else {
            expect(result).not.toBeNull();
          }
        }),
        { numRuns: 200 }
      );
    });
  });

  describe('validateSenha', () => {
    it('accepts any string of 6-20 characters', () => {
      fc.assert(
        fc.property(validSenhaArb, (senha) => {
          const result = validateSenha(senha);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects empty strings', () => {
      fc.assert(
        fc.property(emptySenhaArb, (senha) => {
          const result = validateSenha(senha);
          expect(result).not.toBeNull();
        }),
        { numRuns: 1 }
      );
    });

    it('rejects strings shorter than 6 characters', () => {
      fc.assert(
        fc.property(tooShortSenhaArb, (senha) => {
          const result = validateSenha(senha);
          expect(result).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects strings longer than 20 characters', () => {
      fc.assert(
        fc.property(tooLongSenhaArb, (senha) => {
          const result = validateSenha(senha);
          expect(result).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('acceptance is equivalent to length being between 6 and 20 inclusive', () => {
      const anyStringArb = fc.string({ minLength: 0, maxLength: 30 });
      fc.assert(
        fc.property(anyStringArb, (input) => {
          const result = validateSenha(input);
          const isValid = input.length >= 6 && input.length <= 20;
          if (isValid) {
            expect(result).toBeNull();
          } else {
            expect(result).not.toBeNull();
          }
        }),
        { numRuns: 200 }
      );
    });
  });

  describe('Combined registration validation', () => {
    it('both fields valid iff matrícula is 1-20 alnum AND senha is 6-20 chars', () => {
      const inputArb = fc.tuple(
        fc.string({ minLength: 0, maxLength: 25 }),
        fc.string({ minLength: 0, maxLength: 25 })
      );

      fc.assert(
        fc.property(inputArb, ([matricula, senha]) => {
          const matriculaResult = validateMatricula(matricula);
          const senhaResult = validateSenha(senha);

          const matriculaValid = /^[a-zA-Z0-9]{1,20}$/.test(matricula);
          const senhaValid = senha.length >= 6 && senha.length <= 20;

          const bothAccepted = matriculaResult === null && senhaResult === null;
          const bothShouldBeValid = matriculaValid && senhaValid;

          expect(bothAccepted).toBe(bothShouldBeValid);
        }),
        { numRuns: 200 }
      );
    });
  });
});
