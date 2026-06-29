import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection/HeroSection'
import BenefitsGrid from '../components/BenefitsGrid/BenefitsGrid'
import PlanCard from '../components/PlanCard/PlanCard'
import TrustSection from '../components/TrustSection/TrustSection'
import TestimonialsSection from '../components/TestimonialsSection/TestimonialsSection'
import { useInView } from '../hooks/useInView'

import benefits from '../data/benefits.json'
import plans from '../data/plans.json'
import testimonials from '../data/testimonials.json'

const WHATSAPP_PHONE = '5521999999999'

const trustStats = [
  { id: 'tradição', value: '+30', label: 'Anos de tradição' },
  { id: 'regiao', value: 'Zona Oeste', label: 'Região Oeste do RJ' },
  { id: 'ambulatorial', value: '✓', label: 'Atendimento ambulatorial' },
  { id: 'ans', value: 'Ativo', label: 'Registro ANS ativo' },
  { id: 'rede', value: '✓', label: 'Rede própria e credenciada' },
  { id: 'idss', value: '✓', label: 'IDSS avaliado' },
]

const beneficiaryCards = [
  {
    id: 'boleto',
    icon: 'receipt',
    title: '2ª via de boleto',
    description: 'Emita a segunda via do seu boleto online.',
  },
  {
    id: 'manual',
    icon: 'book',
    title: 'Manual do associado',
    description: 'Consulte as regras e coberturas do seu plano.',
  },
  {
    id: 'telemedicina',
    icon: 'video',
    title: 'Telemedicina',
    description: 'Acesse consultas online 24h com médicos.',
  },
  {
    id: 'ouvidoria',
    icon: 'megaphone',
    title: 'Ouvidoria',
    description: 'Registre sugestões, elogios ou reclamações.',
  },
]

