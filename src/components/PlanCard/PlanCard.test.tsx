import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { PlanCard } from './PlanCard'

function renderPlanCard(props: Partial<React.ComponentProps<typeof PlanCard>> = {}) {
  const defaultProps = {
    name: 'Exclusivo II',
    description: 'Plano ambulatorial completo com cobertura ampliada.',
    benefits: [
      'Consultas médicas',
      'Exames laboratoriais',
      'Fisioterapia',
    ],
    ctaText: 'Saiba mais',
    ctaLink: '/planos/exclusivo-ii',
    ...props,
  }

  return render(
    <MemoryRouter>
      <PlanCard {...defaultProps} />
    </MemoryRouter>
  )
}

describe('PlanCard', () => {
  it('renders the plan name as a heading', () => {
    renderPlanCard()
    expect(screen.getByRole('heading', { name: 'Exclusivo II' })).toBeInTheDocument()
  })

  it('renders the plan description', () => {
    renderPlanCard({ description: 'Cobertura ambulatorial completa.' })
    expect(screen.getByText('Cobertura ambulatorial completa.')).toBeInTheDocument()
  })

  it('renders all benefit items', () => {
    const benefits = ['Consultas', 'Exames', 'Telemedicina']
    renderPlanCard({ benefits })
    benefits.forEach((benefit) => {
      expect(screen.getByText(benefit)).toBeInTheDocument()
    })
  })

  it('renders the CTA button as a link with correct text and href', () => {
    renderPlanCard({ ctaText: 'Ver detalhes', ctaLink: '/planos/empresarial' })
    const link = screen.getByRole('link', { name: 'Ver detalhes' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/planos/empresarial')
  })

  it('applies highlighted styles when highlighted is true', () => {
    const { container } = renderPlanCard({ highlighted: true })
    const article = container.querySelector('article')
    expect(article).toHaveClass('border-2', 'border-primary-500', 'shadow-card-hover')
  })

  it('applies default styles when highlighted is false', () => {
    const { container } = renderPlanCard({ highlighted: false })
    const article = container.querySelector('article')
    expect(article).toHaveClass('border', 'border-background-gray', 'shadow-card')
  })

  it('CTA button has minimum touch target height', () => {
    renderPlanCard()
    const link = screen.getByRole('link', { name: 'Saiba mais' })
    expect(link).toHaveClass('min-h-touch')
  })

  it('renders benefits as a list', () => {
    renderPlanCard()
    expect(screen.getByRole('list')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })
})
