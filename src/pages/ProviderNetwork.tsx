import { useState } from 'react'
import type { ViewMode, Provider, Specialty, PlanType, ProviderType } from '../types/provider'
import { useGeolocation } from '../hooks/useGeolocation'
import { useProviderSearch } from '../hooks/useProviderSearch'
import { SearchFilters } from '../components/SearchFilters/SearchFilters'
import { ProviderCard } from '../components/ProviderCard/ProviderCard'
import { ProviderMap } from '../components/ProviderMap/ProviderMap'
import providersData from '../data/providers.json'

const providers = providersData as Provider[]

const SPECIALTIES: Specialty[] = [
  'Clínica médica',
  'Cardiologia',
  'Dermatologia',
  'Ginecologia',
  'Pediatria',
  'Ortopedia',
  'Oftalmologia',
  'Laboratório',
  'Fisioterapia',
  'Psicologia',
  'Exames',
  'Urgência',
  'Telemedicina',
]

const PLANS: PlanType[] = ['Exclusivo I', 'Exclusivo II', 'Empresarial']

const PROVIDER_TYPES: ProviderType[] = [
  'Hospital',
  'Clínica',
  'Laboratório',
  'Consultório',
  'Pronto-Socorro',
]

export default function ProviderNetwork() {
  const geolocation = useGeolocation()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)

  const {
    results,
    totalResults,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useProviderSearch({
    providers,
    userLocation: geolocation.position,
  })

  const handleShowOnMap = (providerId: string) => {
    setSelectedProviderId(providerId)
    if (viewMode === 'list') {
      setViewMode('combined')
    }
  }

  const handleMarkerClick = (providerId: string) => {
    setSelectedProviderId(providerId)
  }

  return (
    <div className="w-full min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
        {/* Abstract geometric decoration */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-700/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04]" />
        </div>

        <div className="relative py-16 tablet:py-20 px-4 tablet:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li><a href="/" className="hover:text-white/80 transition-colors">Início</a></li>
                <li aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-white/80 font-medium">Rede Credenciada</li>
              </ol>
            </nav>

            <div className="flex flex-col desktop:flex-row desktop:items-end desktop:justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="font-display text-heading-lg tablet:text-heading-xl text-white tracking-tight">
                  Rede Credenciada
                </h1>
                <p className="mt-4 text-body-lg text-white/70 leading-relaxed">
                  Encontre hospitais, clínicas e laboratórios perto de você. Filtre por especialidade, localização ou tipo de prestador.
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-2.5">
                  <svg className="w-4 h-4 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-white/90">{providers.length} prestadores</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-2.5">
                  <svg className="w-4 h-4 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-white/90">Rio de Janeiro e região</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-2.5">
                  <svg className="w-4 h-4 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium text-white/90">13 especialidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Filters - overlapping hero */}
      <section className="w-full px-4 tablet:px-8 -mt-1 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-2xl shadow-elevated border border-warm-100 p-6 tablet:p-8">
            <SearchFilters
              specialties={SPECIALTIES}
              plans={PLANS}
              providerTypes={PROVIDER_TYPES}
              onFiltersChange={setFilters}
              onGeolocationRequest={geolocation.requestLocation}
              isGeolocating={geolocation.isLoading}
              geolocationError={geolocation.error}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full py-10 tablet:py-12 px-4 tablet:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Toolbar: view toggle + result count */}
          <div className="flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4 mb-8">
            <p className="text-body font-medium text-warm-600">
              <span className="text-primary-900 font-bold text-lg">{totalResults}</span>{' '}
              {totalResults === 1 ? 'prestador encontrado' : 'prestadores encontrados'}
            </p>

            <div className="flex items-center gap-1 p-1 bg-warm-100 rounded-xl" role="group" aria-label="Modo de visualização">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${viewMode === 'list'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-warm-500 hover:text-warm-700'
                  }`}
                aria-pressed={viewMode === 'list'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Lista
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${viewMode === 'map'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-warm-500 hover:text-warm-700'
                  }`}
                aria-pressed={viewMode === 'map'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Mapa
              </button>
              <button
                type="button"
                onClick={() => setViewMode('combined')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${viewMode === 'combined'
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-warm-500 hover:text-warm-700'
                  }`}
                aria-pressed={viewMode === 'combined'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                <span className="hidden tablet:inline">Combinado</span>
              </button>
            </div>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div className="w-full">
              {totalResults === 0 ? (
                <div className="w-full py-20 text-center bg-white rounded-2xl border border-warm-200 shadow-soft">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-warm-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-warm-700">
                    Nenhum prestador encontrado
                  </p>
                  <p className="text-body text-warm-500 mt-2 max-w-sm mx-auto">
                    Tente ampliar os filtros ou buscar por outra especialidade.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 desktop:grid-cols-2 gap-5">
                    {results.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        userLocation={geolocation.position}
                        onShowOnMap={handleShowOnMap}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav
                      className="flex items-center justify-center gap-3 mt-12"
                      aria-label="Paginação de resultados"
                    >
                      <button
                        type="button"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="min-h-touch px-5 py-3 rounded-xl font-semibold text-sm bg-white text-primary-700 border border-warm-200 hover:border-primary-200 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft"
                        aria-label="Página anterior"
                      >
                        ← Anterior
                      </button>
                      <span className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold min-w-[80px] text-center">
                        {currentPage} de {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="min-h-touch px-5 py-3 rounded-xl font-semibold text-sm bg-white text-primary-700 border border-warm-200 hover:border-primary-200 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft"
                        aria-label="Próxima página"
                      >
                        Próxima →
                      </button>
                    </nav>
                  )}
                </>
              )}
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="w-full h-[500px] tablet:h-[650px] rounded-2xl overflow-hidden shadow-elevated border border-warm-100">
              <ProviderMap
                providers={results}
                selectedProviderId={selectedProviderId}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          )}

          {/* Combined View */}
          {viewMode === 'combined' && (
            <div className="flex flex-col desktop:flex-row gap-6 w-full">
              <div className="w-full desktop:w-1/2 desktop:max-h-[650px] desktop:overflow-y-auto desktop:pr-3 scrollbar-thin">
                {totalResults === 0 ? (
                  <div className="w-full py-20 text-center bg-white rounded-2xl border border-warm-200">
                    <p className="text-body-lg text-warm-600">
                      Nenhum prestador encontrado. Tente ampliar os filtros.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      {results.map((provider) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          userLocation={geolocation.position}
                          onShowOnMap={handleShowOnMap}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <nav
                        className="flex items-center justify-center gap-3 mt-8"
                        aria-label="Paginação de resultados"
                      >
                        <button
                          type="button"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="min-h-touch px-5 py-3 rounded-xl font-semibold text-sm bg-white text-primary-700 border border-warm-200 hover:border-primary-200 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft"
                          aria-label="Página anterior"
                        >
                          ← Anterior
                        </button>
                        <span className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold min-w-[80px] text-center">
                          {currentPage} de {totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="min-h-touch px-5 py-3 rounded-xl font-semibold text-sm bg-white text-primary-700 border border-warm-200 hover:border-primary-200 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft"
                          aria-label="Próxima página"
                        >
                          Próxima →
                        </button>
                      </nav>
                    )}
                  </>
                )}
              </div>

              <div className="w-full desktop:w-1/2 h-[400px] desktop:h-[650px] desktop:sticky desktop:top-[96px] rounded-2xl overflow-hidden shadow-elevated border border-warm-100">
                <ProviderMap
                  providers={results}
                  selectedProviderId={selectedProviderId}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full py-16 tablet:py-20 px-4 tablet:px-8 bg-gradient-to-b from-white to-warm-50 border-t border-warm-100">
        <div className="mx-auto max-w-3xl text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-primary-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="font-display text-heading-md text-primary-900 mb-3">
            Não encontrou o que procura?
          </h2>
          <p className="text-body text-warm-500 mb-10 max-w-lg mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar o prestador ideal para suas necessidades.
          </p>
          <div className="flex flex-col items-center gap-3 tablet:flex-row tablet:justify-center">
            <a
              href="https://wa.me/5521999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-touch px-7 py-3.5 rounded-xl bg-whatsapp text-white font-bold text-sm hover:bg-whatsapp-dark focus:outline-none focus:ring-4 focus:ring-whatsapp/30 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar pelo WhatsApp
            </a>
            <a
              href="tel:+552140200639"
              className="inline-flex items-center justify-center min-h-touch px-7 py-3.5 rounded-xl border-2 border-warm-200 text-primary-800 font-bold text-sm hover:bg-warm-50 hover:border-warm-300 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ligar: (21) 4020-0639
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
