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

    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/images/hero-bg.jpg')
  })

  it('renders overlay when background image is provided', () => {
    const { container } = renderHero({ backgroundImage: '/images/hero-bg.jpg' })

    const overlay = container.querySelector('[aria-hidden="true"]')
    expect(overlay).toBeInTheDocument()
    expect(overlay?.className).toContain('bg-gradient-brand-overlay')
  })

  it('renders gradient background when no background image', () => {
    const { container } = renderHero()

    const gradient = container.querySelector('[aria-hidden="true"]')
    expect(gradient).toBeInTheDocument()
    expect(gradient?.className).toContain('bg-gradient-brand')
  })

  it('CTA button has minimum touch target height', () => {
    renderHero()

    const link = screen.getByRole('link', { name: 'Simule seu plano' })
    expect(link.className).toContain('min-h-touch')
  })
})
