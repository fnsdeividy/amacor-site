import { useState, useCallback, useRef } from 'react'
import type { ProviderFilters } from '../../types/provider'
import { validateCep } from '../../utils/validation'
import { geocodeCep } from '../../services/geocoding'

export interface SearchFiltersProps {
  specialties: string[]
  plans: string[]
  providerTypes: string[]
  onFiltersChange: (filters: ProviderFilters) => void
  onGeolocationRequest: () => void
  isGeolocating?: boolean
  geolocationError?: string | null
  geolocationSuccess?: boolean
}

export function SearchFilters({
  specialties,
  plans,
  providerTypes,
  onFiltersChange,
  onGeolocationRequest,
  isGeolocating = false,
  geolocationError = null,
  geolocationSuccess = false,
}: SearchFiltersProps) {
  const [cep, setCep] = useState('')
  const [cepError, setCepError] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepLocation, setCepLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [plan, setPlan] = useState('')
  const [providerType, setProviderType] = useState('')
  const geocodeAbortRef = useRef<AbortController | null>(null)

  const emitFilters = useCallback(
    (overrides: Partial<{
      cep: string
      city: string
      neighborhood: string
      specialty: string
      plan: string
      providerType: string
      userLocation: { lat: number; lng: number } | null
    }> = {}) => {
      const currentCep = overrides.cep ?? cep
      const currentCity = overrides.city ?? city
      const currentNeighborhood = overrides.neighborhood ?? neighborhood
      const currentSpecialty = overrides.specialty ?? specialty
      const currentPlan = overrides.plan ?? plan
      const currentProviderType = overrides.providerType ?? providerType
      const currentLocation = overrides.userLocation !== undefined ? overrides.userLocation : cepLocation

      const filters: ProviderFilters = {}

      if (currentCep && validateCep(currentCep)) {
        filters.cep = currentCep.replace(/\D/g, '')
      }
      if (currentLocation) {
        filters.userLocation = currentLocation
        filters.radiusKm = 30
      }
      if (currentCity) {
        filters.city = currentCity
      }
      if (currentNeighborhood) {
        filters.neighborhood = currentNeighborhood
      }
      if (currentSpecialty) {
        filters.specialty = currentSpecialty as ProviderFilters['specialty']
      }
      if (currentPlan) {
        filters.plan = currentPlan as ProviderFilters['plan']
      }
      if (currentProviderType) {
        filters.providerType = currentProviderType as ProviderFilters['providerType']
      }

      onFiltersChange(filters)
    },
    [cep, city, neighborhood, specialty, plan, providerType, cepLocation, onFiltersChange]
  )

  const handleCepChange = (value: string) => {
    const sanitized = value.replace(/[^\d-]/g, '')
    setCep(sanitized)

    const digitsOnly = sanitized.replace(/\D/g, '')

    // Cancel any in-flight geocoding request
    if (geocodeAbortRef.current) {
      geocodeAbortRef.current.abort()
      geocodeAbortRef.current = null
    }

    if (digitsOnly.length === 0) {
      setCepError(null)
      setCepLoading(false)
      setCepLocation(null)
      emitFilters({ cep: '', userLocation: null })
    } else if (digitsOnly.length === 8) {
      if (validateCep(sanitized)) {
        setCepError(null)
        setCepLoading(true)

        // Trigger geocoding
        const abortController = new AbortController()
        geocodeAbortRef.current = abortController

        geocodeCep(digitsOnly).then((result) => {
          if (abortController.signal.aborted) return

          setCepLoading(false)
          if (result) {
            const location = { lat: result.lat, lng: result.lng }
            setCepLocation(location)
            setCepError(null)
            emitFilters({ cep: sanitized, userLocation: location })
          } else {
            setCepLocation(null)
            setCepError('CEP não encontrado. Verifique o número digitado.')
            emitFilters({ cep: sanitized, userLocation: null })
          }
        }).catch(() => {
          if (abortController.signal.aborted) return
          setCepLoading(false)
          setCepLocation(null)
          setCepError('Erro ao buscar localização do CEP. Tente novamente.')
          emitFilters({ cep: sanitized, userLocation: null })
        })
      }
    } else if (digitsOnly.length > 0 && digitsOnly.length !== 8) {
      setCepError('Informe um CEP válido com 8 dígitos.')
    }
  }

  const handleCepBlur = () => {
    const digitsOnly = cep.replace(/\D/g, '')
    if (digitsOnly.length > 0 && digitsOnly.length !== 8) {
      setCepError('Informe um CEP válido com 8 dígitos.')
    }
  }

  const handleCityChange = (value: string) => {
    setCity(value)
    emitFilters({ city: value })
  }

  const handleNeighborhoodChange = (value: string) => {
    setNeighborhood(value)
    emitFilters({ neighborhood: value })
  }

  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value)
    emitFilters({ specialty: value })
  }

  const handlePlanChange = (value: string) => {
    setPlan(value)
    emitFilters({ plan: value })
  }

  const handleProviderTypeChange = (value: string) => {
    setProviderType(value)
    emitFilters({ providerType: value })
  }

  const inputClasses = 'w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-warm-200 text-sm text-primary-900 bg-warm-50 placeholder:text-warm-400 hover:border-warm-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all'
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`
  const labelClasses = 'block text-xs font-semibold text-warm-600 uppercase tracking-wide mb-1.5'

  return (
    <div className="w-full" role="search" aria-label="Filtros de busca de prestadores">
      {/* Location row */}
      <div className="flex flex-col tablet:flex-row gap-3 mb-4">
        <div className="flex-shrink-0">
          <label className={labelClasses}>Localização</label>
          <button
            type="button"
            onClick={onGeolocationRequest}
            disabled={isGeolocating}
            className={`w-full tablet:w-auto min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${geolocationSuccess
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            aria-label="Usar minha localização atual"
          >
            {geolocationSuccess ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className={`w-4 h-4 ${isGeolocating ? 'animate-pulse' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            {isGeolocating ? 'Localizando...' : geolocationSuccess ? 'Localização ativada' : 'Usar minha localização'}
          </button>
          {geolocationError && (
            <p className="mt-1.5 text-xs text-error" role="alert">
              {geolocationError}
            </p>
          )}
          {geolocationSuccess && !geolocationError && (
            <p className="mt-1.5 text-xs text-green-600">
              Mostrando prestadores mais próximos.
            </p>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 tablet:grid-cols-3 gap-3">
          <div>
            <label htmlFor="search-cep" className={labelClasses}>CEP</label>
            <div className="relative">
              <input
                id="search-cep"
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={cep}
                onChange={(e) => handleCepChange(e.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                aria-describedby={cepError ? 'cep-error' : undefined}
                aria-invalid={cepError ? true : undefined}
                className={`${inputClasses} ${cepError ? 'border-error focus:ring-error/20 focus:border-error' : ''} ${cepLoading ? 'pr-10' : ''}`}
              />
              {cepLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
            </div>
            {cepError && (
              <p id="cep-error" className="mt-1 text-xs text-error" role="alert">
                {cepError}
              </p>
            )}
            {cepLocation && !cepError && (
              <p className="mt-1 text-xs text-green-600">
                Localização encontrada. Mostrando prestadores próximos.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="search-city" className={labelClasses}>Cidade</label>
            <input
              id="search-city"
              type="text"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Ex: Rio de Janeiro"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="search-neighborhood" className={labelClasses}>Bairro</label>
            <input
              id="search-neighborhood"
              type="text"
              value={neighborhood}
              onChange={(e) => handleNeighborhoodChange(e.target.value)}
              placeholder="Ex: Copacabana"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3">
        <div>
          <label htmlFor="search-specialty" className={labelClasses}>Especialidade</label>
          <select
            id="search-specialty"
            value={specialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">Todas as especialidades</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-plan" className={labelClasses}>Plano</label>
          <select
            id="search-plan"
            value={plan}
            onChange={(e) => handlePlanChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">Todos os planos</option>
            {plans.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-provider-type" className={labelClasses}>Tipo</label>
          <select
            id="search-provider-type"
            value={providerType}
            onChange={(e) => handleProviderTypeChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">Todos os tipos</option>
            {providerTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
