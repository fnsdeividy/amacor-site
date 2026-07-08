import { useState, useRef, useEffect, useCallback } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { useAuth } from '../../contexts/AuthContext'
import MobileMenu from './MobileMenu'

export interface HeaderProps {
  currentPath: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[] // max 1 level deep
}

const navItems: NavItem[] = [
  { label: 'Início', href: '/' },
  {
    label: 'Planos',
    href: '/planos',
    children: [
      { label: 'Exclusivo I', href: '/planos/exclusivo-i' },
      { label: 'Exclusivo II', href: '/planos/exclusivo-ii' },
      { label: 'Mais com Franquia', href: '/planos/mais-com-franquia' },
      { label: 'Empresarial', href: '/planos/empresarial' },
    ],
  },
  { label: 'Telemedicina', href: '/telemedicina' },
  { label: 'Rede de Atendimento', href: '/rede-credenciada' },
  { label: 'Área do Beneficiário', href: '/area-do-beneficiario' },
  { label: 'Reajuste Anual', href: '/reajuste-anual' },
  { label: 'Política de Reembolso', href: '/politica-de-reembolso' },
  { label: 'Contato', href: '/contato' },
]

const adminNavLinks = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Solicitações', path: '/admin/solicitacoes' },
]

const beneficiaryNavLinks = [
  { label: 'Boletos', path: '/beneficiario/boletos' },
  { label: 'Solicitações', path: '/beneficiario/solicitacoes' },
  { label: 'Nova Solicitação', path: '/beneficiario/solicitacoes/nova' },
]

