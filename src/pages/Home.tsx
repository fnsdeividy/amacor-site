import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection/HeroSection'
import InfoCard from '../components/InfoCard/InfoCard'
import CTASection from '../components/CTASection/CTASection'

export default function Home() {
  return (
    <div>
      {/* Hero Section with background photo */}
      <HeroSection
        headline="Planos de saude com cuidado e confianca"
        subtitle="A Amacor oferece planos individuais e empresariais com ampla rede credenciada no Rio de Janeiro. Simule agora e encontre o plano ideal para voce."
        ctaText="Simular plano"
        ctaLink="/planos"
        backgroundImage="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
      />

      {/* 3 Highlight Cards with photos */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Nossos servicos
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Solucoes em saude para voce
            </h2>
            <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
              Conheca nossas opcoes de planos e encontre a cobertura ideal para suas necessidades.
            </p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
            <InfoCard
              title="Planos Individuais"
              description="Cobertura completa para voce e sua familia com atendimento de qualidade e rede credenciada ampla."
              image="https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&w=600&q=80"
              link="/planos/exclusivo-ii"
              linkText="Ver planos individuais"
            />
            <InfoCard
              title="Planos Empresariais"
              description="Solucoes sob medida para empresas de todos os portes com carencias reduzidas."
              image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
              link="/planos/empresarial"
              linkText="Ver planos empresariais"
            />
            <InfoCard
              title="Rede Credenciada"
              description="Hospitais, clinicas e laboratorios perto de voce em todo o Rio de Janeiro."
              image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
              link="/rede-credenciada"
              linkText="Consultar rede"
            />
          </div>
        </div>
      </section>

      {/* Institutional Section with side image */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-7xl flex flex-col desktop:flex-row items-center gap-12 desktop:gap-20">
          {/* Image */}
          <div className="w-full desktop:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
                alt="Equipe medica atendendo paciente com cuidado"
                className="w-full h-[320px] tablet:h-[420px] object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full desktop:w-1/2">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-4">
              Sobre nos
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 mb-6">
              Mais de uma decada cuidando de voce
            </h2>
            <p className="text-body text-warm-600 leading-relaxed mb-4">
              A Amacor Planos de Saude tem como missao promover o acesso a saude de qualidade com acolhimento, transparencia e respeito.
            </p>
            <p className="text-body text-warm-600 leading-relaxed mb-8">
              Cuidamos de pessoas com dedicacao e compromisso, oferecendo planos acessiveis e uma rede credenciada de excelencia no Rio de Janeiro.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold text-body hover:text-primary-800 transition-colors"
            >
              Conheca nossa historia
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Trust indicators */}
      <section className="w-full py-20 tablet:py-24 px-4 tablet:px-8 bg-primary-900 relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-2 tablet:grid-cols-4 gap-8 tablet:gap-12 text-center">
            <div>
              <p className="text-heading-lg tablet:text-heading-xl text-white font-bold">10+</p>
              <p className="text-body text-white/60 mt-2">Anos de experiencia</p>
            </div>
            <div>
              <p className="text-heading-lg tablet:text-heading-xl text-white font-bold">30+</p>
              <p className="text-body text-white/60 mt-2">Prestadores na rede</p>
            </div>
            <div>
              <p className="text-heading-lg tablet:text-heading-xl text-accent-400 font-bold">3</p>
              <p className="text-body text-white/60 mt-2">Opcoes de planos</p>
            </div>
            <div>
              <p className="text-heading-lg tablet:text-heading-xl text-white font-bold">24h</p>
              <p className="text-body text-white/60 mt-2">Telemedicina disponivel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Network CTA with background image */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-950/80" />
        </div>
        <div className="relative py-24 tablet:py-28 px-4 tablet:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-heading-md tablet:text-heading-lg text-white mb-5">
              Encontre um prestador perto de voce
            </h2>
            <p className="text-body-lg text-white/75 mb-10 max-w-2xl mx-auto">
              Consulte nossa rede credenciada com hospitais, clinicas e laboratorios em todo o Rio de Janeiro.
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

      {/* Final CTA - WhatsApp + Phone */}
      <CTASection
        title="Fale conosco"
        description="Tire suas duvidas ou solicite uma cotacao agora mesmo."
        primaryAction={{
          text: "Chamar no WhatsApp",
          link: "https://wa.me/5521999999999",
          variant: "whatsapp",
        }}
        secondaryAction={{
          text: "Ligar agora",
          link: "tel:+552140200639",
          variant: "phone",
        }}
      />
    </div>
  )
}
