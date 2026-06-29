import { Link } from 'react-router-dom'
import { buildWhatsAppUrl } from '../../utils/whatsapp'

export interface PlanCardProps {
  name: string
  description: string
  benefits: string[]
  ctaText: string
  ctaLink: string
  highlighted?: boolean
  // New optional props for enhanced version
  slug?: string
  tagline?: string
  startingPrice?: string
  contractType?: string
  whatsappNumber?: string
  whatsappMessage?: string
  coverImage?: string
}

export function PlanCard({
  name,
  description,
  benefits,
  ctaText,
  ctaLink,
  highlighted = false,
  slug,
  tagline,
  startingPrice: _startingPrice,
  contractType,
  whatsappNumber,
  whatsappMessage,
  coverImage,
}: PlanCardProps) {
  const defaultWhatsAppMessage = `Olá! Tenho interesse no plano ${name}. Gostaria de mais informações.`

  return (
    <article
      className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${highlighted
        ? 'border-2 border-primary-600 shadow-card-hover bg-white ring-1 ring-primary-100'
        : 'border border-warm-200 shadow-soft bg-white hover:shadow-card-hover hover:border-warm-300'
        }`}
    >
      {/* Cover image */}
      {coverImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={`Imagem do plano ${name}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-8 tablet:p-10">
        {highlighted && (
          <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-semibold mb-4">
            Mais popular
          </span>
        )}

        {contractType && (
          <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-3">
            {contractType}
          </span>
        )}

        <h3 className="text-heading-sm text-primary-900">
          {name}
        </h3>

        {tagline && (
          <p className="mt-2 text-sm text-warm-500 font-medium">
            {tagline}
          </p>
        )}

        <p className="mt-3 text-body text-warm-600">
          {description}
        </p>

        <ul className="mt-6 flex flex-col gap-3 flex-grow" role="list">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-[16px] text-warm-700"
            >
              <svg className="mt-0.5 flex-shrink-0 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          {slug ? (
            <Link
              to={`/planos/${slug}`}
              className={`inline-flex items-center justify-center w-full min-h-touch px-6 py-4 rounded-xl font-bold text-body transition-all duration-200 ${highlighted
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
                } focus:outline-none focus:ring-4 focus:ring-primary-300`}
            >
              Ver detalhes
            </Link>
          ) : (
            <Link
              to={ctaLink}
              className={`inline-flex items-center justify-center w-full min-h-touch px-6 py-4 rounded-xl font-bold text-body transition-all duration-200 ${highlighted
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
                } focus:outline-none focus:ring-4 focus:ring-primary-300`}
            >
              {ctaText}
            </Link>
          )}

          {whatsappNumber && (
            <a
              href={buildWhatsAppUrl(whatsappNumber, whatsappMessage || defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full min-h-touch px-6 py-4 rounded-xl font-bold text-body transition-all duration-200 bg-whatsapp text-white hover:bg-whatsapp-dark shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-whatsapp/40"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contratar pelo WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default PlanCard
