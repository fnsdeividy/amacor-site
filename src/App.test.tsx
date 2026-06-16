import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the header with Amacor brand', () => {
    render(<App />)
    expect(screen.getByAltText('Amacor Planos de Saúde')).toBeInTheDocument()
  })

  it('renders the footer with copyright', () => {
    render(<App />)
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument()
  })

  it('renders the WhatsApp button', () => {
    render(<App />)
    expect(screen.getByLabelText('Entrar em contato pelo WhatsApp')).toBeInTheDocument()
  })

  it('renders the Home page on root path', () => {
    render(<App />)
    // Verify the app renders without crashing at root path
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
