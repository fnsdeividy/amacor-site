import { Link } from 'react-router-dom'

export interface PlanCardProps {
  name: string
  description: string
  benefits: string[]
  ctaText: string
  ctaLink: string
  highlighted?: boolean
}

export function PlanCard({
  name,
  description,
  benefits,
  ctaText,
  ctaLink,
  highlighted = false,
}: PlanCardProps) {
  return (
    <article
      className={`flex flex-col rounded-2xl p-8 tablet:p-10 transition-all duration-300 ${highlighted
        ? 'border-2 border-primary-600 shadow-card-hover bg-white ring-1 ring-primary-100'
        : 'border border-warm-200 shadow-soft bg-white hover:shadow-card-hover hover:border-warm-300'
        }`}
    >
      {highlighted && (
        <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-semibold mb-4">
          Mais popular
        </span>
      )}

      <h3 className="text-heading-sm text-primary-900">
        {name}
      </h3>

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

      <div className="mt-8">
        <Link
          to={ctaLink}
          className={`inline-flex items-center justify-center w-full min-h-touch px-6 py-4 rounded-xl font-bold text-body transition-all duration-200 ${highlighted
            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
            : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
            } focus:outline-none focus:ring-4 focus:ring-primary-300`}
        >
          {ctaText}
        </Link>
      </div>
    </article>
  )
}

export default PlanCard
