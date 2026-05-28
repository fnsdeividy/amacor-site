import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';
import type { FormFieldConfig } from '../types/forms';

const contactFormConfig: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    required: true,
    maxLength: 120,
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'email',
    required: true,
    validation: [
      { type: 'email', message: 'Informe um e-mail válido.' },
    ],
  },
  {
    name: 'phone',
    label: 'Telefone',
    type: 'tel',
    required: true,
    validation: [
      { type: 'phone', message: 'Informe um telefone válido com pelo menos 10 dígitos.' },
    ],
  },
  {
    name: 'message',
    label: 'Mensagem',
    type: 'textarea',
    required: false,
    maxLength: 1000,
  },
];

describe('useFormValidation', () => {
  it('initializes with empty values for all fields', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    expect(result.current.values.name).toBe('');
    expect(result.current.values.email).toBe('');
    expect(result.current.values.phone).toBe('');
    expect(result.current.values.message).toBe('');
  });

  it('initializes with no errors and no touched fields', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('isValid is false when required fields are empty', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    expect(result.current.isValid).toBe(false);
  });

  it('handleChange updates the field value', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('name', 'João Silva');
    });

    expect(result.current.values.name).toBe('João Silva');
  });

  it('handleBlur marks the field as touched', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleBlur('name');
    });

    expect(result.current.touched.name).toBe(true);
  });

  it('handleBlur validates the field and sets error for empty required field', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleBlur('name');
    });

    expect(result.current.errors.name).toBe('Nome é obrigatório.');
  });

  it('handleBlur clears error when field is valid', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('name', 'João');
      result.current.handleBlur('name');
    });

    expect(result.current.errors.name).toBeUndefined();
  });

  it('validates email format on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('email', 'invalid-email');
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBe('Informe um e-mail válido.');
  });

  it('validates phone format on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('phone', '123');
      result.current.handleBlur('phone');
    });

    expect(result.current.errors.phone).toBe(
      'Informe um telefone válido com pelo menos 10 dígitos.'
    );
  });

  it('handleSubmit validates all fields and returns false when invalid', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    let isValid: boolean;
    act(() => {
      isValid = result.current.handleSubmit();
    });

    expect(isValid!).toBe(false);
    expect(result.current.errors.name).toBeDefined();
    expect(result.current.errors.email).toBeDefined();
    expect(result.current.errors.phone).toBeDefined();
  });

  it('handleSubmit marks all fields as touched', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.phone).toBe(true);
    expect(result.current.touched.message).toBe(true);
  });

  it('handleSubmit returns true when all required fields are valid', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('name', 'João Silva');
      result.current.handleChange('email', 'joao@example.com');
      result.current.handleChange('phone', '11987654321');
    });

    let isValid: boolean;
    act(() => {
      isValid = result.current.handleSubmit();
    });

    expect(isValid!).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('isValid is true when all required fields have valid values', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('name', 'João Silva');
      result.current.handleChange('email', 'joao@example.com');
      result.current.handleChange('phone', '11987654321');
    });

    expect(result.current.isValid).toBe(true);
  });

  it('reset clears all values, errors, and touched state', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    // Fill in some values and trigger validation
    act(() => {
      result.current.handleChange('name', 'João');
      result.current.handleChange('email', 'invalid');
      result.current.handleBlur('email');
    });

    // Verify state is set
    expect(result.current.values.name).toBe('João');
    expect(result.current.errors.email).toBeDefined();
    expect(result.current.touched.email).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.values.name).toBe('');
    expect(result.current.values.email).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('re-validates touched fields on change', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    // Touch the email field with invalid value
    act(() => {
      result.current.handleChange('email', 'bad');
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBe('Informe um e-mail válido.');

    // Now fix the value - should clear error
    act(() => {
      result.current.handleChange('email', 'valid@example.com');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('does not validate untouched fields on change', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleChange('email', 'bad');
    });

    // Email is not touched yet, so no error should appear
    expect(result.current.errors.email).toBeUndefined();
  });

  it('optional fields do not produce required errors', () => {
    const { result } = renderHook(() =>
      useFormValidation<Record<string, string>>(contactFormConfig)
    );

    act(() => {
      result.current.handleBlur('message');
    });

    expect(result.current.errors.message).toBeUndefined();
  });
});