function BeneficiaryIcon({ icon }: { icon: string }) {
  const iconClass = 'w-10 h-10'
  switch (icon) {
    case 'receipt':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      )
    case 'book':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'video':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    default:
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

/* ─── Animated Sub-sections ─── */

function PlanCardsSection({ plans, whatsappPhone }: { plans: any[]; whatsappPhone: string }) {
  const { ref, isInView } = useInView({ threshold: 0.05 })

  // Cover images for each plan - diverse families and people
  const planCoverImages: Record<string, string> = {
    'exclusivo-i': 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&w=600&q=80',
    'exclusivo-ii': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
    'mais-com-franquia': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    'empresarial': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80',
  }

  return (
    <section ref={ref} className="w-full py-16 tablet:py-24 px-4 tablet:px-8 bg-gradient-to-b from-warm-50 to-primary-50/30 relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'url(/img/textures/geometric.svg)', backgroundRepeat: 'repeat', backgroundSize: '200px 200px' }} aria-hidden="true" />
      {/* Decorative image - doctor consultation */}
      <div className="absolute -bottom-10 -right-10 w-72 h-72 opacity-[0.06] rounded-full overflow-hidden" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=400&q=60" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className={`text-center mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Planos
          </span>
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
            Nossos planos
          </h2>
          <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
            Encontre o plano ideal para você, sua família ou sua empresa.
          </p>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`hover-lift ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${200 + index * 120}ms` }}
            >
              <PlanCard
                name={plan.name}
                slug={plan.slug}
                tagline={plan.tagline}
                coverImage={planCoverImages[plan.slug]}
                startingPrice={
                  plan.startingPrice
                    ? `A partir de R$ ${plan.startingPrice.toFixed(2).replace('.', ',')}`
                    : undefined
                }
                contractType={plan.contractType}
                description={plan.description}
                benefits={plan.benefits.slice(0, 4)}
                ctaText="Ver detalhes"
                ctaLink={`/planos/${plan.slug}`}
                highlighted={plan.highlighted}
                whatsappNumber={whatsappPhone}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TelemedicineSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <section ref={ref} className="w-full py-16 tablet:py-24 px-4 tablet:px-8 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} aria-hidden="true" />
      {/* Floating decorative accents */}
      <div className="absolute top-12 left-[8%] w-20 h-20 rounded-full bg-accent-400/10 animate-float-gentle" aria-hidden="true" />
      <div className="absolute bottom-20 right-[12%] w-14 h-14 rounded-full bg-cyan-400/10 animate-float-slow" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl flex flex-col desktop:flex-row items-center gap-12 desktop:gap-20">
        {/* Text left */}
        <div className={`w-full desktop:w-1/2 ${isInView ? 'animate-slide-in-left' : 'opacity-0'}`}>
          <span className="inline-block text-sm font-semibold text-accent-300 uppercase tracking-wider mb-4">
            Saúde Digital
          </span>
          <h2 className="text-heading-md tablet:text-heading-lg text-white mb-6">
            Telemedicina 24h no seu celular
          </h2>
          <p className="text-body text-white/75 leading-relaxed mb-4">
            Consulte médicos por vídeo a qualquer hora, de qualquer lugar. Sem filas, sem deslocamento — cuidado médico real na palma da sua mão.
          </p>
          <p className="text-body text-white/75 leading-relaxed mb-8">
            Disponível para todos os beneficiários dos planos Amacor, a telemedicina oferece atendimento rápido e humanizado com profissionais qualificados.
          </p>
          <Link
            to="/telemedicina"
            className="inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-accent-400 text-primary-950 font-bold text-body shadow-lg hover:bg-accent-300 focus:outline-none focus:ring-4 focus:ring-accent-300/50 transition-all duration-200"
          >
            Conhecer a telemedicina
          </Link>
        </div>

        {/* Image right - real telemedicine photo */}
        <div className={`w-full desktop:w-1/2 flex items-center justify-center ${isInView ? 'animate-slide-in-right' : 'opacity-0'}`}>
          <div className="relative w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80"
              alt="Paciente em consulta de telemedicina com médica"
              className="rounded-2xl shadow-elevated w-full object-cover aspect-[4/3]"
            />
            {/* Overlay badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card-hover px-5 py-3 flex items-center gap-3 animate-float-slow">
              <div className="w-10 h-10 rounded-full bg-whatsapp/10 flex items-center justify-center">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-whatsapp" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-primary-900">24h online</p>
                <p className="text-xs text-warm-500">Sem agendamento</p>
              </div>
            </div>
            {/* Floating decorative element */}
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-accent-400/20 animate-pulse-soft" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

function LifestyleGallerySection() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  const photos = [
    {
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      alt: 'Família praticando atividade física ao ar livre',
    },
    {
      src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      alt: 'Pessoa meditando ao ar livre com bem-estar',
    },
    {
      src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
      alt: 'Estilo de vida saudável com yoga',
    },
    {
      src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
      alt: 'Alimentação saudável e nutritiva',
    },
  ]

  return (
    <section ref={ref} className="w-full py-16 tablet:py-24 px-4 tablet:px-8 bg-background-light">
      <div className={`mx-auto max-w-7xl ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="text-center mb-10">
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
            Vida saudável com Amacor
          </h2>
          <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
            Cuidar da saúde é um estilo de vida. Estamos com você em cada etapa.
          </p>
        </div>
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-48 tablet:h-56 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProviderNetworkSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className="w-full relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/85 to-primary-500/75" />
      </div>
      {/* Floating decorative shapes */}
      <div className="absolute top-8 left-[10%] w-16 h-16 rounded-full border border-white/15 animate-float-slow" aria-hidden="true" />
      <div className="absolute bottom-12 right-[8%] w-12 h-12 rounded-full border border-white/15 animate-float-gentle" aria-hidden="true" />

      <div className="relative py-20 tablet:py-24 px-4 tablet:px-8">
        <div className={`mx-auto max-w-4xl text-center ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-heading-md tablet:text-heading-lg text-white mb-5">
            Encontre um prestador perto de você
          </h2>
          <p className="text-body-lg text-white/75 mb-10 max-w-2xl mx-auto">
            Consulte nossa rede credenciada com hospitais, clínicas e laboratórios na Zona Oeste do Rio de Janeiro.
          </p>
          <Link
            to="/rede-credenciada"
            className="inline-flex items-center justify-center min-h-touch px-10 py-4 rounded-xl bg-white text-primary-900 font-bold text-body shadow-lg hover:bg-warm-50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
          >
            Consultar rede credenciada
          </Link>
        </div>
      </div>
    </section>
  )
}

function BeneficiaryAreaSection({ beneficiaryCards }: { beneficiaryCards: { id: string; icon: string; title: string; description: string }[] }) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section
      ref={ref}
      className="w-full py-16 tablet:py-20 px-4 tablet:px-8 bg-primary-50/50 border-y border-primary-100 relative overflow-hidden"
      aria-labelledby="beneficiary-area-heading"
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url(/img/textures/grid-dots.svg)', backgroundRepeat: 'repeat', backgroundSize: '60px 60px' }} aria-hidden="true" />
      {/* Decorative accent */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary-100/50 animate-pulse-soft" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className={`text-center mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Autoatendimento
          </span>
          <h2
            id="beneficiary-area-heading"
            className="text-heading-md tablet:text-heading-lg text-primary-900"
          >
            Área do Beneficiário
          </h2>
          <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
            Acesso rápido aos serviços mais utilizados pelos nossos associados.
          </p>
        </div>
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 tablet:gap-6">
          {beneficiaryCards.map((card, index) => (
            <Link
              key={card.id}
              to="/area-do-beneficiario"
              className={`group flex flex-col items-center text-center rounded-2xl bg-white p-6 shadow-soft border border-warm-100 min-w-[120px] min-h-[120px] hover-lift hover:shadow-card-hover hover:border-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 ${isInView ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-600 mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-200">
                <BeneficiaryIcon icon={card.icon} />
              </div>
              <h3 className="text-body font-semibold text-primary-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-warm-600 leading-relaxed">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      {/* 1. Hero Section with dual CTAs */}
      <HeroSection
        headline="Plano de saúde ambulatorial com cuidado e confiança"
        subtitle="A Amacor oferece planos ambulatoriais individuais, familiares e empresariais com ampla rede credenciada na Zona Oeste do Rio de Janeiro. Simule agora e encontre o plano ideal para você."
        primaryCTA={{
          text: 'Simular meu plano',
          link: 'https://amacorsaude.com.br/simulador/',
          variant: 'button',
        }}
        secondaryCTA={{
          text: 'Falar no WhatsApp',
          link: WHATSAPP_PHONE,
          variant: 'whatsapp',
        }}
        backgroundImage="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
      />

      {/* 2. Benefits Grid (6 cards) */}
      <section className="w-full py-16 tablet:py-24 px-4 tablet:px-8 bg-white relative overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'url(/img/textures/waves.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
        {/* Subtle decorative circles - now animated */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-50 opacity-60 animate-pulse-soft" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-accent-50 opacity-50 animate-float-slow" aria-hidden="true" />
        <div className="absolute top-1/2 left-[60%] w-40 h-40 rounded-full bg-cyan-100/30 animate-float-gentle" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Benefícios
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Por que escolher a Amacor?
            </h2>
            <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
              Conheça os benefícios que fazem a diferença no seu dia a dia.
            </p>
          </div>
          <BenefitsGrid benefits={benefits} />
        </div>
      </section>

      {/* 4. Plan Cards (commercial style) */}
      <PlanCardsSection plans={plans} whatsappPhone={WHATSAPP_PHONE} />

      {/* 5. Saúde Digital section (split layout) */}
      <TelemedicineSection />

      {/* 5.5. Lifestyle Photo Gallery */}
      <LifestyleGallerySection />

      {/* 6. Trust Section (6 stats) */}
      <TrustSection
        title="Por que confiar na Amacor?"
        stats={trustStats}
      />

      {/* 7. Provider Network CTA */}
      <ProviderNetworkSection />

      {/* 8. Testimonials Section */}
      <section className="w-full bg-gradient-to-b from-white to-warm-50">
        <TestimonialsSection
          title="O que dizem nossos beneficiários"
          testimonials={testimonials}
        />
      </section>

      {/* 9. Beneficiary Area Cards */}
      <BeneficiaryAreaSection beneficiaryCards={beneficiaryCards} />

    </div>
  )
}
