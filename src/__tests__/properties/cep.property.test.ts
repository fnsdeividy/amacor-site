import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateCep } from '../../utils/validation';

/**
 * Feature: amacor-website, Property 2: CEP format validation
 *
 * For any string input, the CEP validation function SHALL accept the input
 * if and only if it consists of exactly 8 numeric digits (after removing
 * formatting characters), and SHALL reject all other inputs.
 *
 * Validates: Requirements 7.18
 */
describe('Property 2: CEP format validation', () => {
  it('accepts any string that contains exactly 8 numeric digits after removing non-digit characters', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 8, maxLength: 8 }),
        (digits) => {
          // Pure 8-digit strings should always be accepted
          expect(validateCep(digits)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('accepts formatted CEPs (8 digits with hyphen separator)', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 8, maxLength: 8 }),
        (digits) => {
          // Format as XXXXX-XXX (standard CEP format)
          const formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
          expect(validateCep(formatted)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('accepts formatted CEPs with dots and hyphens (8 digits with formatting)', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 8, maxLength: 8 }),
        (digits) => {
          // Format as XX.XXX-XXX (alternative format)
          const formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}-${digits.slice(5)}`;
          expect(validateCep(formatted)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects strings with fewer than 8 numeric digits', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 0, maxLength: 7 }),
        (digits) => {
          expect(validateCep(digits)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects strings with more than 8 numeric digits', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 9, maxLength: 20 }),
        (digits) => {
          expect(validateCep(digits)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any arbitrary string, accepts iff exactly 8 digits after removing non-digits', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (input) => {
          const digitsOnly = input.replace(/\D/g, '');
          const expected = digitsOnly.length === 8;
          expect(validateCep(input)).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});
