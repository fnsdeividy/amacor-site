import { useState } from 'react'
import type { FormFieldConfig } from '../../types/forms'
import { useFormValidation } from '../../hooks/useFormValidation'

export interface ContactFormProps {
  fields: FormFieldConfig[]
  onSubmit: (data: Record<string, string>) => Promise<void>
  submitButtonText?: string
  successMessage?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({
  fields,
  onSubmit,
  submitButtonText = 'Enviar',
  successMessage = 'Mensagem enviada com sucesso!',
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submitError, setSubmitError] = useState<string>('')

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit: validateForm,
    reset,
  } = useFormValidation<Record<string, string>>(fields)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) return

    setStatus('submitting')
    setSubmitError('')

    try {
      await onSubmit(values)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
      setSubmitError(
        'Nao foi possivel enviar sua mensagem. Por favor, tente novamente.'
      )
    }
  }

  return (
    <form onSubmit={handleFormSubmit} noValidate className="w-full space-y-6">
      {/* Success message */}
      {status === 'success' && (
        <div
          role="alert"
          className="rounded-xl bg-confirmation-light border border-confirmation p-5 text-body text-green-800"
        >
          {successMessage}
        </div>
      )}

      {/* Submission error message */}
      {status === 'error' && submitError && (
        <div
          role="alert"
          className="rounded-xl bg-error-light border border-error p-5 text-body text-error"
        >
          {submitError}
        </div>
      )}

      {/* Form fields */}
      {fields.map((field) => {
        const fieldError = touched[field.name] ? errors[field.name] : undefined
        const fieldId = `form-field-${field.name}`
        const errorId = `form-error-${field.name}`

        return (
          <div key={field.name} className="flex flex-col gap-2">
            <label
              htmlFor={fieldId}
              className="text-[15px] font-semibold text-primary-900"
            >
              {field.label}
              {field.required && (
                <span className="text-error ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={fieldId}
                name={field.name}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                required={field.required}
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? errorId : undefined}
                className={`w-full min-h-[140px] px-5 py-4 text-body border-2 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${fieldError
                    ? 'border-error bg-error-light'
                    : 'border-warm-200 bg-white hover:border-warm-300'
                  } transition-colors`}
              />
            ) : (
              <input
                id={fieldId}
                name={field.name}
                type={field.type}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                min={field.min}
                max={field.max}
                required={field.required}
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? errorId : undefined}
                className={`w-full min-h-touch px-5 py-4 text-body border-2 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${fieldError
                    ? 'border-error bg-error-light'
                    : 'border-warm-200 bg-white hover:border-warm-300'
                  } transition-colors`}
              />
            )}

            {/* Inline error message */}
            {fieldError && (
              <span
                id={errorId}
                role="alert"
                className="text-error text-sm mt-0.5"
              >
                {fieldError}
              </span>
            )}
          </div>
        )
      })}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full min-h-touch px-8 py-4 text-body font-bold text-white rounded-xl
          transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300
          ${status === 'submitting'
            ? 'bg-primary-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md'
          }`}
      >
        {status === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          submitButtonText
        )}
      </button>
    </form>
  )
}
