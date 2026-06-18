import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProviderCard } from './ProviderCard'
import type { Provider } from '../../types/provider'

const mockProvider: Provider = {
  id: 'prov-001',
  name: 'Hospital São Lucas',
  type: 'Hospital',
  specialties: ['Clínica médica', 'Cardiologia', 'Urgência'],
  address: {
    street: 'Rua Vergueiro',
    number: '1200',
    neighborhood: 'Liberdade',
    city: 'São Paulo',
    state: 'SP',
    cep: '01504001',
  },
  coordinates: { lat: -23.5631, lng: -46.6366 },
  phone: '(11) 3105-1234',
  whatsapp: '(11) 91234-5678',
  operatingHours: {
    weekdays: '24 horas',
    saturday: '24 horas',
    sunday: '24 horas',
  },
  acceptedPlans: ['Exclusivo I', 'Exclusivo II', 'Empresarial'],
}

const mockProviderNoWhatsapp: Provider = {
  ...mockProvider,
  id: 'prov-002',
  name: 'Clínica Vida Plena',
  type: 'Clínica',
  whatsapp: undefined,
}

describe('ProviderCard', () => {
  it('renders provider name and type badge', () => {
    render(<ProviderCard provider={mockProvider} />)
    expect(screen.getByText('Hospital São Lucas')).toBeInTheDocument()
    expect(screen.getByText('Hospital')).toBeInTheDocument()
  })

  it('renders all specialties', () => {
    render(<ProviderCard provider={mockProvider} />)
    expect(screen.getByText('Clínica médica')).toBeInTheDocument()
    expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    expect(screen.getByText('Urgência')).toBeInTheDocument()
  })

  it('renders full address', () => {
    render(<ProviderCard provider={mockProvider} />)
    expect(screen.getByText(/Rua Vergueiro, 1200/)).toBeInTheDocument()
    expect(screen.getByText(/Liberdade - São Paulo\/SP/)).toBeInTheDocument()
  })

  it('renders phone as tap-to-call link', () => {
    render(<ProviderCard provider={mockProvider} />)
    const phoneLinks = screen.getAllByRole('link', { name: /ligar/i })
    expect(phoneLinks[0]).toHaveAttribute('href', 'tel:1131051234')
  })

  it('renders WhatsApp as tap-to-chat link when available', () => {
    render(<ProviderCard provider={mockProvider} />)
    const whatsappLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    expect(whatsappLinks[0]).toHaveAttribute(
      'href',
      'https://wa.me/5511912345678'
    )
  })

  it('does not render WhatsApp button when whatsapp is not available', () => {
    render(<ProviderCard provider={mockProviderNoWhatsapp} />)
    expect(
      screen.queryByRole('link', { name: /whatsapp/i })
    ).not.toBeInTheDocument()
  })

  it('renders operating hours', () => {
    render(<ProviderCard provider={mockProvider} />)
    expect(screen.getByText(/Seg-Sex: 24 horas/)).toBeInTheDocument()
    expect(screen.getByText(/Sáb: 24 horas/)).toBeInTheDocument()
  })

  it('renders accepted plans', () => {
    render(<ProviderCard provider={mockProvider} />)
    expect(screen.getByText('Exclusivo I')).toBeInTheDocument()
    expect(screen.getByText('Exclusivo II')).toBeInTheDocument()
    expect(screen.getByText('Empresarial')).toBeInTheDocument()
  })

  it('renders distance when userLocation is provided', () => {
    const userLocation = { lat: -23.55, lng: -46.63 }
    render(<ProviderCard provider={mockProvider} userLocation={userLocation} />)
    // Should display a distance value (e.g., "1,6 km" or "800 m")
    expect(screen.getByText(/\d+,?\d*\s*km|\d+\s*m/)).toBeInTheDocument()
  })

  it('does not render distance when userLocation is not provided', () => {
    const { container } = render(<ProviderCard provider={mockProvider} />)
    // No distance element should be present
    const distanceSpan = container.querySelector('.whitespace-nowrap')
    expect(distanceSpan).not.toBeInTheDocument()
  })

  it('renders directions link with Google Maps URL', () => {
    render(<ProviderCard provider={mockProvider} />)
    const directionsLink = screen.getByRole('link', { name: /como chegar/i })
    expect(directionsLink).toHaveAttribute(
      'href',
      `https://www.google.com/maps/dir/?api=1&destination=${mockProvider.coordinates!.lat},${mockProvider.coordinates!.lng}`
    )
  })

  it('renders show on map button and calls onShowOnMap', () => {
    const onShowOnMap = vi.fn()
    render(
      <ProviderCard provider={mockProvider} onShowOnMap={onShowOnMap} />
    )
    const mapButton = screen.getByRole('button', { name: /ver.*no mapa/i })
    fireEvent.click(mapButton)
    expect(onShowOnMap).toHaveBeenCalledWith('prov-001')
  })

  it('does not render show on map button when onShowOnMap is not provided', () => {
    render(<ProviderCard provider={mockProvider} />)
    expect(
      screen.queryByRole('button', { name: /ver.*no mapa/i })
    ).not.toBeInTheDocument()
  })

  it('action buttons have minimum 40px touch targets', () => {
    render(<ProviderCard provider={mockProvider} onShowOnMap={() => { }} />)
    const callButton = screen.getByRole('link', { name: /ligar/i })
    expect(callButton.className).toContain('min-h-[40px]')
  })
})
