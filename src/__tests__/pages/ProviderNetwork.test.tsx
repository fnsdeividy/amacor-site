import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProviderNetwork from '../../pages/ProviderNetwork'
import type { Provider } from '../../types/provider'

// Mock the hooks
vi.mock('../../hooks/useGeolocation', () => ({
  useGeolocation: vi.fn(),
}))

vi.mock('../../hooks/useProviderSearch', () => ({
  useProviderSearch: vi.fn(),
}))

// Mock ProviderMap to avoid rendering complexity
vi.mock('../../components/ProviderMap/ProviderMap', () => ({
  ProviderMap: ({ providers }: { providers: Provider[] }) => (
    <div data-testid="provider-map">Mapa ({providers.length} prestadores)</div>
  ),
}))

import { useGeolocation } from '../../hooks/useGeolocation'
import { useProviderSearch } from '../../hooks/useProviderSearch'

const mockUseGeolocation = useGeolocation as ReturnType<typeof vi.fn>
const mockUseProviderSearch = useProviderSearch as ReturnType<typeof vi.fn>

const createMockProvider = (overrides: Partial<Provider> = {}): Provider => ({
  id: 'prov-001',
  name: 'Hospital São Lucas',
  type: 'Hospital',
  specialties: ['Clínica médica', 'Cardiologia'],
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
  ...overrides,
})


const mockProviders: Provider[] = [
  createMockProvider({ id: 'prov-001', name: 'Hospital São Lucas' }),
  createMockProvider({ id: 'prov-002', name: 'Clínica Vida Plena', type: 'Clínica' }),
  createMockProvider({ id: 'prov-003', name: 'Laboratório Central', type: 'Laboratório' }),
]

function setupDefaultMocks(overrides: {
  geolocation?: Partial<ReturnType<typeof useGeolocation>>;
  providerSearch?: Partial<ReturnType<typeof useProviderSearch>>;
} = {}) {
  mockUseGeolocation.mockReturnValue({
    position: null,
    error: null,
    isLoading: false,
    isPermissionDenied: false,
    requestLocation: vi.fn(),
    ...overrides.geolocation,
  })

  mockUseProviderSearch.mockReturnValue({
    results: mockProviders,
    totalResults: mockProviders.length,
    filters: {},
    setFilters: vi.fn(),
    sortBy: 'alphabetical',
    setSortBy: vi.fn(),
    currentPage: 1,
    setCurrentPage: vi.fn(),
    totalPages: 1,
    ...overrides.providerSearch,
  })
}

