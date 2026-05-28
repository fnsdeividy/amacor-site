/**
 * Property-based tests for form validation correctness.
 *
 * Feature: amacor-website, Property 1: Form validation correctness
 *
 * Validates: Requirements 5.2, 5.4, 6.2, 6.4, 12.1, 12.5
 *
 * Property: For any form field configuration and any input value, validateForm
 * returns isValid: true if and only if all required fields are non-empty and all
 * field values satisfy their declared constraints, and returns specific error
 * messages for each field that fails validation.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateForm } from '../../utils/validation';
import type { FormFieldConfig, ValidationRule } from '../../types/forms';

// --- Arbitraries ---

/** Generate a field type */

/** Generate a field type */
const fieldType = fc.constantFrom('text', 'email', 'tel', 'number', 'textarea') as fc.Arbitrary<FormFieldConfig['type']>;

/** Generate a field name (simple alphanumeric) */
const fieldName = fc.stringMatching(/^[a-z][a-zA-Z0-9]{1,10}$/);

/** Generate a field label */
const fieldLabel = fc.stringMatching(/^[A-Z][a-zA-Z ]{1,15}$/);

/**
 * Generate a form field config with optional validation rules.
 * We limit the rule types to those that can be deterministically satisfied.
 */
const formFieldConfigArb: fc.Arbitrary<FormFieldConfig> = fc.record({
  name: fieldName,
  label: fieldLabel,
  type: fieldType,
  required: fc.boolean(),
  validation: fc.option(
    fc.array(
      fc.oneof(
        fc.record({
          type: fc.constant('minLength' as const),
          value: fc.integer({ min: 1, max: 5 }),
          message: fc.constant('Mínimo de caracteres não atingido.'),
        }),
        fc.record({
          type: fc.constant('maxLength' as const),
          value: fc.integer({ min: 10, max: 50 }),
          message: fc.constant('Máximo de caracteres excedido.'),
        })
      ) as fc.Arbitrary<ValidationRule>,
      { minLength: 0, maxLength: 2 }
    ),
    { nil: undefined }
  ),
});

/**
 * Generate a list of unique-named form field configs.
 */
const formFieldsArb: fc.Arbitrary<FormFieldConfig[]> = fc
  .array(formFieldConfigArb, { minLength: 1, maxLength: 5 })
  .map((fields) => {
    // Ensure unique names
    const seen = new Set<string>();
    return fields.filter((f) => {
      if (seen.has(f.name)) return false;
      seen.add(f.name);
      return true;
    });
  })
  .filter((fields) => fields.length > 0);

// --- Property Tests ---

