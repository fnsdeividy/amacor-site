import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { InfoCard } from './InfoCard'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('InfoCard', () => {
  it('renders title and description', () => {
    renderWithRouter(
      <InfoCard title="Nossos Valores" description="Cuidamos de você com dedicação." />
    )

    expect(screen.getByText('Nossos Valores')).toBeInTheDocument()
    expect(screen.getByText('Cuidamos de você com dedicação.')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    renderWithRouter(
      <InfoCard
        title="Planos"
        description="Conheça nossos planos."
        icon={<span data-testid="icon">★</span>}
      />
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('does not render icon container when icon is not provided', () => {
    const { container } = renderWithRouter(
      <InfoCard title="Planos" description="Conheça nossos planos." />
    )

    const iconContainer = container.querySelector('.mb-4.text-blue-600')
    expect(iconContainer).not.toBeInTheDocument()
  })

  it('renders link when link prop is provided', () => {
    renderWithRouter(
      <InfoCard
        title="Rede Credenciada"
        description="Encontre prestadores."
        link="/rede-credenciada"
        linkText="Ver rede"
      />
    )

    const linkElement = screen.getByText('Ver rede')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', '/rede-credenciada')
  })

  it('uses default link text when linkText is not provided', () => {
    renderWithRouter(
      <InfoCard
        title="Rede Credenciada"
        description="Encontre prestadores."
        link="/rede-credenciada"
      />
    )

    expect(screen.getByText('Saiba mais')).toBeInTheDocument()
  })

  it('does not render link when link prop is not provided', () => {
    renderWithRouter(
      <InfoCard title="Missão" description="Nossa missão é cuidar." />
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('applies rounded corners and shadow styling', () => {
    const { container } = renderWithRouter(
      <InfoCard title="Card" description="Descrição do card." />
    )

    const card = container.firstElementChild
    expect(card).toHaveClass('rounded-2xl', 'shadow-md', 'p-6')
  })
})
