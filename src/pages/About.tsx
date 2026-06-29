import { InfoCard } from '../components/InfoCard/InfoCard'
import { CTASection } from '../components/CTASection/CTASection'

const values = [
  {
    title: 'Cuidado Humanizado',
    description:
      'Colocamos o bem-estar dos nossos beneficiarios em primeiro lugar, oferecendo atendimento acolhedor e personalizado em todas as etapas do cuidado.',
  },
  {
    title: 'Transparencia',
    description:
      'Atuamos com clareza e honestidade em todas as nossas relacoes, garantindo que nossos beneficiarios tenham acesso a informacoes completas sobre seus planos e direitos.',
  },
  {
    title: 'Compromisso com a Qualidade',
    description:
      'Buscamos continuamente a excelencia nos servicos prestados, investindo em uma rede credenciada de alto padrao e em processos que garantem a melhor experiencia de saude.',
  },
  {
    title: 'Acessibilidade',
    description:
      'Trabalhamos para que todos tenham acesso a um plano de saude de qualidade, com condicoes justas e atendimento inclusivo para todas as idades.',
  },
]

export default function About() {
  return (
    <div className="w-full">
      {/* Page Header with photo */}
      <section className="relative w-full overflow-hidden min-h-[320px] tablet:min-h-[380px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl w-full px-4 tablet:px-8 py-20 tablet:py-24">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            A Empresa
          </h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-3xl">
            Conheca a Amacor Planos de Saude e descubra por que somos a escolha
            certa para cuidar da sua saude e da sua familia.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-5xl">
          <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-4">
            Nossa Missao
          </span>
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 mb-6">
            Promovendo saude e qualidade de vida
          </h2>
          <p className="text-body text-warm-600 leading-relaxed max-w-3xl">
            Promover saude e qualidade de vida aos nossos beneficiarios por meio
            de planos acessiveis, atendimento humanizado e uma rede credenciada
            de excelencia. Acreditamos que cuidar da saude e um direito de
            todos, e trabalhamos diariamente para tornar esse cuidado mais
            proximo, eficiente e acolhedor.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-5xl">
          <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-4">
            Nossos Valores
          </span>
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 mb-10">
            O que nos guia
          </h2>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
            {values.map((value) => (
              <InfoCard
                key={value.title}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-5xl">
          <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-4">
            Nossa Visao
          </span>
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 mb-6">
            Referencia em cuidado humano
          </h2>
          <p className="text-body text-warm-600 leading-relaxed max-w-3xl">
            Ser reconhecida como a operadora de planos de saude que mais valoriza
            o cuidado humano, oferecendo solucoes inovadoras e acessiveis que
            transformam a experiencia de saude dos nossos beneficiarios. Queremos
            ser referencia em qualidade, confianca e proximidade no setor de
            saude suplementar.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Pronto para cuidar da sua saude?"
        description="Conheca nossos planos ou entre em contato para tirar suas duvidas."
        primaryAction={{
          text: 'Ver Planos',
          link: '/planos',
          variant: 'default',
        }}
        secondaryAction={{
          text: 'Fale Conosco',
          link: '/contato',
          variant: 'phone',
        }}
      />
    </div>
  )
}
