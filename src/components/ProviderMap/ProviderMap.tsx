import type { Provider, ProviderType } from '../../types/provider'

export interface ProviderMapProps {
  providers: Provider[]
  selectedProviderId?: string | null
  onMarkerClick?: (providerId: string) => void
}

const markerColors: Record<ProviderType, string> = {
  Hospital: 'bg-red-500',
  Clínica: 'bg-blue-500',
  Laboratório: 'bg-purple-500',
  Consultório: 'bg-teal-500',
  'Pronto-Socorro': 'bg-orange-500',
}

const markerBorderColors: Record<ProviderType, string> = {
  Hospital: 'border-red-700',
  Clínica: 'border-blue-700',
  Laboratório: 'border-purple-700',
  Consultório: 'border-teal-700',
  'Pronto-Socorro': 'border-orange-700',
}

/**
 * Placeholder map component that displays provider markers as positioned dots
 * on a styled container. Since no external map library is used, this provides
 * a visual representation of provider locations.
 */
export function ProviderMap({
  providers,
  selectedProviderId,
  onMarkerClick,
}: ProviderMapProps) {
  // Calculate bounds for positioning markers relative to the container
  const bounds = calculateBounds(providers)

  return (
    <div
      className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-lg border border-primary-200 overflow-hidden"
      role="img"
      aria-label="Mapa com localização dos prestadores"
    >
      {/* Map grid lines for visual reference */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 right-0 border-t border-gray-400" />
        <div className="absolute top-1/2 left-0 right-0 border-t border-gray-400" />
        <div className="absolute top-3/4 left-0 right-0 border-t border-gray-400" />
        <div className="absolute left-1/4 top-0 bottom-0 border-l border-gray-400" />
        <div className="absolute left-1/2 top-0 bottom-0 border-l border-gray-400" />
        <div className="absolute left-3/4 top-0 bottom-0 border-l border-gray-400" />
      </div>

      {/* Map label */}
      <div className="absolute top-3 left-3 bg-white/80 rounded-md px-3 py-1.5 text-sm text-gray-600 font-medium shadow-sm">
        📍 Mapa de Prestadores
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 rounded-md px-3 py-2 shadow-sm">
        <p className="text-xs font-semibold text-gray-700 mb-1">Legenda:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(markerColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
              <span className="text-xs text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Provider markers */}
      {providers.map((provider) => {
        const position = getMarkerPosition(provider, bounds)
        const isSelected = provider.id === selectedProviderId
        const color = markerColors[provider.type] ?? 'bg-gray-500'
        const borderColor = markerBorderColors[provider.type] ?? 'border-gray-700'

        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => onMarkerClick?.(provider.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 rounded-full ${isSelected
                ? `w-6 h-6 ${color} border-3 ${borderColor} ring-4 ring-primary-400 scale-150 z-20 shadow-lg`
                : `w-4 h-4 ${color} border-2 ${borderColor} hover:scale-125 z-10 shadow-md`
              }`}
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
            }}
            aria-label={`${provider.name} - ${provider.type}${isSelected ? ' (selecionado)' : ''}`}
            title={provider.name}
          />
        )
      })}

      {/* Selected provider info tooltip */}
      {selectedProviderId && (
        <SelectedProviderTooltip
          provider={providers.find((p) => p.id === selectedProviderId)}
        />
      )}
    </div>
  )
}

interface Bounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

function calculateBounds(providers: Provider[]): Bounds {
  if (providers.length === 0) {
    return { minLat: -24, maxLat: -23, minLng: -47, maxLng: -46 }
  }

  const lats = providers.map((p) => p.coordinates.lat)
  const lngs = providers.map((p) => p.coordinates.lng)

  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  // Add padding to bounds
  const latPadding = (maxLat - minLat) * 0.15 || 0.01
  const lngPadding = (maxLng - minLng) * 0.15 || 0.01

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  }
}

function getMarkerPosition(
  provider: Provider,
  bounds: Bounds
): { top: number; left: number } {
  const latRange = bounds.maxLat - bounds.minLat
  const lngRange = bounds.maxLng - bounds.minLng

  // Invert lat because higher lat = more north = higher on screen (lower %)
  const top = latRange > 0
    ? ((bounds.maxLat - provider.coordinates.lat) / latRange) * 80 + 10
    : 50

  const left = lngRange > 0
    ? ((provider.coordinates.lng - bounds.minLng) / lngRange) * 80 + 10
    : 50

  return { top, left }
}

function SelectedProviderTooltip({ provider }: { provider?: Provider }) {
  if (!provider) return null

  return (
    <div className="absolute top-3 right-3 bg-white rounded-lg shadow-lg p-3 max-w-[220px] z-30 border border-primary-200">
      <h4 className="text-sm font-bold text-primary-800 truncate">
        {provider.name}
      </h4>
      <p className="text-xs text-gray-600 mt-0.5">{provider.type}</p>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
        {provider.address.street}, {provider.address.number} -{' '}
        {provider.address.neighborhood}
      </p>
      <p className="text-xs text-primary-600 mt-1 font-medium">
        {provider.phone}
      </p>
    </div>
  )
}

export default ProviderMap
