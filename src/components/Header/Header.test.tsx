import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from './Header'

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header currentPath="/" />)
    expect(screen.getByText('Amacor')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header currentPath="/" />)
    // Each link appears twice: desktop nav + mobile menu
    expect(screen.getAllByText('Home')).toHaveLength(2)
    expect(screen.getAllByText('A Empresa')).toHaveLength(2)
    expect(screen.getAllByText('Planos')).toHaveLength(2)
    expect(screen.getAllByText('Rede Credenciada')).toHaveLength(2)
    expect(screen.getAllByText('Carência Individual')).toHaveLength(2)
    expect(screen.getAllByText('Carência Empresarial')).toHaveLength(2)
    expect(screen.getAllByText('IDSS')).toHaveLength(2)
    expect(screen.getAllByText('Manual TISS')).toHaveLength(2)
    expect(screen.getAllByText('Contato')).toHaveLength(2)
  })

  it('applies active link styling to the current path', () => {
    render(<Header currentPath="/planos" />)
    const activeLink = screen.getAllByText('Planos')[0]
    expect(activeLink).toHaveClass('text-primary-600')
    expect(activeLink).toHaveClass('border-b-2')
    expect(activeLink).toHaveClass('border-primary-500')
  })

  it('does not apply active styling to non-active links', () => {
    render(<Header currentPath="/planos" />)
    const inactiveLink = screen.getAllByText('Home')[0]
    expect(inactiveLink).toHaveClass('text-gray-700')
    expect(inactiveLink).not.toHaveClass('border-b-2')
  })

  it('renders hamburger button with correct aria-label', () => {
    render(<Header currentPath="/" />)
    const button = screen.getByRole('button', { name: 'Abrir menu' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles mobile menu on hamburger click', () => {
    render(<Header currentPath="/" />)
    const button = screen.getByRole('button', { name: 'Abrir menu' })

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-label', 'Fechar menu')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-label', 'Abrir menu')
  })

  it('hamburger button has minimum 48x48px tap target', () => {
    render(<Header currentPath="/" />)
    const button = screen.getByRole('button', { name: 'Abrir menu' })
    expect(button).toHaveClass('min-w-touch')
    expect(button).toHaveClass('min-h-touch')
  })

  it('header has fixed positioning', () => {
    render(<Header currentPath="/" />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('fixed')
    expect(header).toHaveClass('top-0')
  })

  it('navigation links use minimum 16px font size', () => {
    render(<Header currentPath="/" />)
    const link = screen.getAllByText('Home')[0]
    expect(link).toHaveClass('text-nav')
  })
})
