import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContactForm from './ContactForm'
import type { FormFieldConfig } from '../../types/forms'

const mockFields: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    required: true,
    maxLength: 100,
    placeholder: 'Seu nome completo',
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'email',
    required: true,
    maxLength: 254,
    placeholder: 'seu@email.com',
    validation: [
      { type: 'email', message: 'Informe um e-mail válido.' },
    ],
  },
  {
    name: 'phone',
    label: 'Telefone',
    type: 'tel',
    required: true,
    maxLength: 15,
    placeholder: '(11) 99999-9999',
    validation: [
      { type: 'phone', message: 'Informe um telefone válido.' },
    ],
  },
  {
    name: 'message',
    label: 'Mensagem',
    type: 'textarea',
    required: false,
    maxLength: 2000,
    placeholder: 'Sua mensagem',
  },
]

describe('ContactForm', () => {
  it('renders all configured fields with labels', () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    expect(screen.getByLabelText(/Nome/)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Telefone/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mensagem/)).toBeInTheDocument()
  })

  it('renders submit button with custom text', () => {
    const onSubmit = vi.fn()
    render(
      <ContactForm
        fields={mockFields}
        onSubmit={onSubmit}
        submitButtonText="Solicitar contato"
      />
    )

    expect(screen.getByRole('button', { name: 'Solicitar contato' })).toBeInTheDocument()
  })

  it('renders submit button with default text when not specified', () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument()
  })

  it('shows inline validation errors after field is blurred with invalid value', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    const nameInput = screen.getByLabelText(/Nome/)
    fireEvent.focus(nameInput)
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/)).toBeInTheDocument()
    })
  })

  it('does not show errors for untouched fields', () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows all validation errors on submit with empty required fields', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/)).toBeInTheDocument()
      expect(screen.getByText(/E-mail é obrigatório/)).toBeInTheDocument()
      expect(screen.getByText(/Telefone é obrigatório/)).toBeInTheDocument()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with form data when all fields are valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Nome/), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByLabelText(/Telefone/), {
      target: { value: '11999999999' },
    })
    fireEvent.change(screen.getByLabelText(/Mensagem/), {
      target: { value: 'Olá, gostaria de mais informações.' },
    })

    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        message: 'Olá, gostaria de mais informações.',
      })
    })
  })

  it('displays green success message and clears form on successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <ContactForm
        fields={mockFields}
        onSubmit={onSubmit}
        successMessage="Sua solicitação foi enviada!"
      />
    )

    fireEvent.change(screen.getByLabelText(/Nome/), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByLabelText(/Telefone/), {
      target: { value: '11999999999' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    await waitFor(() => {
      expect(screen.getByText('Sua solicitação foi enviada!')).toBeInTheDocument()
    })

    // Form fields should be cleared
    expect(screen.getByLabelText(/Nome/)).toHaveValue('')
    expect(screen.getByLabelText(/E-mail/)).toHaveValue('')
    expect(screen.getByLabelText(/Telefone/)).toHaveValue('')
  })

  it('displays error message and preserves form data on submission failure', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'))
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Nome/), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByLabelText(/Telefone/), {
      target: { value: '11999999999' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    await waitFor(() => {
      expect(
        screen.getByText(/Não foi possível enviar sua mensagem/)
      ).toBeInTheDocument()
    })

    // Form data should be preserved
    expect(screen.getByLabelText(/Nome/)).toHaveValue('João Silva')
    expect(screen.getByLabelText(/E-mail/)).toHaveValue('joao@email.com')
    expect(screen.getByLabelText(/Telefone/)).toHaveValue('11999999999')
  })

  it('shows loading state on submit button while submitting', async () => {
    let resolveSubmit: () => void
    const onSubmit = vi.fn(
      () => new Promise<void>((resolve) => { resolveSubmit = resolve })
    )
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Nome/), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'joao@email.com' },
    })
    fireEvent.change(screen.getByLabelText(/Telefone/), {
      target: { value: '11999999999' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    await waitFor(() => {
      expect(screen.getByText('Enviando...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    // Resolve the submission
    resolveSubmit!()

    await waitFor(() => {
      expect(screen.queryByText('Enviando...')).not.toBeInTheDocument()
    })
  })

  it('marks required fields with asterisk', () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    // Required fields should have asterisk
    const labels = screen.getAllByText('*')
    // name, email, phone are required (3 fields)
    expect(labels).toHaveLength(3)
  })

  it('renders textarea for textarea field type', () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    const messageField = screen.getByLabelText(/Mensagem/)
    expect(messageField.tagName).toBe('TEXTAREA')
  })

  it('renders input for text/email/tel field types', () => {
    const onSubmit = vi.fn()
    render(<ContactForm fields={mockFields} onSubmit={onSubmit} />)

    const nameField = screen.getByLabelText(/Nome/)
    expect(nameField.tagName).toBe('INPUT')
    expect(nameField).toHaveAttribute('type', 'text')

    const emailField = screen.getByLabelText(/E-mail/)
    expect(emailField.tagName).toBe('INPUT')
    expect(emailField).toHaveAttribute('type', 'email')
  })
})
