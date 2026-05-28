import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the header with Amacor brand', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: 'Amacor' })).toBeInTheDocument()
  })

  it('renders the footer with copyright', () => {
    render(<App />)
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument()
  })

  it('renders the WhatsApp button', () => {
    render(<App />)
    expect(screen.getByLabelText('Entrar em contato pelo WhatsApp')).toBeInTheDocument()
  })

  it('renders the Home page heading on root path', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Planos de saúde com cuidado e confiança' })).toBeInTheDocument()
  })
})