describe('Property 1: Form validation correctness', () => {
  it('validateForm returns isValid:true when all required fields are non-empty and all constraints pass', () => {
    fc.assert(
      fc.property(formFieldsArb, (fields) => {
        // Generate valid values for each field
        const values: Record<string, string> = {};
        for (const field of fields) {
          // Create a value that satisfies all constraints
          let minLen = 1;
          let maxLen = 50;

          if (field.validation) {
            for (const rule of field.validation) {
              if (rule.type === 'minLength' && typeof rule.value === 'number') {
                minLen = Math.max(minLen, rule.value);
              }
              if (rule.type === 'maxLength' && typeof rule.value === 'number') {
                maxLen = Math.min(maxLen, rule.value);
              }
            }
          }

          if (minLen > maxLen) maxLen = minLen;

          // Generate a deterministic valid value
          const len = Math.max(minLen, Math.min(maxLen, 8));
          values[field.name] = 'a'.repeat(len);
        }

        const result = validateForm(values, fields);
        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('validateForm returns isValid:false when a required field is empty', () => {
    fc.assert(
      fc.property(
        formFieldsArb.filter((fields) => fields.some((f) => f.required)),
        (fields) => {
          // Set all values to valid, then empty one required field
          const values: Record<string, string> = {};
          let emptyFieldName: string | null = null;

          for (const field of fields) {
            if (field.required && emptyFieldName === null) {
              values[field.name] = '';
              emptyFieldName = field.name;
            } else {
              let minLen = 1;
              let maxLen = 50;
              if (field.validation) {
                for (const rule of field.validation) {
                  if (rule.type === 'minLength' && typeof rule.value === 'number') {
                    minLen = Math.max(minLen, rule.value);
                  }
                  if (rule.type === 'maxLength' && typeof rule.value === 'number') {
                    maxLen = Math.min(maxLen, rule.value);
                  }
                }
              }
              if (minLen > maxLen) maxLen = minLen;
              const len = Math.max(minLen, Math.min(maxLen, 8));
              values[field.name] = 'a'.repeat(len);
            }
          }

          const result = validateForm(values, fields);
          expect(result.isValid).toBe(false);
          expect(emptyFieldName).not.toBeNull();
          expect(result.errors[emptyFieldName!]).toBeDefined();
          expect(result.errors[emptyFieldName!].length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('validateForm returns isValid:false when a field violates minLength constraint', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fieldName,
          label: fieldLabel,
          minLength: fc.integer({ min: 3, max: 10 }),
        }),
        fc.integer({ min: 1, max: 2 }),
        ({ name, label, minLength }, shortLen) => {
          const field: FormFieldConfig = {
            name,
            label,
            type: 'text',
            required: false,
            validation: [
              { type: 'minLength', value: minLength, message: `Mínimo ${minLength} caracteres.` },
            ],
          };

          // Value shorter than minLength
          const tooShort = 'a'.repeat(Math.min(shortLen, minLength - 1));
          const values: Record<string, string> = { [name]: tooShort };

          const result = validateForm(values, [field]);
          expect(result.isValid).toBe(false);
          expect(result.errors[name]).toBe(`Mínimo ${minLength} caracteres.`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('validateForm returns isValid:false when a field violates maxLength constraint', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fieldName,
          label: fieldLabel,
          maxLength: fc.integer({ min: 5, max: 20 }),
        }),
        ({ name, label, maxLength }) => {
          const field: FormFieldConfig = {
            name,
            label,
            type: 'text',
            required: false,
            validation: [
              { type: 'maxLength', value: maxLength, message: `Máximo ${maxLength} caracteres.` },
            ],
          };

          // Value longer than maxLength
          const tooLong = 'a'.repeat(maxLength + 1);
          const values: Record<string, string> = { [name]: tooLong };

          const result = validateForm(values, [field]);
          expect(result.isValid).toBe(false);
          expect(result.errors[name]).toBe(`Máximo ${maxLength} caracteres.`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('validateForm returns specific error messages for each failing field', () => {
    fc.assert(
      fc.property(
        fc.array(fieldName, { minLength: 2, maxLength: 4 }).chain((names) => {
          // Ensure unique names
          const uniqueNames = [...new Set(names)];
          if (uniqueNames.length < 2) return fc.constant(null);

          return fc.constant(uniqueNames);
        }).filter((v): v is string[] => v !== null && v.length >= 2),
        (names) => {
          const fields: FormFieldConfig[] = names.map((name, i) => ({
            name,
            label: `Field${i}`,
            type: 'text' as const,
            required: true,
            validation: [],
          }));

          // All fields empty → each should have its own error
          const values: Record<string, string> = {};
          for (const name of names) {
            values[name] = '';
          }

          const result = validateForm(values, fields);
          expect(result.isValid).toBe(false);

          // Each field should have a specific error message
          for (const field of fields) {
            expect(result.errors[field.name]).toBeDefined();
            expect(result.errors[field.name].length).toBeGreaterThan(0);
          }

          // Number of errors should match number of failing fields
          expect(Object.keys(result.errors).length).toBe(fields.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('validateForm isValid is true iff errors object is empty', () => {
    fc.assert(
      fc.property(
        formFieldsArb,
        fc.boolean(),
        (fields, allValid) => {
          const values: Record<string, string> = {};

          for (const field of fields) {
            if (allValid) {
              // Provide valid values
              let minLen = 1;
              let maxLen = 50;
              if (field.validation) {
                for (const rule of field.validation) {
                  if (rule.type === 'minLength' && typeof rule.value === 'number') {
                    minLen = Math.max(minLen, rule.value);
                  }
                  if (rule.type === 'maxLength' && typeof rule.value === 'number') {
                    maxLen = Math.min(maxLen, rule.value);
                  }
                }
              }
              if (minLen > maxLen) maxLen = minLen;
              values[field.name] = 'a'.repeat(Math.max(minLen, Math.min(maxLen, 8)));
            } else {
              // Provide empty values for required fields to trigger errors
              if (field.required) {
                values[field.name] = '';
              } else {
                values[field.name] = 'valid';
              }
            }
          }

          const result = validateForm(values, fields);

          // The key property: isValid is true iff errors is empty
          if (result.isValid) {
            expect(Object.keys(result.errors).length).toBe(0);
          } else {
            expect(Object.keys(result.errors).length).toBeGreaterThan(0);
          }

          // Converse: if errors is empty, isValid must be true
          if (Object.keys(result.errors).length === 0) {
            expect(result.isValid).toBe(true);
          } else {
            expect(result.isValid).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
