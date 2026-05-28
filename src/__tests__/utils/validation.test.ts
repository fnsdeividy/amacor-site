import { describe, it, expect } from 'vitest';
import {
  validateRule,
  validateField,
  validateForm,
  validateCep,
  validatePhone,
  validateEmail,
} from '../../utils/validation';
import type { FormFieldConfig, ValidationRule } from '../../types/forms';

describe('validateRule', () => {
  it('returns error for empty required field', () => {
    const rule: ValidationRule = { type: 'required', message: 'Campo obrigatório.' };
    expect(validateRule('', rule)).toBe('Campo obrigatório.');
    expect(validateRule('   ', rule)).toBe('Campo obrigatório.');
  });

  it('returns null for non-empty required field', () => {
    const rule: ValidationRule = { type: 'required', message: 'Campo obrigatório.' };
    expect(validateRule('hello', rule)).toBeNull();
  });

  it('validates email format', () => {
    const rule: ValidationRule = { type: 'email', message: 'Email inválido.' };
    expect(validateRule('invalid', rule)).toBe('Email inválido.');
    expect(validateRule('test@example.com', rule)).toBeNull();
    expect(validateRule('', rule)).toBeNull(); // empty is not checked by email rule
  });

  it('validates phone with at least 10 digits', () => {
    const rule: ValidationRule = { type: 'phone', message: 'Telefone inválido.' };
    expect(validateRule('123456789', rule)).toBe('Telefone inválido.'); // 9 digits
    expect(validateRule('(11) 3105-1234', rule)).toBeNull(); // 10 digits
    expect(validateRule('(11) 91234-5678', rule)).toBeNull(); // 11 digits
  });

  it('validates minLength', () => {
    const rule: ValidationRule = { type: 'minLength', value: 3, message: 'Mínimo 3 caracteres.' };
    expect(validateRule('ab', rule)).toBe('Mínimo 3 caracteres.');
    expect(validateRule('abc', rule)).toBeNull();
  });

  it('validates maxLength', () => {
    const rule: ValidationRule = { type: 'maxLength', value: 5, message: 'Máximo 5 caracteres.' };
    expect(validateRule('abcdef', rule)).toBe('Máximo 5 caracteres.');
    expect(validateRule('abcde', rule)).toBeNull();
  });

  it('validates min numeric value', () => {
    const rule: ValidationRule = { type: 'min', value: 1, message: 'Mínimo 1.' };
    expect(validateRule('0', rule)).toBe('Mínimo 1.');
    expect(validateRule('1', rule)).toBeNull();
    expect(validateRule('10', rule)).toBeNull();
  });

  it('validates max numeric value', () => {
    const rule: ValidationRule = { type: 'max', value: 99999, message: 'Máximo 99999.' };
    expect(validateRule('100000', rule)).toBe('Máximo 99999.');
    expect(validateRule('99999', rule)).toBeNull();
  });

  it('validates pattern', () => {
    const rule: ValidationRule = { type: 'pattern', value: '^[A-Z]+$', message: 'Apenas letras maiúsculas.' };
    expect(validateRule('abc', rule)).toBe('Apenas letras maiúsculas.');
    expect(validateRule('ABC', rule)).toBeNull();
  });

  it('validates CEP (8 numeric digits)', () => {
    const rule: ValidationRule = { type: 'cep', message: 'CEP inválido.' };
    expect(validateRule('1234567', rule)).toBe('CEP inválido.'); // 7 digits
    expect(validateRule('12345678', rule)).toBeNull(); // 8 digits
    expect(validateRule('01504-001', rule)).toBeNull(); // 8 digits with formatting
    expect(validateRule('123456789', rule)).toBe('CEP inválido.'); // 9 digits
  });
});

describe('validateField', () => {
  it('returns first error when multiple rules fail', () => {
    const rules: ValidationRule[] = [
      { type: 'required', message: 'Obrigatório.' },
      { type: 'email', message: 'Email inválido.' },
    ];
    expect(validateField('', rules)).toBe('Obrigatório.');
  });

  it('returns null when all rules pass', () => {
    const rules: ValidationRule[] = [
      { type: 'required', message: 'Obrigatório.' },
      { type: 'email', message: 'Email inválido.' },
    ];
    expect(validateField('test@example.com', rules)).toBeNull();
  });
});

describe('validateForm', () => {
  const fields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
      validation: [{ type: 'maxLength', value: 120, message: 'Máximo 120 caracteres.' }],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: [{ type: 'email', message: 'Email inválido.' }],
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'tel',
      required: true,
      validation: [{ type: 'phone', message: 'Telefone inválido.' }],
    },
  ];

  it('returns isValid true when all fields are valid', () => {
    const values = {
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 91234-5678',
    };
    const result = validateForm(values, fields);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('returns isValid false with errors for invalid fields', () => {
    const values = {
      name: '',
      email: 'invalid-email',
      phone: '123',
    };
    const result = validateForm(values, fields);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBe('Email inválido.');
    expect(result.errors.phone).toBe('Telefone inválido.');
  });

  it('adds implicit required rule for required fields', () => {
    const values = { name: '', email: '', phone: '' };
    const result = validateForm(values, fields);
    expect(result.errors.name).toContain('obrigatório');
  });
});

describe('validateCep', () => {
  it('accepts exactly 8 numeric digits', () => {
    expect(validateCep('12345678')).toBe(true);
    expect(validateCep('01504001')).toBe(true);
  });

  it('accepts formatted CEP (removes non-digits)', () => {
    expect(validateCep('01504-001')).toBe(true);
  });

  it('rejects non-8-digit strings', () => {
    expect(validateCep('1234567')).toBe(false);
    expect(validateCep('123456789')).toBe(false);
    expect(validateCep('')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepts phone with 10+ digits', () => {
    expect(validatePhone('1131051234')).toBe(true);
    expect(validatePhone('(11) 3105-1234')).toBe(true);
    expect(validatePhone('(11) 91234-5678')).toBe(true);
  });

  it('rejects phone with fewer than 10 digits', () => {
    expect(validatePhone('123456789')).toBe(false);
    expect(validatePhone('12345')).toBe(false);
  });
});

describe('validateEmail', () => {
  it('accepts valid email formats', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});
