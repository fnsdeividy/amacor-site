import { useState } from 'react'
import type { NavItem } from './Header'

export interface MobileMenuProps {
  isOpen: boolean
  currentPath: string
  navItems: NavItem[]
  onClose: () => void
  onLogout?: () => void
  extraLinks?: { label: string; path: string }[]
}

export default function MobileMenu({
  isOpen,
  currentPath,
  navItems,
  onClose,
  onLogout,
  extraLinks,
}: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const toggleAccordion = (href: string) => {
    setExpandedItem((prev) => (prev === href ? null : href))
  }

  const handleAccordionKeyDown = (event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleAccordion(href)
    }
  }

  return (
    <div
      className={`tablet:hidden fixed inset-0 top-[80px] z-40 transition-all duration-300 ease-in-out ${isOpen
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary-900/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <nav
        className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-elevated overflow-y-auto border-l border-warm-100"
        role="navigation"
        aria-label="Menu principal"
      >
        <ul className="flex flex-col py-6 px-3">
          {navItems.map((item) => {
            // Accordion-style item for Plans
            if (item.children) {
              const isExpanded = expandedItem === item.href
              const isActive =
                currentPath === item.href ||
                item.children.some((child) => currentPath === child.href)

              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.href)}
                    onKeyDown={(e) => handleAccordionKeyDown(e, item.href)}
                    aria-expanded={isExpanded}
                    aria-controls={`mobile-submenu-${item.href.replace(/\//g, '-')}`}
                    className={`flex items-center justify-between w-full min-h-[48px] px-5 py-3.5 rounded-xl text-[16px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${isActive
                        ? 'text-primary-600 bg-primary-50 font-semibold'
                        : 'text-warm-700 hover:bg-warm-50 hover:text-primary-600'
                      }`}
                  >
                    <span className="flex items-center">
                      {isActive && (
                        <span className="w-1 h-6 bg-primary-600 rounded-full mr-3 flex-shrink-0" />
                      )}
                      {item.label}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
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
                  </button>

                  {/* Submenu */}
                  <ul
                    id={`mobile-submenu-${item.href.replace(/\//g, '-')}`}
                    role="list"
                    className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <a
                          href={child.href}
                          onClick={onClose}
                          className={`flex items-center min-h-[48px] pl-10 pr-5 py-3 rounded-xl text-[16px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${currentPath === child.href
                              ? 'text-primary-600 bg-primary-50 font-semibold'
                              : 'text-warm-600 hover:bg-warm-50 hover:text-primary-600'
                            }`}
                        >
                          {currentPath === child.href && (
                            <span className="w-1 h-5 bg-primary-600 rounded-full mr-3 flex-shrink-0" />
                          )}
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            }

            // Regular nav item
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center min-h-[48px] px-5 py-3.5 rounded-xl text-[16px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${currentPath === item.href
                      ? 'text-primary-600 bg-primary-50 font-semibold'
                      : 'text-warm-700 hover:bg-warm-50 hover:text-primary-600'
                    }`}
                >
                  {currentPath === item.href && (
                    <span className="w-1 h-6 bg-primary-600 rounded-full mr-3 flex-shrink-0" />
                  )}
                  {item.label}
                </a>
              </li>
            )
          })}

          {/* Extra auth-based links */}
          {extraLinks &&
            extraLinks.map((link) => (
              <li key={link.path}>
                <a
                  href={link.path}
                  onClick={onClose}
                  className={`flex items-center min-h-[48px] px-5 py-3.5 rounded-xl text-[16px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${currentPath === link.path
                      ? 'text-primary-600 bg-primary-50 font-semibold'
                      : 'text-warm-700 hover:bg-warm-50 hover:text-primary-600'
                    }`}
                >
                  {currentPath === link.path && (
                    <span className="w-1 h-6 bg-primary-600 rounded-full mr-3 flex-shrink-0" />
                  )}
                  {link.label}
                </a>
              </li>
            ))}

          {/* Logout button */}
          {onLogout && (
            <li>
              <button
                type="button"
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="flex items-center min-h-[48px] px-5 py-3.5 rounded-xl text-[16px] transition-all duration-200 text-red-600 hover:bg-red-50 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Sair
              </button>
            </li>
          )}
        </ul>

        {/* Contact info in mobile menu */}
        <div className="border-t border-warm-100 mx-5 pt-6 pb-8">
          <p className="text-sm text-warm-500 font-medium uppercase tracking-wider mb-3">
            Contato
          </p>
          <a
            href="tel:+552140200639"
            className="flex items-center gap-2 text-[16px] text-warm-700 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
          >
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            (21) 4020-0639
          </a>
        </div>
      </nav>
    </div>
  )
}
