import { useState, useCallback, useMemo } from 'react';
import type { FormFieldConfig } from '../types/forms';
import { validateField, validateForm } from '../utils/validation';

export interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (field: keyof T, value: string) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: () => boolean;
  reset: () => void;
  isValid: boolean;
}

/**
 * Generic form validation hook.
 * Validates on blur (only for touched fields) and on submit (all fields).
 * Uses validation utility functions from src/utils/validation.ts.
 */
export function useFormValidation<T extends Record<string, string>>(
  config: FormFieldConfig[]
): UseFormValidationReturn<T> {
  // Build initial values from config field names
  const initialValues = useMemo(() => {
    const vals: Record<string, string> = {};
    for (const field of config) {
      vals[field.name] = '';
    }
    return vals as T;
  }, [config]);

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /**
   * Validates a single field and returns the error message (or undefined).
   */
  const validateSingleField = useCallback(
    (fieldName: keyof T, value: string): string | undefined => {
      const fieldConfig = config.find((f) => f.name === fieldName);
      if (!fieldConfig) return undefined;

      const rules = [...(fieldConfig.validation || [])];

      // Add implicit required rule if field is marked required
      if (fieldConfig.required) {
        rules.unshift({
          type: 'required',
          message: `${fieldConfig.label} é obrigatório.`,
        });
      }

      const error = validateField(value, rules);
      return error || undefined;
    },
    [config]
  );

  /**
   * Updates the value for a field. Does not trigger validation.
   */
  const handleChange = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // If the field has been touched, re-validate on change
      setTouched((prevTouched) => {
        if (prevTouched[field]) {
          const error = validateSingleField(field, value);
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (error) {
              newErrors[field] = error;
            } else {
              delete newErrors[field];
            }
            return newErrors;
          });
        }
        return prevTouched;
      });
    },
    [validateSingleField]
  );

  /**
   * Marks a field as touched and validates it.
   */
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate the field on blur
      setValues((currentValues) => {
        const value = currentValues[field] as string;
        const error = validateSingleField(field, value);
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (error) {
            newErrors[field] = error;
          } else {
            delete newErrors[field];
          }
          return newErrors;
        });
        return currentValues;
      });
    },
    [validateSingleField]
  );

  /**
   * Validates all fields and returns true if the form is valid.
   * Marks all fields as touched.
   */
  const handleSubmit = useCallback((): boolean => {
    // Mark all fields as touched
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    for (const field of config) {
      allTouched[field.name as keyof T] = true;
    }
    setTouched(allTouched);

    // Validate all fields using the validateForm utility
    const result = validateForm(values as unknown as Record<string, string>, config);

    // Set errors from validation result
    setErrors(result.errors as Partial<Record<keyof T, string>>);

    return result.isValid;
  }, [config, values]);

  /**
   * Resets all values, errors, and touched state.
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Computed validity: true when there are no errors and all required fields have values.
   */
  const isValid = useMemo(() => {
    // Check if there are any current errors
    if (Object.keys(errors).length > 0) return false;

    // Check that all required fields have non-empty values
    for (const field of config) {
      if (field.required) {
        const value = values[field.name as keyof T] as string;
        if (!value || value.trim().length === 0) return false;
      }
    }

    return true;
  }, [errors, values, config]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isValid,
  };
}
