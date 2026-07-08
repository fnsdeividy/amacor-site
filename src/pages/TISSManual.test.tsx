import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TISSManual from './TISSManual'

describe('TISSManual', () => {
  it('renders the page heading "Padrão TISS"', () => {
    render(<TISSManual />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Padrão TISS')
  })

  it('renders a description about the TISS standard', () => {
    render(<TISSManual />)

    expect(screen.getAllByText(/Troca de Informações na Saúde Suplementar/).length).toBeGreaterThanOrEqual(1)
  })

  it('displays all 5 TISS component cards', () => {
    render(<TISSManual />)

    expect(screen.getByText('Componente Organizacional')).toBeInTheDocument()
    expect(screen.getByText('Componente Conteúdo e Estrutura')).toBeInTheDocument()
    expect(screen.getByText('Componente Representação de Conceitos em Saúde')).toBeInTheDocument()
    expect(screen.getByText('Componente Segurança e Privacidade')).toBeInTheDocument()
    expect(screen.getByText('Componente Comunicação')).toBeInTheDocument()
  })

  it('expands a card when clicked and shows description', () => {
    render(<TISSManual />)

    const card = screen.getByText('Componente Organizacional').closest('[role="button"]')!
    fireEvent.click(card)

    expect(screen.getByText(/regras operacionais/)).toBeInTheDocument()
  })

  it('shows download button when card with documents is expanded', () => {
    render(<TISSManual />)

    const card = screen.getByText('Componente Organizacional').closest('[role="button"]')!
    fireEvent.click(card)

    expect(screen.getByText(/Baixar PDF/)).toBeInTheDocument()
  })

  it('shows "documento em breve" for components without documents', () => {
    render(<TISSManual />)

    const card = screen.getByText('Componente Comunicação').closest('[role="button"]')!
    fireEvent.click(card)

    expect(screen.getByText(/Documento em breve disponível/)).toBeInTheDocument()
  })

  it('collapses card when clicked again', () => {
    render(<TISSManual />)

    const card = screen.getByText('Componente Organizacional').closest('[role="button"]')!
    fireEvent.click(card)
    expect(screen.getByText(/regras operacionais/)).toBeInTheDocument()

    fireEvent.click(card)
    expect(screen.queryByText(/regras operacionais/)).not.toBeInTheDocument()
  })

  it('cards have proper accessibility attributes', () => {
    render(<TISSManual />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('tabIndex', '0')
      expect(button).toHaveAttribute('aria-expanded')
    })
  })
})
