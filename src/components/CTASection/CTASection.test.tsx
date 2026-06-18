import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CTASection } from './CTASection'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('CTASection', () => {
  it('renders title and primary action button', () => {
    renderWithRouter(
      <CTASection
        title="Entre em contato"
        primaryAction={{ text: 'Fale conosco', link: '/contato' }}
      />
    )

    expect(screen.getByText('Entre em contato')).toBeInTheDocument()
    expect(screen.getByText('Fale conosco')).toBeInTheDocument()
  })

  it('renders optional description when provided', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        description="Uma descrição opcional"
        primaryAction={{ text: 'Ação', link: '/acao' }}
      />
    )

    expect(screen.getByText('Uma descrição opcional')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{ text: 'Ação', link: '/acao' }}
      />
    )

    const paragraphs = screen.queryAllByRole('paragraph')
    expect(paragraphs).toHaveLength(0)
  })

  it('renders secondary action when provided', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{ text: 'Primário', link: '/primario' }}
        secondaryAction={{ text: 'Secundário', link: '/secundario' }}
      />
    )

    expect(screen.getByText('Primário')).toBeInTheDocument()
    expect(screen.getByText('Secundário')).toBeInTheDocument()
  })

  it('renders internal links using Link component (no target attribute)', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{ text: 'Ir para planos', link: '/planos' }}
      />
    )

    const link = screen.getByText('Ir para planos')
    expect(link).toHaveAttribute('href', '/planos')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders external WhatsApp links with target _blank', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{
          text: 'WhatsApp',
          link: 'https://wa.me/5511999999999',
          variant: 'whatsapp',
        }}
      />
    )

    const link = screen.getByText('WhatsApp')
    expect(link).toHaveAttribute('href', 'https://wa.me/5511999999999')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders tel: links without target attribute', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{
          text: 'Ligar',
          link: 'tel:+5511999999999',
          variant: 'phone',
        }}
      />
    )

    const link = screen.getByText('Ligar')
    expect(link).toHaveAttribute('href', 'tel:+5511999999999')
    expect(link).not.toHaveAttribute('target')
  })

  it('applies whatsapp variant styling', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{
          text: 'WhatsApp',
          link: 'https://wa.me/5511999999999',
          variant: 'whatsapp',
        }}
      />
    )

    const button = screen.getByText('WhatsApp')
    expect(button.className).toContain('bg-whatsapp')
  })

  it('applies phone variant styling', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{
          text: 'Ligar',
          link: 'tel:+5511999999999',
          variant: 'phone',
        }}
      />
    )

    const button = screen.getByText('Ligar')
    expect(button.className).toContain('bg-primary-600')
  })

  it('applies default variant styling when no variant specified', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{ text: 'Ação', link: '/acao' }}
      />
    )

    const button = screen.getByText('Ação')
    expect(button.className).toContain('bg-primary-600')
  })

  it('ensures minimum touch targets via min-h-touch class', () => {
    renderWithRouter(
      <CTASection
        title="Título"
        primaryAction={{ text: 'Ação', link: '/acao' }}
      />
    )

    const button = screen.getByText('Ação')
    expect(button.className).toContain('min-h-touch')
  })
})
