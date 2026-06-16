import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { AdminAuthProvider } from '../../contexts/AdminAuthContext'
import Header from './Header'

function renderHeader(currentPath = '/') {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <Header currentPath={currentPath} />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Header', () => {
  it('renders the brand logo', () => {
    renderHeader()
    expect(screen.getByAltText('Amacor Planos de Saúde')).toBeInTheDocument()
  })

  it('renders main navigation links', () => {
    renderHeader()
    expect(screen.getAllByText('Início').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Planos').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Telemedicina').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Rede Credenciada').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Área do Beneficiário').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Institucional').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Contato').length).toBeGreaterThanOrEqual(1)
  })

  it('renders hamburger button with correct aria-label', () => {
    renderHeader()
    const button = screen.getByRole('button', { name: 'Abrir menu' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles mobile menu on hamburger click', () => {
    renderHeader()
    const button = screen.getByRole('button', { name: 'Abrir menu' })

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-label', 'Fechar menu')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-label', 'Abrir menu')
  })

  it('hamburger button has minimum 48x48px tap target', () => {
    renderHeader()
    const button = screen.getByRole('button', { name: 'Abrir menu' })
    expect(button).toHaveClass('min-w-[48px]')
    expect(button).toHaveClass('min-h-[48px]')
  })

  it('header has fixed positioning', () => {
    renderHeader()
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('fixed')
    expect(header).toHaveClass('top-0')
  })

  it('navigation links use minimum 16px font size', () => {
    renderHeader()
    const link = screen.getAllByText('Início')[0]
    expect(link).toHaveClass('text-[16px]')
  })

  it('applies active link styling to the current path', () => {
    renderHeader('/')
    const activeLink = screen.getAllByText('Início')[0]
    expect(activeLink).toHaveClass('text-primary-600')
    expect(activeLink).toHaveClass('font-semibold')
  })

  it('Planos button has aria-haspopup and aria-expanded attributes', () => {
    renderHeader()
    const plansButton = screen.getByRole('button', { name: /Planos/i })
    expect(plansButton).toHaveAttribute('aria-haspopup', 'true')
    expect(plansButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens Plans dropdown on click and shows submenu items', () => {
    renderHeader()
    const plansButton = screen.getByRole('button', { name: /Planos/i })

    fireEvent.click(plansButton)
    expect(plansButton).toHaveAttribute('aria-expanded', 'true')

    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()

    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(4)
    expect(menuItems[0]).toHaveTextContent('Exclusivo I')
    expect(menuItems[1]).toHaveTextContent('Exclusivo II')
    expect(menuItems[2]).toHaveTextContent('Mais com Franquia')
    expect(menuItems[3]).toHaveTextContent('Empresarial')
  })

  it('closes Plans dropdown on Escape key', () => {
    renderHeader()
    const plansButton = screen.getByRole('button', { name: /Planos/i })

    fireEvent.click(plansButton)
    expect(plansButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(plansButton, { key: 'Escape' })
    expect(plansButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('dropdown menu items have role="menuitem"', () => {
    renderHeader()
    const plansButton = screen.getByRole('button', { name: /Planos/i })

    fireEvent.click(plansButton)
    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(4)
  })

  it('plans dropdown links point to correct hrefs', () => {
    renderHeader()
    const plansButton = screen.getByRole('button', { name: /Planos/i })

    fireEvent.click(plansButton)

    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems[0]).toHaveAttribute('href', '/planos/exclusivo-i')
    expect(menuItems[1]).toHaveAttribute('href', '/planos/exclusivo-ii')
    expect(menuItems[2]).toHaveAttribute('href', '/planos/mais-com-franquia')
    expect(menuItems[3]).toHaveAttribute('href', '/planos/empresarial')
  })

  it('all interactive elements have focus indicators', () => {
    renderHeader()
    const plansButton = screen.getByRole('button', { name: /Planos/i })
    expect(plansButton).toHaveClass('focus-visible:ring-2')
    expect(plansButton).toHaveClass('focus-visible:ring-primary-600')

    const hamburgerButton = screen.getByRole('button', { name: 'Abrir menu' })
    expect(hamburgerButton).toHaveClass('focus-visible:ring-2')
    expect(hamburgerButton).toHaveClass('focus-visible:ring-primary-600')
  })

  it('does not have duplicate navigation links', () => {
    renderHeader()
    // Desktop nav has unique hrefs - verify Planos appears as button (not anchor)
    const navLinks = screen.getAllByRole('link')
    const hrefs = navLinks.map((link) => link.getAttribute('href')).filter(Boolean)
    const uniqueHrefs = new Set(hrefs)
    // Note: mobile + desktop might duplicate. Desktop should have unique set.
    // Just verify no duplicates in the first occurrence
    const desktopNav = screen.getByRole('navigation', { name: 'Navegação principal' })
    const desktopLinks = desktopNav.querySelectorAll('a[href]')
    const desktopHrefs = Array.from(desktopLinks).map((l) => l.getAttribute('href'))
    const desktopUniqueHrefs = new Set(desktopHrefs)
    expect(desktopHrefs.length).toBe(desktopUniqueHrefs.size)
  })
})
