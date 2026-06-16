import type { Testimonial } from '../../types'

export interface TestimonialsSectionProps {
  title?: string
  testimonials: Testimonial[]
  className?: string
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      className={filled ? 'text-accent-400' : 'text-warm-300'}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z"
      />
    </svg>
  )
}

function StarRating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating)

  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`} role="img">
      {stars.map((filled, index) => (
        <StarIcon key={index} filled={filled} />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="rounded-2xl shadow-soft bg-white p-6 tablet:p-8 flex flex-col gap-4">
      <blockquote className="text-body italic text-warm-700 leading-relaxed flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {testimonial.rating != null && (
        <StarRating rating={testimonial.rating} />
      )}

      <footer className="flex items-center gap-3">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={`Foto de ${testimonial.name}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-primary-900">{testimonial.name}</p>
          {testimonial.location && (
            <p className="text-sm text-warm-500">{testimonial.location}</p>
          )}
        </div>
      </footer>
    </article>
  )
}

export function TestimonialsSection({
  title,
  testimonials,
  className = '',
}: TestimonialsSectionProps) {
  return (
    <section className={`w-full py-20 tablet:py-24 px-4 tablet:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {title && (
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 text-center mb-12">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
