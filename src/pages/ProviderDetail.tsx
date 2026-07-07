import { useParams, Link } from 'react-router-dom'
import type { Provider } from '../types/provider'
import providersData from '../data/providers.json'

const providers = providersData as Provider[]

export default function ProviderDetail() {
  const { id } = useParams<{ id: string }>()
  const provider = providers.find((p) => p.id === id)

  if (!provider) {
    return (
      <div className="w-full min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-900 mb-4">Prestador não encontrado</h1>
          <Link
            to="/rede-credenciada"
            className="text-primary-600 hover:text-primary-800 font-medium underline"
          >
            ← Voltar para a Rede de Atendimento
          </Link>
        </div>
      </div>
    )
  }

  const fullAddress = [
    `${provider.address.street}, ${provider.address.number}`,
    provider.address.complement,
    `${provider.address.neighborhood} - ${provider.address.city}/${provider.address.state}`,
  ]
    .filter(Boolean)
    .join(', ')

  const phoneDigits = (provider.phone || '').replace(/\D/g, '')
  const whatsappDigits = provider.whatsapp?.replace(/\D/g, '') ?? ''
  const directionsUrl = provider.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${provider.coordinates.lat},${provider.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  return (
    <div className="w-full min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-700/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-3xl" />
        </div>

        <div className="relative py-12 tablet:py-16 px-4 tablet:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li>
                  <a href="/" className="hover:text-white/80 transition-colors">Início</a>
                </li>
                <li aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link to="/rede-credenciada" className="hover:text-white/80 transition-colors">
                    Rede de Atendimento
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-white/80 font-medium truncate max-w-[200px]">{provider.name}</li>
              </ol>
            </nav>

            <div className="flex flex-col gap-4">
              {/* Rede Própria badge */}
              {provider.redePropria && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 w-fit">
                  <svg className="w-4 h-4 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Rede Própria Amacor</span>
                </div>
              )}

              {/* Type badge */}
              <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                {provider.type || 'Prestador'}
              </span>

              <h1 className="font-display text-heading-lg tablet:text-heading-xl text-white tracking-tight">
                {provider.name}
              </h1>

              {provider.highlight && (
                <p className="text-body-lg text-white/70 leading-relaxed max-w-2xl">
                  {provider.highlight}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-10 tablet:py-12 px-4 tablet:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 desktop:grid-cols-3 gap-8">
            {/* Main content - left 2 columns */}
            <div className="desktop:col-span-2 space-y-8">
              {/* Especialidades */}
              {provider.specialties && provider.specialties.length > 0 && (
                <div className="bg-white rounded-2xl border border-warm-200 shadow-soft p-6 tablet:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-primary-900">Especialidades</h2>
                  </div>
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
                    {provider.specialties.map((specialty) => (
                      <div
                        key={specialty}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary-50/50 border border-primary-100"
                      >
                        <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-primary-800">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exames */}
              {provider.exams && provider.exams.length > 0 && (
                <div className="bg-white rounded-2xl border border-warm-200 shadow-soft p-6 tablet:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-primary-900">Exames e Procedimentos</h2>
                  </div>
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
                    {provider.exams.map((exam) => (
                      <div
                        key={exam}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-warm-50 border border-warm-100"
                      >
                        <svg className="w-4 h-4 text-accent-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm font-medium text-warm-700">{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Serviços */}
              {provider.services && provider.services.length > 0 && (
                <div className="bg-white rounded-2xl border border-warm-200 shadow-soft p-6 tablet:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-primary-900">Serviços</h2>
                  </div>
                  <div className="space-y-3">
                    {provider.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50/50 border border-green-100"
                      >
                        <svg className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-green-800">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - right column */}
            <div className="space-y-6">
              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-warm-200 shadow-soft p-6 sticky top-[100px]">
                <h3 className="text-lg font-bold text-primary-900 mb-5">Informações de Contato</h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1">Endereço</p>
                      <p className="text-sm text-warm-700 leading-relaxed">{fullAddress}</p>
                    </div>
                  </div>

                  {/* Operating hours */}
                  {provider.operatingHours && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1">Horário de Funcionamento</p>
                        <div className="space-y-1 text-sm text-warm-700">
                          <p>Seg-Sex: {provider.operatingHours.weekdays}</p>
                          {provider.operatingHours.saturday && <p>Sábado: {provider.operatingHours.saturday}</p>}
                          {provider.operatingHours.sunday && <p>Domingo: {provider.operatingHours.sunday}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {provider.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1">Telefone</p>
                        <p className="text-sm text-warm-700">{provider.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-6 pt-5 border-t border-warm-100 space-y-3">
                  {provider.phone && (
                    <a
                      href={`tel:${phoneDigits}`}
                      className="flex items-center justify-center gap-2 w-full min-h-[44px] px-5 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                      aria-label={`Ligar para ${provider.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Ligar
                    </a>
                  )}

                  {provider.whatsapp && (
                    <a
                      href={`https://wa.me/55${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full min-h-[44px] px-5 py-3 rounded-xl bg-whatsapp text-white text-sm font-bold hover:bg-whatsapp-dark focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                      aria-label={`WhatsApp de ${provider.name}`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full min-h-[44px] px-5 py-3 rounded-xl border-2 border-warm-200 text-warm-700 text-sm font-bold hover:bg-warm-50 hover:border-warm-300 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                    aria-label={`Como chegar em ${provider.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Como Chegar
                  </a>
                </div>

                {/* Back link */}
                <div className="mt-6 pt-5 border-t border-warm-100">
                  <Link
                    to="/rede-credenciada"
                    className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar para a Rede de Atendimento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
