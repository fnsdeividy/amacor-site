import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { HeroSection } from './HeroSection'

function renderHero(props: Partial<React.ComponentProps<typeof HeroSection>> = {}) {
  const defaultProps = {
    headline: 'Cuide da sua saúde',
    subtitle: 'Planos acessíveis para você e sua família',
    ctaText: 'Simule seu plano',
    ctaLink: '/planos',
  }
  return render(
    <MemoryRouter>
      <HeroSection {...defaultProps} {...props} />
    </MemoryRouter>
  )
}

describe('HeroSection', () => {
  it('renders headline, subtitle, and CTA button', () => {
    renderHero()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cuide da sua saúde')
    expect(screen.getByText('Planos acessíveis para você e sua família')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Simule seu plano' })).toBeInTheDocument()
  })

  it('CTA link points to the correct route', () => {
    renderHero({ ctaLink: '/contato' })

    const link = screen.getByRole('link', { name: 'Simule seu plano' })
    expect(link).toHaveAttribute('href', '/contato')
  })

  it('renders with background image when provided', () => {
    const { container } = renderHero({ backgroundImage: '/images/hero-bg.jpg' })

    const section = container.querySelector('section')
    expect(section).toHaveStyle({ backgroundImage: 'url(/images/hero-bg.jpg)' })
  })

  it('renders overlay when background image is provided', () => {
    const { container } = renderHero({ backgroundImage: '/images/hero-bg.jpg' })

    const overlay = container.querySelector('[aria-hidden="true"]')
    expect(overlay).toBeInTheDocument()
  })

  it('does not render overlay when no background image', () => {
    const { container } = renderHero()

    const overlay = container.querySelector('[aria-hidden="true"]')
    expect(overlay).not.toBeInTheDocument()
  })

  it('CTA button has minimum 48x48px touch target', () => {
    renderHero()

    const link = screen.getByRole('link', { name: 'Simule seu plano' })
    expect(link.className).toContain('min-w-touch')
    expect(link.className).toContain('min-h-touch')
  })
})
