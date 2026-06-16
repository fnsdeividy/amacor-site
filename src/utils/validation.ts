import type { FormFieldConfig, ValidationRule, ValidationResult } from '../types/forms';

/**
 * Rule type for the simplified plan form validation interface.
 */
export interface FormValidationRule {
  type: 'required' | 'email' | 'phone' | 'cep' | 'maxLength';
  message: string;
  value?: number;
}

/**
 * Validates a single value against a single validation rule.
 * Returns the error message if validation fails, or null if it passes.
 */
export function validateRule(value: string, rule: ValidationRule): string | null {
  switch (rule.type) {
    case 'required':
      if (!value || value.trim().length === 0) {
        return rule.message;
      }
      break;

    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return rule.message;
      }
      break;
    }

    case 'phone': {
      const digitsOnly = value.replace(/\D/g, '');
      if (value && (digitsOnly.length < 10 || digitsOnly.length > 11)) {
        return rule.message;
      }
      break;
    }

    case 'minLength': {
      const minLen = typeof rule.value === 'number' ? rule.value : parseInt(String(rule.value), 10);
      if (value && value.length < minLen) {
        return rule.message;
      }
      break;
    }

    case 'maxLength': {
      const maxLen = typeof rule.value === 'number' ? rule.value : parseInt(String(rule.value), 10);
      if (value && value.length > maxLen) {
        return rule.message;
      }
      break;
    }

    case 'min': {
      const minVal = typeof rule.value === 'number' ? rule.value : parseFloat(String(rule.value));
      const numValue = parseFloat(value);
      if (value && !isNaN(numValue) && numValue < minVal) {
        return rule.message;
      }
      break;
    }

    case 'max': {
      const maxVal = typeof rule.value === 'number' ? rule.value : parseFloat(String(rule.value));
      const numVal = parseFloat(value);
      if (value && !isNaN(numVal) && numVal > maxVal) {
        return rule.message;
      }
      break;
    }

    case 'pattern': {
      const regex = rule.value instanceof RegExp
        ? rule.value
        : new RegExp(String(rule.value));
      if (value && !regex.test(value)) {
        return rule.message;
      }
      break;
    }

    case 'cep': {
      const cepDigits = value.replace(/\D/g, '');
      if (value && cepDigits.length !== 8) {
        return rule.message;
      }
      break;
    }
  }

  return null;
}

/**
 * Validates a single field value against its configured validation rules.
 * Returns the first error message encountered, or null if all rules pass.
 */
export function validateField(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    const error = validateRule(value, rule);
    if (error) {
      return error;
    }
  }
  return null;
}

/**
 * Validates all form fields based on their configuration.
 * Returns a ValidationResult with isValid flag and field-level error messages.
 */
export function validateForm(
  values: Record<string, string>,
  fields: FormFieldConfig[]
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = values[field.name] || '';
    const rules: ValidationRule[] = [];

    // Add implicit required rule if field is marked required
    if (field.required) {
      rules.push({
        type: 'required',
        message: `${field.label} é obrigatório.`,
      });
    }

    // Add explicit validation rules from field config
    if (field.validation) {
      rules.push(...field.validation);
    }

    const error = validateField(value, rules);
    if (error) {
      errors[field.name] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates a CEP (Brazilian postal code).
 * Accepts exactly 8 numeric digits after removing formatting characters.
 */
export function validateCep(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length === 8;
}

/**
 * Validates a Brazilian phone number.
 * Must have 10 or 11 digits (DDD + número).
 * 10 digits = landline, 11 digits = mobile.
 */
export function validatePhone(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

/**
 * Validates an email address using standard format.
 */
export function validateEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validates a set of form fields against a rules map.
 * Returns isValid with errors keyed to invalid fields.
 * Error messages in plain Portuguese (≤ 8th-grade reading level).
 */
export function validateFormFields(
  fields: Record<string, string>,
  rules: Record<string, FormValidationRule[]>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = fields[fieldName] || '';

    for (const rule of fieldRules) {
      let error: string | null = null;

      switch (rule.type) {
        case 'required':
          if (!value || value.trim().length === 0) {
            error = rule.message;
          }
          break;

        case 'email':
          if (value && !validateEmail(value)) {
            error = rule.message;
          }
          break;

        case 'phone':
          if (value && !validatePhone(value)) {
            error = rule.message;
          }
          break;

        case 'cep':
          if (value && !validateCep(value)) {
            error = rule.message;
          }
          break;

        case 'maxLength':
          if (value && rule.value !== undefined && value.length > rule.value) {
            error = rule.message;
          }
          break;
      }

      if (error) {
        errors[fieldName] = error;
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
