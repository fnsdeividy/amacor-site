import { Link } from 'react-router-dom'
import { buildWhatsAppUrl } from '../../utils/whatsapp'

export interface CTAProps {
  text: string
  link: string
  variant?: 'button' | 'scroll' | 'whatsapp' | 'phone' | 'link'
}

export interface HeroSectionProps {
  headline: string
  subtitle: string
  /** @deprecated Use primaryCTA instead */
  ctaText?: string
  /** @deprecated Use primaryCTA instead */
  ctaLink?: string
  primaryCTA?: {
    text: string
    link: string
    variant?: 'button' | 'scroll'
  }
  secondaryCTA?: {
    text: string
    link: string
    variant?: 'whatsapp' | 'phone' | 'link'
  }
  backgroundImage?: string
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  )
}

function renderPrimaryCTA(cta: { text: string; link: string; variant?: 'button' | 'scroll' }) {
  const variant = cta.variant || 'button'

  if (variant === 'scroll') {
    return (
      <a
        href={cta.link}
        className="group inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-accent-400 text-primary-950 font-bold text-body shadow-lg hover:bg-accent-300 focus:outline-none focus:ring-4 focus:ring-accent-300/50 transition-all duration-300"
      >
        {cta.text}
        <ArrowIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </a>
    )
  }

  // Default 'button' variant uses React Router Link
  return (
    <Link
      to={cta.link}
      className="group inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-accent-400 text-primary-950 font-bold text-body shadow-lg hover:bg-accent-300 focus:outline-none focus:ring-4 focus:ring-accent-300/50 transition-all duration-300"
    >
      {cta.text}
      <ArrowIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}

function renderSecondaryCTA(cta: { text: string; link: string; variant?: 'whatsapp' | 'phone' | 'link' }) {
  const variant = cta.variant || 'link'

  if (variant === 'whatsapp') {
    const whatsappUrl = buildWhatsAppUrl(cta.link, 'Olá! Estou no site da Amacor e gostaria de mais informações.')
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-touch px-7 py-4 rounded-xl bg-whatsapp/90 border border-whatsapp text-white font-semibold text-body hover:bg-whatsapp focus:outline-none focus:ring-4 focus:ring-whatsapp/30 transition-all duration-300"
      >
        <WhatsAppIcon className="w-5 h-5 mr-2" />
        {cta.text}
      </a>
    )
  }

  if (variant === 'phone') {
    return (
      <a
        href={`tel:${cta.link}`}
        className="inline-flex items-center justify-center min-h-touch px-7 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold text-body hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
      >
        <PhoneIcon className="w-5 h-5 mr-2" />
        {cta.text}
      </a>
    )
  }

  // Default 'link' variant
  return (
    <Link
      to={cta.link}
      className="inline-flex items-center justify-center min-h-touch px-7 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold text-body hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
    >
      {cta.text}
    </Link>
  )
}

export function HeroSection({
  headline,
  subtitle,
  ctaText,
  ctaLink,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
}: HeroSectionProps) {
  // Resolve the primary CTA: prefer new prop, fall back to legacy props
  const resolvedPrimaryCTA = primaryCTA ?? (ctaText && ctaLink ? { text: ctaText, link: ctaLink, variant: 'button' as const } : undefined)

  return (
    <section className="relative w-full overflow-hidden min-h-[560px] tablet:min-h-[620px] desktop:min-h-[700px] flex items-center">
      {/* Background image or gradient */}
      {backgroundImage ? (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-[scale-in_1.2s_ease-out_both]"
          />
          <div className="absolute inset-0 bg-gradient-brand-overlay" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-brand" aria-hidden="true" />
      )}

      {/* Floating decorative shapes */}
      <div className="absolute top-16 right-[10%] w-24 h-24 tablet:w-32 tablet:h-32 rounded-full bg-white/5 animate-float-gentle" aria-hidden="true" />
      <div className="absolute bottom-24 right-[20%] w-16 h-16 tablet:w-20 tablet:h-20 rounded-full bg-accent-400/10 animate-float-slow" aria-hidden="true" />
      <div className="absolute top-1/3 right-[5%] w-10 h-10 rounded-full bg-cyan-400/15 animate-pulse-soft" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 tablet:px-8 py-24 tablet:py-32 desktop:py-40">
        <div className="flex flex-col gap-8 max-w-2xl">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white leading-tight tracking-tight animate-fade-in-up">
            {headline}
          </h1>
          <p className="text-body-lg text-white/85 leading-relaxed max-w-xl animate-fade-in-up delay-200">
            {subtitle}
          </p>
          <div className="mt-2 flex flex-wrap gap-4 animate-fade-in-up delay-400">
            {resolvedPrimaryCTA && renderPrimaryCTA(resolvedPrimaryCTA)}
            {secondaryCTA && renderSecondaryCTA(secondaryCTA)}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