describe('ProviderNetwork Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupDefaultMocks()
  })

  describe('Page heading and search filters', () => {
    it('renders the page heading "Rede Credenciada"', () => {
      render(<ProviderNetwork />)
      expect(
        screen.getByRole('heading', { name: 'Rede Credenciada' })
      ).toBeInTheDocument()
    })

    it('renders the page subtitle', () => {
      render(<ProviderNetwork />)
      expect(
        screen.getByText(/Encontre hospitais, clínicas e laboratórios perto de você/)
      ).toBeInTheDocument()
    })

    it('renders search filter controls', () => {
      render(<ProviderNetwork />)
      // SearchFilters component should be rendered with filter options
      expect(screen.getByLabelText('CEP')).toBeInTheDocument()
      expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
      expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
      expect(screen.getByLabelText('Plano')).toBeInTheDocument()
      expect(screen.getByLabelText('Tipo')).toBeInTheDocument()
    })
  })

  describe('Provider cards rendering', () => {
    it('renders provider cards from results', () => {
      render(<ProviderNetwork />)
      expect(screen.getByText('Hospital São Lucas')).toBeInTheDocument()
      expect(screen.getByText('Clínica Vida Plena')).toBeInTheDocument()
      expect(screen.getByText('Laboratório Central')).toBeInTheDocument()
    })

    it('displays the total results count', () => {
      render(<ProviderNetwork />)
      expect(screen.getByText(/prestadores encontrados/)).toBeInTheDocument()
    })

    it('displays singular form for 1 result', () => {
      setupDefaultMocks({
        providerSearch: {
          results: [mockProviders[0]],
          totalResults: 1,
        },
      })
      render(<ProviderNetwork />)
      expect(screen.getByText(/prestador encontrado/)).toBeInTheDocument()
    })
  })

  describe('View mode switching', () => {
    it('renders view mode toggle buttons (Lista, Mapa, Combinado)', () => {
      render(<ProviderNetwork />)
      const viewGroup = screen.getByRole('group', { name: /modo de visualização/i })
      expect(viewGroup).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Lista' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Mapa' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Combinado' })).toBeInTheDocument()
    })

    it('defaults to list view with Lista button pressed', () => {
      render(<ProviderNetwork />)
      const listButton = screen.getByRole('button', { name: 'Lista' })
      expect(listButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('switches to map view when Mapa button is clicked', () => {
      render(<ProviderNetwork />)
      const mapButton = screen.getByRole('button', { name: 'Mapa' })
      fireEvent.click(mapButton)

      expect(mapButton).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'Lista' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
      expect(screen.getByTestId('provider-map')).toBeInTheDocument()
    })

    it('switches to combined view when Combinado button is clicked', () => {
      render(<ProviderNetwork />)
      const combinedButton = screen.getByRole('button', { name: 'Combinado' })
      fireEvent.click(combinedButton)

      expect(combinedButton).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByTestId('provider-map')).toBeInTheDocument()
      // Provider cards should still be visible in combined view
      expect(screen.getByText('Hospital São Lucas')).toBeInTheDocument()
    })

    it('hides provider cards in map-only view', () => {
      render(<ProviderNetwork />)
      fireEvent.click(screen.getByRole('button', { name: 'Mapa' }))

      // Provider cards should not be rendered in map-only view
      expect(screen.queryByText('Hospital São Lucas')).not.toBeInTheDocument()
      expect(screen.getByTestId('provider-map')).toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('displays empty state message when no providers match filters', () => {
      setupDefaultMocks({
        providerSearch: {
          results: [],
          totalResults: 0,
          totalPages: 0,
        },
      })
      render(<ProviderNetwork />)
      expect(
        screen.getByText('Nenhum prestador encontrado')
      ).toBeInTheDocument()
    })

    it('does not render pagination when no results', () => {
      setupDefaultMocks({
        providerSearch: {
          results: [],
          totalResults: 0,
          totalPages: 0,
        },
      })
      render(<ProviderNetwork />)
      expect(
        screen.queryByRole('navigation', { name: /paginação/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Pagination controls', () => {
    it('renders pagination when totalPages > 1', () => {
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 32,
          totalPages: 2,
          currentPage: 1,
        },
      })
      render(<ProviderNetwork />)
      expect(
        screen.getByRole('navigation', { name: /paginação/i })
      ).toBeInTheDocument()
      expect(screen.getByText('1 de 2')).toBeInTheDocument()
    })

    it('does not render pagination when totalPages is 1', () => {
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 3,
          totalPages: 1,
        },
      })
      render(<ProviderNetwork />)
      expect(
        screen.queryByRole('navigation', { name: /paginação/i })
      ).not.toBeInTheDocument()
    })

    it('disables "Anterior" button on first page', () => {
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 32,
          totalPages: 2,
          currentPage: 1,
        },
      })
      render(<ProviderNetwork />)
      expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
    })

    it('disables "Próxima" button on last page', () => {
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 32,
          totalPages: 2,
          currentPage: 2,
        },
      })
      render(<ProviderNetwork />)
      expect(screen.getByRole('button', { name: /próxima/i })).toBeDisabled()
    })

    it('calls setCurrentPage when "Próxima" is clicked', () => {
      const setCurrentPage = vi.fn()
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 32,
          totalPages: 2,
          currentPage: 1,
          setCurrentPage,
        },
      })
      render(<ProviderNetwork />)
      fireEvent.click(screen.getByRole('button', { name: /próxima/i }))
      expect(setCurrentPage).toHaveBeenCalledWith(2)
    })

    it('calls setCurrentPage when "Anterior" is clicked', () => {
      const setCurrentPage = vi.fn()
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 32,
          totalPages: 2,
          currentPage: 2,
          setCurrentPage,
        },
      })
      render(<ProviderNetwork />)
      fireEvent.click(screen.getByRole('button', { name: /anterior/i }))
      expect(setCurrentPage).toHaveBeenCalledWith(1)
    })
  })

  describe('Geolocation permission denied flow', () => {
    it('displays geolocation error message when permission is denied', () => {
      setupDefaultMocks({
        geolocation: {
          error: 'Localização indisponível. Busque por CEP ou cidade.',
          isPermissionDenied: true,
        },
      })
      render(<ProviderNetwork />)
      expect(
        screen.getByText('Localização indisponível. Busque por CEP ou cidade.')
      ).toBeInTheDocument()
    })

    it('passes geolocation error to SearchFilters', () => {
      setupDefaultMocks({
        geolocation: {
          error: 'Localização indisponível. Busque por CEP ou cidade.',
          isPermissionDenied: true,
        },
      })
      render(<ProviderNetwork />)
      // The error message should be visible through SearchFilters
      expect(
        screen.getByText('Localização indisponível. Busque por CEP ou cidade.')
      ).toBeInTheDocument()
    })

    it('shows loading state when geolocating', () => {
      setupDefaultMocks({
        geolocation: {
          isLoading: true,
        },
      })
      render(<ProviderNetwork />)
      // The geolocation button should show loading state
      const geoButton = screen.getByLabelText('Usar minha localização atual')
      expect(geoButton).toBeDisabled()
      expect(geoButton).toHaveTextContent('Localizando...')
    })
  })

  describe('Filter interactions', () => {
    it('passes setFilters to SearchFilters for filter changes', () => {
      const setFilters = vi.fn()
      setupDefaultMocks({
        providerSearch: {
          results: mockProviders,
          totalResults: 3,
          setFilters,
        },
      })
      render(<ProviderNetwork />)

      // Change specialty filter
      const specialtySelect = screen.getByLabelText('Especialidade')
      fireEvent.change(specialtySelect, { target: { value: 'Cardiologia' } })
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ specialty: 'Cardiologia' })
      )
    })

    it('passes requestLocation to SearchFilters for geolocation', () => {
      const requestLocation = vi.fn()
      setupDefaultMocks({
        geolocation: { requestLocation },
      })
      render(<ProviderNetwork />)

      const geoButton = screen.getByLabelText('Usar minha localização atual')
      fireEvent.click(geoButton)
      expect(requestLocation).toHaveBeenCalledTimes(1)
    })
  })
})
