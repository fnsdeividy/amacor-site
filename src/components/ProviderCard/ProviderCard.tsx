import type { Provider } from '../../types/provider'
import { haversineDistance } from '../../utils/distance'
import { formatDistance } from '../../utils/formatters'

export interface ProviderCardProps {
  provider: Provider
  userLocation?: { lat: number; lng: number } | null
  onShowOnMap?: (providerId: string) => void
}

const typeConfig: Record<string, { accent: string; bg: string; text: string; iconPath: string }> = {
  Hospital: {
    accent: 'bg-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  'Clínica': {
    accent: 'bg-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  'Laboratório': {
    accent: 'bg-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  'Consultório': {
    accent: 'bg-teal-500',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  'Pronto-Socorro': {
    accent: 'bg-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
}

export function ProviderCard({
  provider,
  userLocation,
  onShowOnMap,
}: ProviderCardProps) {
  const distance =
    userLocation && provider.coordinates
      ? haversineDistance(
        userLocation.lat,
        userLocation.lng,
        provider.coordinates.lat,
        provider.coordinates.lng
      )
      : null

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

  const config = typeConfig[provider.type || 'Clínica'] ?? {
    accent: 'bg-warm-500',
    bg: 'bg-warm-50',
    text: 'text-warm-700',
    iconPath: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  }

  return (
    <article className="group rounded-2xl bg-white border border-warm-200 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
      {/* Content */}
      <div className="p-5 tablet:p-6">
        {/* Top row: type badge + distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.accent}`} aria-hidden="true" />
            <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
              {provider.type || 'Prestador'}
            </span>
          </div>
          {distance !== null && (
            <span className="text-xs font-semibold text-warm-500 bg-warm-100 px-2.5 py-1 rounded-full">
              {formatDistance(distance)}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-primary-900 leading-snug mb-2.5">{provider.name}</h3>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(provider.specialties || []).slice(0, 4).map((specialty) => (
            <span
              key={specialty}
              className={`text-xs font-medium ${config.bg} ${config.text} px-2 py-0.5 rounded-md`}
            >
              {specialty}
            </span>
          ))}
          {(provider.specialties || []).length > 4 && (
            <span className="text-xs font-medium text-warm-400 px-2 py-0.5">
              +{(provider.specialties || []).length - 4}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-warm-600">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-warm-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="leading-snug">{fullAddress}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-warm-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Seg-Sex: {provider.operatingHours?.weekdays || 'Consultar'}
              {provider.operatingHours?.saturday && (
                <span className="text-warm-400"> · Sáb: {provider.operatingHours.saturday}</span>
              )}
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-warm-100">
          {(provider.acceptedPlans || []).map((plan) => (
            <span
              key={plan}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              {plan}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 tablet:px-6 py-3.5 bg-warm-50/50 border-t border-warm-100 flex flex-wrap gap-2">
        <a
          href={`tel:${phoneDigits}`}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
          aria-label={`Ligar para ${provider.name}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Ligar
        </a>

        {provider.whatsapp && (
          <a
            href={`https://wa.me/55${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-whatsapp text-white text-xs font-semibold hover:bg-whatsapp-dark focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
            aria-label={`WhatsApp de ${provider.name}`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        )}

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg border border-warm-200 bg-white text-warm-600 text-xs font-medium hover:bg-warm-50 hover:border-warm-300 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
          aria-label={`Como chegar em ${provider.name}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Rota
        </a>

        {onShowOnMap && (
          <button
            type="button"
            onClick={() => onShowOnMap(provider.id)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg border border-warm-200 bg-white text-warm-600 text-xs font-medium hover:bg-warm-50 hover:border-warm-300 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
            aria-label={`Ver ${provider.name} no mapa`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Mapa
          </button>
        )}
      </div>
    </article>
  )
}

export default ProviderCard
