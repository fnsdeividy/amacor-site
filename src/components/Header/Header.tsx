import { useState, useRef, useEffect } from 'react'
import MobileMenu from './MobileMenu'

export interface HeaderProps {
  currentPath: string
}

const mainNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'A Empresa', path: '/sobre' },
  { label: 'Planos', path: '/planos' },
  { label: 'Rede Credenciada', path: '/rede-credenciada' },
  { label: 'Contato', path: '/contato' },
]

const moreLinks = [
  { label: 'Carência Individual', path: '/carencia-individual' },
  { label: 'Carência Empresarial', path: '/carencia-empresarial' },
  { label: 'IDSS', path: '/idss' },
  { label: 'Manual TISS', path: '/manual-tiss' },
]

// All links combined for mobile menu
const allNavLinks = [...mainNavLinks, ...moreLinks]

export default function Header({ currentPath }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isMoreActive = moreLinks.some((link) => link.path === currentPath)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm border-b border-warm-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 tablet:px-6 flex items-center justify-between h-[80px]">
        {/* Logo / Brand */}
        <a
          href="/"
          className="flex items-center gap-3 group"
        >
          <img
            src="/img/logo.png"
            alt="Amacor Planos de Saúde"
            className="h-11 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden tablet:flex items-center gap-1">
          {mainNavLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`relative text-nav px-4 py-2.5 rounded-lg transition-all duration-200 ${currentPath === link.path
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

          {/* "Mais" dropdown for secondary links */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`relative text-nav px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${isMoreActive
                ? 'text-primary-600 font-semibold bg-primary-50'
                : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                }`}
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
            >
              Mais
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isMoreActive && (
                <span className="absolute bottom-0.5 left-4 right-4 h-[2px] bg-primary-600 rounded-full" />
              )}
            </button>

            {/* Dropdown panel */}
            {isMoreOpen && (
              <div className="absolute top-full right-0 mt-3 w-60 bg-white rounded-2xl shadow-elevated border border-warm-100 py-2 z-50">
                {moreLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-5 py-3 text-nav transition-colors ${currentPath === link.path
                      ? 'text-primary-600 font-semibold bg-primary-50'
                      : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                      }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="tablet:hidden flex items-center justify-center min-w-touch min-h-touch p-2 rounded-xl hover:bg-warm-50 transition-colors"
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
        navLinks={allNavLinks}
        onClose={closeMobileMenu}
      />
    </header>
  )
}
