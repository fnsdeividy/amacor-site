import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SearchFilters } from './SearchFilters'

const defaultProps = {
  specialties: ['Cardiologia', 'Dermatologia', 'Pediatria'],
  plans: ['Exclusivo I', 'Exclusivo II', 'Empresarial'],
  providerTypes: ['Hospital', 'Clínica', 'Laboratório'],
  onFiltersChange: vi.fn(),
  onGeolocationRequest: vi.fn(),
}

describe('SearchFilters', () => {
  it('renders all filter controls', () => {
    render(<SearchFilters {...defaultProps} />)

    expect(screen.getByLabelText('Usar minha localização atual')).toBeInTheDocument()
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
    expect(screen.getByLabelText('Bairro')).toBeInTheDocument()
    expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
    expect(screen.getByLabelText('Plano')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument()
  })

  it('calls onGeolocationRequest when geolocation button is clicked', () => {
    const onGeolocationRequest = vi.fn()
    render(<SearchFilters {...defaultProps} onGeolocationRequest={onGeolocationRequest} />)

    fireEvent.click(screen.getByLabelText('Usar minha localização atual'))
    expect(onGeolocationRequest).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isGeolocating is true', () => {
    render(<SearchFilters {...defaultProps} isGeolocating={true} />)

    const button = screen.getByLabelText('Usar minha localização atual')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Localizando...')
  })

  it('displays geolocation error message', () => {
    render(
      <SearchFilters
        {...defaultProps}
        geolocationError="Localização indisponível. Busque por CEP ou cidade."
      />
    )

    expect(
      screen.getByText('Localização indisponível. Busque por CEP ou cidade.')
    ).toBeInTheDocument()
  })

  it('validates CEP input and shows error for invalid format', () => {
    render(<SearchFilters {...defaultProps} />)

    const cepInput = screen.getByLabelText('CEP')
    fireEvent.change(cepInput, { target: { value: '123' } })
    fireEvent.blur(cepInput)

    expect(screen.getByText('Informe um CEP válido com 8 dígitos.')).toBeInTheDocument()
  })

  it('does not show CEP error for valid 8-digit input', () => {
    render(<SearchFilters {...defaultProps} />)

    const cepInput = screen.getByLabelText('CEP')
    fireEvent.change(cepInput, { target: { value: '01310100' } })

    expect(screen.queryByText('Informe um CEP válido com 8 dígitos.')).not.toBeInTheDocument()
  })

  it('calls onFiltersChange when CEP is valid', () => {
    const onFiltersChange = vi.fn()
    render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

    const cepInput = screen.getByLabelText('CEP')
    fireEvent.change(cepInput, { target: { value: '01310100' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ cep: '01310100' })
    )
  })

  it('calls onFiltersChange when city is typed', () => {
    const onFiltersChange = vi.fn()
    render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

    const cityInput = screen.getByLabelText('Cidade')
    fireEvent.change(cityInput, { target: { value: 'São Paulo' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'São Paulo' })
    )
  })

  it('calls onFiltersChange when neighborhood is typed', () => {
    const onFiltersChange = vi.fn()
    render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

    const neighborhoodInput = screen.getByLabelText('Bairro')
    fireEvent.change(neighborhoodInput, { target: { value: 'Centro' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ neighborhood: 'Centro' })
    )
  })

  it('renders specialty options with "Todas as especialidades" as default', () => {
    render(<SearchFilters {...defaultProps} />)

    const select = screen.getByLabelText('Especialidade')
    expect(select).toHaveValue('')

    const options = select.querySelectorAll('option')
    expect(options[0]).toHaveTextContent('Todas as especialidades')
    expect(options[1]).toHaveTextContent('Cardiologia')
    expect(options[2]).toHaveTextContent('Dermatologia')
    expect(options[3]).toHaveTextContent('Pediatria')
  })

  it('calls onFiltersChange when specialty is selected', () => {
    const onFiltersChange = vi.fn()
    render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

    const select = screen.getByLabelText('Especialidade')
    fireEvent.change(select, { target: { value: 'Cardiologia' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ specialty: 'Cardiologia' })
    )
  })

  it('renders plan options with "Todos os planos" as default', () => {
    render(<SearchFilters {...defaultProps} />)

    const select = screen.getByLabelText('Plano')
    expect(select).toHaveValue('')

    const options = select.querySelectorAll('option')
    expect(options[0]).toHaveTextContent('Todos os planos')
    expect(options[1]).toHaveTextContent('Exclusivo I')
  })

  it('calls onFiltersChange when plan is selected', () => {
    const onFiltersChange = vi.fn()
    render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

    const select = screen.getByLabelText('Plano')
    fireEvent.change(select, { target: { value: 'Exclusivo II' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'Exclusivo II' })
    )
  })

  it('renders provider type options with "Todos os tipos" as default', () => {
    render(<SearchFilters {...defaultProps} />)

    const select = screen.getByLabelText('Tipo')
    expect(select).toHaveValue('')

    const options = select.querySelectorAll('option')
    expect(options[0]).toHaveTextContent('Todos os tipos')
    expect(options[1]).toHaveTextContent('Hospital')
  })

  it('calls onFiltersChange when provider type is selected', () => {
    const onFiltersChange = vi.fn()
    render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

    const select = screen.getByLabelText('Tipo')
    fireEvent.change(select, { target: { value: 'Hospital' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ providerType: 'Hospital' })
    )
  })

  it('has minimum 44px height on all inputs and buttons', () => {
    render(<SearchFilters {...defaultProps} />)

    const cepInput = screen.getByLabelText('CEP')
    expect(cepInput.className).toContain('min-h-[44px]')

    const cityInput = screen.getByLabelText('Cidade')
    expect(cityInput.className).toContain('min-h-[44px]')

    const button = screen.getByLabelText('Usar minha localização atual')
    expect(button.className).toContain('min-h-[44px]')
  })

  it('has search role for accessibility', () => {
    render(<SearchFilters {...defaultProps} />)

    expect(screen.getByRole('search')).toBeInTheDocument()
  })
})
