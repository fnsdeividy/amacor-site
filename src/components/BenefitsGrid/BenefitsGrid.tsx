import type { BenefitItem } from '../../types/simulation'
import { useInView } from '../../hooks/useInView'

export interface BenefitsGridProps {
  benefits: BenefitItem[]
  className?: string
}

const iconMap: Record<string, JSX.Element> = {
  'phone-call': (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  'hospital': (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'stethoscope': (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v6a3 3 0 003 3h0a3 3 0 003-3V3M9 3H7m2 0h6m0 0h2m-5 12v3a3 3 0 003 3h0a3 3 0 003-3v-1" />
    </svg>
  ),
  'ambulance': (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m0 0a3 3 0 106 0h-6zm-9 0a3 3 0 11-6 0m6 0H3m13-8h2l3 4v4h-2" />
    </svg>
  ),
  'clipboard-list': (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  'user-circle': (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

function BenefitIcon({ icon }: { icon: string }) {
  return iconMap[icon] ?? (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

/**
 * Destaca palavras-chave no título dos benefícios.
 * Aplica cor accent em: números, "24h", "2 mil", e a primeira palavra do título.
 */
function HighlightTitle({ text }: { text: string }) {
  // Highlight numbers and key phrases
  const highlighted = text.replace(
    /(24h|2 mil|2\.000|\d+)/gi,
    '{{$1}}'
  )

  if (highlighted.includes('{{')) {
    const parts = highlighted.split(/\{\{|\}\}/)
    return (
      <>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="text-accent-500">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    )
  }

  // If no numbers, highlight first word
  const spaceIndex = text.indexOf(' ')
  if (spaceIndex > 0) {
    return (
      <>
        <span className="text-primary-500">{text.slice(0, spaceIndex)}</span>
        {text.slice(spaceIndex)}
      </>
    )
  }

  return <>{text}</>
}

export function BenefitsGrid({ benefits, className = '' }: BenefitsGridProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section
      ref={ref}
      className={`grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-3 gap-4 tablet:gap-6 ${className}`}
      aria-label="Benefícios do plano"
    >
      {benefits.map((benefit, index) => (
        <article
          key={benefit.id}
          className={`group relative flex flex-col items-center text-center rounded-2xl bg-white p-6 tablet:p-8 shadow-card border border-primary-100 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 overflow-hidden ${isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-cyan-50 text-primary-500 mb-5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
            <BenefitIcon icon={benefit.icon} />
          </div>

          <h3 className="text-[17px] tablet:text-lg font-bold text-primary-900 mb-2">
            <HighlightTitle text={benefit.title} />
          </h3>

          <p className="text-base text-warm-600 leading-relaxed">
            {benefit.description}
          </p>
        </article>
      ))}
    </section>
  )
}

export default BenefitsGrid
