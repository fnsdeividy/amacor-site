import { Link } from 'react-router-dom'
import plans from '../data/plans.json'
import { PlanCard } from '../components/PlanCard/PlanCard'

export default function Plans() {
  return (
    <div className="w-full">
      {/* Page Header with photo background */}
      <section className="relative w-full overflow-hidden min-h-[280px] tablet:min-h-[380px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/80 to-primary-900/60" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 tablet:px-8 py-20 tablet:py-24">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white text-center">
            Nossos Planos de Saúde
          </h1>
          <p className="mt-4 text-body-lg text-white/80 text-center max-w-2xl mx-auto">
            Conheça os planos ambulatoriais da Amacor e escolha o ideal para você ou sua empresa.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="px-4 py-20 tablet:py-28 tablet:px-8 max-w-7xl mx-auto">
        <h2 className="sr-only">Planos disponíveis</h2>
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              benefits={plan.benefits}
              ctaText="Saiba mais"
              ctaLink={`/planos/${plan.slug}`}
              highlighted={plan.highlighted}
            />
          ))}
        </div>
      </section>

      {/* Trust Section - Por que escolher a Amacor? */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Diferenciais
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Por que escolher a Amacor?
            </h2>
            <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
              Oferecemos planos acessíveis com atendimento humanizado e uma rede credenciada de qualidade no Rio de Janeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-8">
            {/* Trust indicator 1 */}
            <div className="bg-white rounded-2xl border border-warm-200 p-8 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-primary-900 mb-2">Registro ANS</h3>
              <p className="text-body text-warm-600">Operadora registrada e regulamentada pela Agência Nacional de Saúde Suplementar.</p>
            </div>

            {/* Trust indicator 2 */}
            <div className="bg-white rounded-2xl border border-warm-200 p-8 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-primary-900 mb-2">Atendimento humanizado</h3>
              <p className="text-body text-warm-600">Equipe dedicada para acolher você em cada etapa do seu cuidado com a saúde.</p>
            </div>

            {/* Trust indicator 3 */}
            <div className="bg-white rounded-2xl border border-warm-200 p-8 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-primary-900 mb-2">Rede ampla</h3>
              <p className="text-body text-warm-600">Hospitais, clínicas e laboratórios de referência em todo o Rio de Janeiro.</p>
            </div>

            {/* Trust indicator 4 */}
            <div className="bg-white rounded-2xl border border-warm-200 p-8 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-primary-900 mb-2">Preços acessíveis</h3>
              <p className="text-body text-warm-600">Planos com valores justos e transparentes, sem surpresas na hora de pagar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full py-20 tablet:py-24 px-4 tablet:px-8 bg-primary-900 relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-heading-md tablet:text-heading-lg text-white mb-5">
            Pronto para cuidar da sua saúde?
          </h2>
          <p className="text-body-lg text-white/75 mb-10 max-w-2xl mx-auto">
            Entre em contato e receba uma cotação personalizada. Nossa equipe está pronta para ajudar você a encontrar o plano ideal.
          </p>
          <div className="flex flex-col items-center gap-4 tablet:flex-row tablet:justify-center">
            <a
              href="https://wa.me/5521999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-whatsapp text-white font-bold text-body hover:bg-whatsapp-dark focus:outline-none focus:ring-4 focus:ring-whatsapp/40 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chamar no WhatsApp
            </a>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-white text-primary-900 font-bold text-body hover:bg-warm-50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Falar com um consultor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
