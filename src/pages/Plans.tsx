import { useState } from 'react'
import { Link } from 'react-router-dom'
import plans from '../data/plans.json'
import { PlanCard } from '../components/PlanCard/PlanCard'
import { SimulationWidget } from '../components/SimulationWidget/SimulationWidget'

type FilterCategory = 'Todos' | 'Individual' | 'Familiar' | 'Empresarial'

const FILTER_TABS: FilterCategory[] = ['Todos', 'Individual', 'Familiar', 'Empresarial']

function formatPrice(price: number | null): string {
  if (price === null) return 'Sob consulta'
  return `A partir de R$ ${price.toFixed(2).replace('.', ',')}`
}

function mapContractTypeLabel(contractType: string): string {
  switch (contractType) {
    case 'individual':
      return 'Individual'
    case 'familiar':
      return 'Familiar'
    case 'empresarial':
      return 'Empresarial'
    default:
      return contractType
  }
}

export default function Plans() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Todos')

  const filteredPlans = plans.filter((plan) => {
    if (activeFilter === 'Todos') return true
    return plan.contractType.toLowerCase() === activeFilter.toLowerCase()
  })

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

      {/* Simulation Widget */}
      <section className="px-4 tablet:px-8 max-w-7xl mx-auto -mt-12 relative z-20">
        <SimulationWidget className="border border-warm-200" />
      </section>

      {/* Filter Tabs + Plans Grid */}
      <section className="px-4 py-16 tablet:py-20 tablet:px-8 max-w-7xl mx-auto">
        <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 text-center mb-8">
          Escolha o plano ideal
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Filtrar planos por categoria">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeFilter === tab}
              onClick={() => setActiveFilter(tab)}
              className={`min-h-touch px-6 py-3 rounded-xl font-semibold text-body transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300 ${activeFilter === tab
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-warm-600 border border-warm-300 hover:bg-primary-50 hover:text-primary-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div
          className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6"
          role="tabpanel"
          aria-label={`Planos: ${activeFilter}`}
        >
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              slug={plan.slug}
              tagline={plan.tagline}
              startingPrice={formatPrice(plan.startingPrice)}
              contractType={mapContractTypeLabel(plan.contractType)}
              description={plan.description}
              benefits={plan.benefits.slice(0, 5)}
              ctaText="Ver detalhes"
              ctaLink={`/planos/${plan.slug}`}
              highlighted={plan.highlighted}
              whatsappNumber="5521999999999"
            />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <p className="text-center text-body text-warm-500 mt-8">
            Nenhum plano encontrado para esta categoria.
          </p>
        )}
      </section>

      {/* Plan Comparison Table */}
      <section className="w-full py-16 tablet:py-20 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Compare os planos
            </h2>
            <p className="mt-3 text-body text-warm-600 max-w-2xl mx-auto">
              Veja as diferenças entre os planos e escolha o que mais se encaixa nas suas necessidades.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-warm-200 shadow-soft bg-white">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-warm-200 bg-primary-50">
                  <th className="px-6 py-4 text-body font-semibold text-warm-700">
                    Característica
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-6 py-4 text-body font-bold text-primary-900 text-center"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {/* Price Range */}
                <tr className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-body font-medium text-warm-700">
                    Faixa de preço
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-body text-warm-600 text-center">
                      {plan.startingPrice !== null
                        ? `A partir de R$ ${plan.startingPrice.toFixed(2).replace('.', ',')}`
                        : 'Sob consulta'}
                    </td>
                  ))}
                </tr>

                {/* Contract Type */}
                <tr className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-body font-medium text-warm-700">
                    Tipo de contrato
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-body text-warm-600 text-center">
                      {mapContractTypeLabel(plan.contractType)}
                    </td>
                  ))}
                </tr>

                {/* Coverage */}
                <tr className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-body font-medium text-warm-700">
                    Cobertura
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-sm text-warm-600 text-center">
                      {plan.coverageDetails.slice(0, 3).join(', ')}
                    </td>
                  ))}
                </tr>

                {/* Telemedicine */}
                <tr className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-body font-medium text-warm-700">
                    Telemedicina
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-body text-center">
                      {plan.includesTelemedicine ? (
                        <span className="inline-flex items-center gap-1 text-primary-600 font-semibold">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Sim
                        </span>
                      ) : (
                        <span className="text-warm-400">Não</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Network Type */}
                <tr className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-body font-medium text-warm-700">
                    Rede
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-sm text-warm-600 text-center">
                      {plan.networkInfo}
                    </td>
                  ))}
                </tr>

                {/* Co-participation */}
                <tr className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-body font-medium text-warm-700">
                    Coparticipação
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-sm text-warm-600 text-center">
                      {plan.coParticipation}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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
