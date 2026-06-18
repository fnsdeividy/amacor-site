import { Link } from 'react-router-dom'

export interface CTAAction {
  text: string
  link: string
  variant?: 'whatsapp' | 'phone' | 'default'
}

export interface CTASectionProps {
  title: string
  description?: string
  primaryAction: CTAAction
  secondaryAction?: CTAAction
}

function isExternalLink(link: string): boolean {
  return (
    link.startsWith('tel:') ||
    link.startsWith('https://') ||
    link.startsWith('http://') ||
    link.startsWith('mailto:')
  )
}

function getVariantClasses(variant: CTAAction['variant']): string {
  switch (variant) {
    case 'whatsapp':
      return 'bg-whatsapp text-white hover:bg-whatsapp-dark focus:ring-whatsapp/40'
    case 'phone':
      return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300'
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300'
  }
}

function ActionButton({ action }: { action: CTAAction }) {
  const baseClasses =
    'inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl font-bold text-body focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm hover:shadow-md'
  const variantClasses = getVariantClasses(action.variant)
  const className = `${baseClasses} ${variantClasses}`

  if (isExternalLink(action.link)) {
    return (
      <a
        href={action.link}
        target={action.link.startsWith('tel:') ? undefined : '_blank'}
        rel={action.link.startsWith('tel:') ? undefined : 'noopener noreferrer'}
        className={className}
      >
        {action.text}
      </a>
    )
  }

  return (
    <Link to={action.link} className={className}>
      {action.text}
    </Link>
  )
}

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
}: CTASectionProps) {
  return (
    <section className="w-full bg-warm-50 py-20 tablet:py-24 px-4 tablet:px-8 relative overflow-hidden">
      {/* Grid dots texture */}
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'url(/img/textures/grid-dots.svg)', backgroundRepeat: 'repeat', backgroundSize: '60px 60px' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
          {title}
        </h2>

        {description && (
          <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 tablet:flex-row tablet:justify-center">
          <ActionButton action={primaryAction} />
          {secondaryAction && <ActionButton action={secondaryAction} />}
        </div>
      </div>
    </section>
  )
}

export default CTASection
