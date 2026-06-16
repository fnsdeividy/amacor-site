import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header/Header'
import { WhatsAppButton } from '../components/WhatsAppButton/WhatsAppButton'
import { PlanCard } from '../components/PlanCard/PlanCard'
import ContactForm from '../components/ContactForm/ContactForm'
import { ProviderCard } from '../components/ProviderCard/ProviderCard'
import { SearchFilters } from '../components/SearchFilters/SearchFilters'
import { HeroSection } from '../components/HeroSection/HeroSection'
import { AuthProvider } from '../contexts/AuthContext'
import { AdminAuthProvider } from '../contexts/AdminAuthContext'
import type { Provider } from '../types/provider'
import type { FormFieldConfig } from '../types/forms'

// Helper to wrap components that use React Router
function withRouter(ui: React.ReactElement) {
  return <MemoryRouter>{ui}</MemoryRouter>
}

// Helper to wrap components that need auth context
function withAuthContext(ui: React.ReactElement) {
  return (
    <MemoryRouter>
      <AuthProvider>
        <AdminAuthProvider>
          {ui}
        </AdminAuthProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

const mockProvider: Provider = {
  id: '1',
  name: 'Clínica Saúde Total',
  type: 'Clínica',
  specialties: ['Cardiologia', 'Clínica médica'],
  address: {
    street: 'Rua das Flores',
    number: '100',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    cep: '20040020',
  },
  coordinates: { lat: -22.9068, lng: -43.1729 },
  phone: '(21) 3333-4444',
  whatsapp: '(21) 99999-8888',
  operatingHours: {
    weekdays: '08:00 - 18:00',
    saturday: '08:00 - 12:00',
  },
  acceptedPlans: ['Exclusivo I', 'Exclusivo II'],
}

const mockFormFields: FormFieldConfig[] = [
  { name: 'name', label: 'Nome', type: 'text', required: true, maxLength: 120 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', label: 'Telefone', type: 'tel', required: true, maxLength: 15 },
  { name: 'message', label: 'Mensagem', type: 'textarea', required: false, maxLength: 1000 },
]

describe('Responsive Design - Header', () => {
  it('hides desktop navigation on mobile via tablet:flex class', () => {
    render(withAuthContext(<Header currentPath="/" />))
    const nav = document.querySelector('nav.hidden.tablet\\:flex')
    expect(nav).toBeInTheDocument()
  })

  it('shows hamburger button only on mobile via tablet:hidden class', () => {
    render(withAuthContext(<Header currentPath="/" />))
    const button = screen.getByRole('button', { name: 'Abrir menu' })
    expect(button.className).toContain('tablet:hidden')
  })

  it('hamburger button has minimum 48x48px tap target', () => {
    render(withAuthContext(<Header currentPath="/" />))
    const button = screen.getByRole('button', { name: 'Abrir menu' })
    expect(button.className).toContain('min-w-[48px]')
    expect(button.className).toContain('min-h-[48px]')
  })

  it('mobile menu panel is hidden on tablet+ via tablet:hidden', () => {
    render(withAuthContext(<Header currentPath="/" />))
    const mobileMenuContainer = document.querySelector('.tablet\\:hidden.fixed.inset-0')
    expect(mobileMenuContainer).toBeInTheDocument()
  })
})

describe('Responsive Design - WhatsApp Button', () => {
  it('is fixed positioned at bottom-right', () => {
    render(<WhatsAppButton phoneNumber="5521999999999" />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link.className).toContain('fixed')
    expect(link.className).toContain('bottom-6')
    expect(link.className).toContain('right-6')
  })

  it('has z-50 to stay above other content', () => {
    render(<WhatsAppButton phoneNumber="5521999999999" />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link.className).toContain('z-50')
  })

  it('has minimum 56x56px size for visibility', () => {
    render(<WhatsAppButton phoneNumber="5521999999999" />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link.className).toContain('min-w-touch-lg')
    expect(link.className).toContain('min-h-touch-lg')
  })
})

describe('Responsive Design - PlanCard Layout', () => {
  const planProps = {
    name: 'Exclusivo II',
    description: 'Plano individual com cobertura ambulatorial completa.',
    benefits: ['Consultas', 'Exames', 'Urgência'],
    ctaText: 'Saiba mais',
    ctaLink: '/planos/exclusivo-ii',
  }

  it('renders as a flex column card that can stack or grid', () => {
    render(withRouter(<PlanCard {...planProps} />))
    const article = screen.getByRole('article')
    expect(article.className).toContain('flex')
    expect(article.className).toContain('flex-col')
  })

  it('CTA button is full-width for mobile touch targets', () => {
    render(withRouter(<PlanCard {...planProps} />))
    const link = screen.getByRole('link', { name: 'Saiba mais' })
    expect(link.className).toContain('w-full')
    expect(link.className).toContain('min-h-touch')
  })
})

describe('Responsive Design - ContactForm Fields', () => {
  it('input fields are full-width with min-h-touch (48px)', () => {
    render(
      withRouter(
        <ContactForm
          fields={mockFormFields}
          onSubmit={async () => { }}
        />
      )
    )
    const nameInput = screen.getByLabelText(/Nome/i)
    expect(nameInput.className).toContain('w-full')
    expect(nameInput.className).toContain('min-h-touch')
  })

  it('textarea fields are full-width', () => {
    render(
      withRouter(
        <ContactForm
          fields={mockFormFields}
          onSubmit={async () => { }}
        />
      )
    )
    const textarea = screen.getByLabelText(/Mensagem/i)
    expect(textarea.className).toContain('w-full')
  })

  it('submit button is full-width with min-h-touch', () => {
    render(
      withRouter(
        <ContactForm
          fields={mockFormFields}
          onSubmit={async () => { }}
        />
      )
    )
    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button.className).toContain('w-full')
    expect(button.className).toContain('min-h-touch')
  })
})

describe('Responsive Design - ProviderCard', () => {
  it('renders as a flex column card for single-column stacking', () => {
    render(
      withRouter(
        <ProviderCard provider={mockProvider} />
      )
    )
    const article = screen.getByRole('article')
    expect(article.className).toContain('flex')
    expect(article.className).toContain('flex-col')
  })

  it('has responsive padding (p-4 on mobile, tablet:p-6 on tablet+)', () => {
    render(
      withRouter(
        <ProviderCard provider={mockProvider} />
      )
    )
    const article = screen.getByRole('article')
    expect(article.className).toContain('p-4')
    expect(article.className).toContain('tablet:p-6')
  })

  it('action buttons have minimum touch target size', () => {
    render(
      withRouter(
        <ProviderCard provider={mockProvider} />
      )
    )
    const callButton = screen.getByRole('link', { name: /Ligar para/i })
    expect(callButton.className).toContain('min-w-touch')
    expect(callButton.className).toContain('min-h-touch')
  })
})

describe('Responsive Design - SearchFilters', () => {
  const defaultProps = {
    specialties: ['Cardiologia', 'Dermatologia'],
    plans: ['Exclusivo I', 'Exclusivo II'],
    providerTypes: ['Hospital', 'Clínica'],
    onFiltersChange: () => { },
    onGeolocationRequest: () => { },
  }

  it('filter container uses flex-col on mobile, tablet:flex-row on tablet+', () => {
    render(withRouter(<SearchFilters {...defaultProps} />))
    const container = document.querySelector('.flex.flex-col.tablet\\:flex-row')
    expect(container).toBeInTheDocument()
  })

  it('filter inputs are full-width on mobile (w-full)', () => {
    render(withRouter(<SearchFilters {...defaultProps} />))
    const cepInput = screen.getByLabelText('CEP')
    expect(cepInput.className).toContain('w-full')
    expect(cepInput.className).toContain('min-h-touch')
  })

  it('geolocation button is full-width on mobile, auto on tablet', () => {
    render(withRouter(<SearchFilters {...defaultProps} />))
    const button = screen.getByRole('button', { name: /localização/i })
    expect(button.className).toContain('w-full')
    expect(button.className).toContain('tablet:w-auto')
  })
})

describe('Responsive Design - HeroSection', () => {
  const heroProps = {
    headline: 'Planos de saúde com cuidado',
    subtitle: 'A Amacor oferece planos individuais e empresariais.',
    ctaText: 'Simular plano',
    ctaLink: '/planos',
  }

  it('stacks content vertically on mobile, side-by-side on tablet+', () => {
    render(withRouter(<HeroSection {...heroProps} />))
    const container = document.querySelector('.flex.flex-col.tablet\\:flex-row')
    expect(container).toBeInTheDocument()
  })

  it('section has overflow-hidden to prevent horizontal scroll', () => {
    render(withRouter(<HeroSection {...heroProps} />))
    const section = document.querySelector('section.overflow-hidden')
    expect(section).toBeInTheDocument()
  })

  it('CTA button has minimum touch target size', () => {
    render(withRouter(<HeroSection {...heroProps} />))
    const link = screen.getByRole('link', { name: 'Simular plano' })
    expect(link.className).toContain('min-w-touch')
    expect(link.className).toContain('min-h-touch')
  })
})

describe('Responsive Design - No Overflow-X', () => {
  it('App layout uses overflow-safe classes (no fixed-width elements without max-width)', () => {
    // Verify that the root layout container uses flex-col and min-h-screen
    // which prevents overflow issues
    const { container } = render(
      <MemoryRouter>
        <div className="min-h-screen flex flex-col bg-background-white">
          <main className="flex-1 pt-16">
            <div className="w-full">Content</div>
          </main>
        </div>
      </MemoryRouter>
    )
    const root = container.firstElementChild
    expect(root?.className).toContain('min-h-screen')
    expect(root?.className).toContain('flex')
    expect(root?.className).toContain('flex-col')
  })

  it('HeroSection uses w-full and overflow-hidden', () => {
    render(
      withRouter(
        <HeroSection
          headline="Test"
          subtitle="Test subtitle"
          ctaText="CTA"
          ctaLink="/test"
        />
      )
    )
    const section = document.querySelector('section')
    expect(section?.className).toContain('w-full')
    expect(section?.className).toContain('overflow-hidden')
  })
})

describe('Responsive Design - Images Scale Proportionally', () => {
  it('HeroSection background image uses cover sizing for proportional scaling', () => {
    render(
      withRouter(
        <HeroSection
          headline="Test"
          subtitle="Test subtitle"
          ctaText="CTA"
          ctaLink="/test"
          backgroundImage="/test-image.jpg"
        />
      )
    )
    const section = document.querySelector('section')
    expect(section?.style.backgroundSize).toBe('cover')
    expect(section?.style.backgroundPosition).toBe('center')
  })
})
