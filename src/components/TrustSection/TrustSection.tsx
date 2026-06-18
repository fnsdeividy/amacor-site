export interface TrustStat {
  id: string
  value: string
  label: string
  icon?: string
}

export interface TrustSectionProps {
  title: string
  stats: TrustStat[]
  className?: string
}

export function TrustSection({ title, stats, className = '' }: TrustSectionProps) {
  return (
    <section
      className={`w-full py-20 tablet:py-24 px-4 tablet:px-8 bg-background-light relative overflow-hidden ${className}`}
      aria-labelledby="trust-section-heading"
    >
      {/* Organic blobs texture */}
      <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'url(/img/textures/organic-blobs.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <h2
          id="trust-section-heading"
          className="text-heading-md tablet:text-heading-lg text-primary-900 text-center mb-12 tablet:mb-16"
        >
          {title}
        </h2>

        <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-3 gap-4 tablet:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center rounded-xl shadow-soft bg-white p-6 text-center transition-shadow duration-200 hover:shadow-card-hover"
            >
              {stat.icon && (
                <span
                  className="text-3xl tablet:text-4xl mb-3 text-primary-500"
                  aria-hidden="true"
                >
                  {stat.icon}
                </span>
              )}
              <span className="text-heading-sm tablet:text-heading-md text-primary-900 font-bold">
                {stat.value}
              </span>
              <span className="mt-2 text-body text-warm-600">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