export default function Header({ currentPath }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPlansDropdownOpen, setIsPlansDropdownOpen] = useState(false)
  const plansDropdownRef = useRef<HTMLDivElement>(null)
  const plansButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownItemsRef = useRef<(HTMLAnchorElement | null)[]>([])

  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout } = useAdminAuth()
  const { session: beneficiarySession, logout: beneficiaryLogout } = useAuth()
  const isBeneficiaryAuthenticated = beneficiarySession?.isAuthenticated ?? false

  const plansNavItem = navItems.find((item) => item.children)!

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const openPlansDropdown = () => {
    setIsPlansDropdownOpen(true)
  }

  const closePlansDropdown = () => {
    setIsPlansDropdownOpen(false)
  }

  const togglePlansDropdown = () => {
    setIsPlansDropdownOpen((prev) => !prev)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        plansDropdownRef.current &&
        !plansDropdownRef.current.contains(event.target as Node)
      ) {
        closePlansDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation for dropdown
  const handleDropdownKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePlansDropdown()
        plansButtonRef.current?.focus()
      }

      if (!isPlansDropdownOpen) return

      const items = dropdownItemsRef.current.filter(Boolean) as HTMLAnchorElement[]
      const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement)

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex]?.focus()
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prevIndex]?.focus()
      }
    },
    [isPlansDropdownOpen]
  )

  // Focus first dropdown item when opened via keyboard
  const handlePlansButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      togglePlansDropdown()
      if (!isPlansDropdownOpen) {
        // Will open — focus first item after render
        setTimeout(() => {
          dropdownItemsRef.current[0]?.focus()
        }, 0)
      }
    }
    if (event.key === 'ArrowDown' && !isPlansDropdownOpen) {
      event.preventDefault()
      openPlansDropdown()
      setTimeout(() => {
        dropdownItemsRef.current[0]?.focus()
      }, 0)
    }
  }

  const isPlansActive =
    currentPath === '/planos' ||
    plansNavItem.children?.some((child) => currentPath === child.href)

  const isNavItemActive = (item: NavItem) => {
    if (item.children) {
      return isPlansActive
    }
    return currentPath === item.href
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm border-b border-warm-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 tablet:px-6 flex items-center gap-8 h-[80px]">
        {/* Logo / Brand */}
        <a
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg flex-shrink-0"
        >
          <img
            src="/img/logo.png"
            alt="Amacor Planos de Saúde"
            className="h-16 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden tablet:flex items-center gap-1 ml-auto" aria-label="Navegação principal">
          {/* Se beneficiário logado, mostra apenas navegação do portal */}
          {isBeneficiaryAuthenticated && !isAdminAuthenticated ? (
            <>
              {/* Badge indicando área restrita */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1.5 rounded-full mr-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {beneficiarySession?.nome
                  ? beneficiarySession.nome.split(' ')[0]
                  : 'Área Restrita'}
              </span>
              <a
                href="/beneficiario/dados"
                className={`relative text-[15px] px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${currentPath === '/beneficiario/dados'
                  ? 'text-primary-600 font-semibold bg-primary-50'
                  : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                  }`}
              >
                Meus Dados
              </a>
              {beneficiaryNavLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`relative text-[15px] px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${currentPath === link.path
                    ? 'text-primary-600 font-semibold bg-primary-50'
                    : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                    }`}
                >
                  {link.label}
                  {currentPath === link.path && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary-600 rounded-full" />
                  )}
                </a>
              ))}
              <a
                href="/"
                className="text-[15px] px-3 py-2.5 rounded-lg transition-all duration-200 text-warm-600 hover:text-primary-600 hover:bg-warm-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                Site
              </a>
              <button
                type="button"
                onClick={beneficiaryLogout}
                className="text-[15px] px-3 py-2.5 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Sair
              </button>
            </>
          ) : isAdminAuthenticated ? (
            <>
              {/* Admin: mostrar APENAS links admin */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1.5 rounded-full mr-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Painel Admin
              </span>
              {adminNavLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`relative text-[16px] px-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${currentPath === link.path
                    ? 'text-primary-600 font-semibold bg-primary-50'
                    : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                    }`}
                >
                  {link.label}
                  {currentPath === link.path && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-[2px] bg-primary-600 rounded-full" />
                  )}
                </a>
              ))}
              <button
                type="button"
                onClick={adminLogout}
                className="text-[16px] px-4 py-2.5 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              {navItems.map((item) => {
                // Render dropdown for Plans
                if (item.children) {
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      ref={plansDropdownRef}
                      onMouseEnter={openPlansDropdown}
                      onMouseLeave={closePlansDropdown}
                      onKeyDown={handleDropdownKeyDown}
                    >
                      <button
                        ref={plansButtonRef}
                        type="button"
                        onClick={togglePlansDropdown}
                        onKeyDown={handlePlansButtonKeyDown}
                        className={`relative text-[14px] px-2.5 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${isPlansActive
                          ? 'text-primary-600 font-semibold bg-primary-50'
                          : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                          }`}
                        aria-expanded={isPlansDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="plans-dropdown-menu"
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isPlansDropdownOpen ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        {isPlansActive && (
                          <span className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] bg-primary-600 rounded-full" />
                        )}
                      </button>

                      {/* Dropdown panel */}
                      {isPlansDropdownOpen && (
                        <div
                          id="plans-dropdown-menu"
                          role="menu"
                          className="absolute top-full left-0 pt-1 z-50"
                        >
                          <div className="w-56 bg-white rounded-2xl shadow-elevated border border-warm-100 py-2">
                            {item.children.map((child, index) => (
                              <a
                                key={child.href}
                                ref={(el) => {
                                  dropdownItemsRef.current[index] = el
                                }}
                                href={child.href}
                                role="menuitem"
                                tabIndex={-1}
                                onClick={closePlansDropdown}
                                className={`block px-5 py-3 text-[16px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 ${currentPath === child.href
                                  ? 'text-primary-600 font-semibold bg-primary-50'
                                  : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                                  }`}
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                // Regular nav link
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative text-[14px] px-2.5 py-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${isNavItemActive(item)
                      ? 'text-primary-600 font-semibold bg-primary-50'
                      : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                      }`}
                  >
                    {item.label}
                    {isNavItemActive(item) && (
                      <span className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] bg-primary-600 rounded-full" />
                    )}
                  </a>
                )
              })}

              {/* No admin links here — handled by the admin-only branch above */}
            </>
          )
          }
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="tablet:hidden flex items-center justify-center min-w-[48px] min-h-[48px] p-2 rounded-xl hover:bg-warm-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <svg
            className="w-7 h-7 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        currentPath={currentPath}
        navItems={navItems}
        onClose={closeMobileMenu}
        onLogout={
          isAdminAuthenticated
            ? adminLogout
            : isBeneficiaryAuthenticated
              ? beneficiaryLogout
              : undefined
        }
        extraLinks={
          isAdminAuthenticated
            ? adminNavLinks
            : isBeneficiaryAuthenticated
              ? beneficiaryNavLinks
              : undefined
        }
      />
    </header>
  )
}
