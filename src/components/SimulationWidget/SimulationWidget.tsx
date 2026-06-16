import { useSimulation } from '../../hooks/useSimulation'
import { buildWhatsAppUrl, buildWhatsAppMessage } from '../../utils/whatsapp'
import type { AgeRange, SimulationResult } from '../../types'

const AGE_RANGES: AgeRange[] = [
  '0-18',
  '19-23',
  '24-28',
  '29-33',
  '34-38',
  '39-43',
  '44-48',
  '49-53',
  '54-58',
  '59+',
]

const MAX_DEPENDENTS = 5

const WHATSAPP_PHONE = '5521999999999'

export interface SimulationWidgetProps {
  onSimulationComplete?: (result: SimulationResult) => void
  className?: string
}

export function SimulationWidget({
  onSimulationComplete,
  className = '',
}: SimulationWidgetProps) {
  const {
    ageRange,
    dependents,
    setAgeRange,
    setDependents,
    results,
    reset,
  } = useSimulation()

  const handleAgeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as AgeRange
    if (value) {
      setAgeRange(value)
    }
  }

  const handleIncrement = () => {
    if (dependents < MAX_DEPENDENTS) {
      setDependents(dependents + 1)
    }
  }

  const handleDecrement = () => {
    if (dependents > 0) {
      setDependents(dependents - 1)
    }
  }

  // Notify parent when results are available
  if (results && ageRange && onSimulationComplete) {
    onSimulationComplete({
      ageRange,
      dependents,
      plans: results,
    })
  }

  return (
    <section
      className={`rounded-2xl shadow-soft bg-white p-6 tablet:p-10 ${className}`}
      aria-labelledby="simulation-heading"
    >
      <h2
        id="simulation-heading"
        className="text-heading-md text-primary-900 mb-6"
      >
        Simule seu plano
      </h2>

      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-end">
        {/* Age Range Select */}
        <div className="flex-1">
          <label
            htmlFor="simulation-age-range"
            className="block text-body font-semibold text-warm-700 mb-2"
          >
            Faixa etária
          </label>
          <select
            id="simulation-age-range"
            value={ageRange ?? ''}
            onChange={handleAgeRangeChange}
            className="w-full min-h-touch rounded-xl border border-warm-300 bg-white px-4 py-3 text-body text-warm-800 focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500 transition-colors"
            aria-label="Selecione sua faixa etária"
          >
            <option value="" disabled>
              Selecione a faixa etária
            </option>
            {AGE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range === '59+' ? '59 anos ou mais' : `${range} anos`}
              </option>
            ))}
          </select>
        </div>

        {/* Dependents Counter */}
        <div className="flex-1">
          <label
            htmlFor="simulation-dependents"
            className="block text-body font-semibold text-warm-700 mb-2"
          >
            Dependentes
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={dependents <= 0}
              className="min-h-touch min-w-touch flex items-center justify-center rounded-xl border border-warm-300 bg-white text-primary-600 text-heading-sm font-bold hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Diminuir número de dependentes"
            >
              −
            </button>
            <span
              id="simulation-dependents"
              className="min-w-[48px] text-center text-heading-sm text-warm-800"
              role="status"
              aria-live="polite"
              aria-label={`${dependents} dependente${dependents !== 1 ? 's' : ''}`}
            >
              {dependents}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={dependents >= MAX_DEPENDENTS}
              className="min-h-touch min-w-touch flex items-center justify-center rounded-xl border border-warm-300 bg-white text-primary-600 text-heading-sm font-bold hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Aumentar número de dependentes"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8">
          <h3 className="text-body font-semibold text-warm-700 mb-4">
            Valores estimados mensais
          </h3>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {results.map((plan) => (
              <div
                key={plan.planId}
                className="rounded-2xl border border-warm-200 shadow-soft p-5 bg-background-light"
              >
                <p className="text-body font-semibold text-primary-900">
                  {plan.planName}
                </p>
                <p className="mt-1 text-heading-sm text-primary-600">
                  {plan.priceFormatted}
                  <span className="text-body text-warm-500 font-normal">
                    /mês
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA after results */}
          <div className="mt-6 flex flex-col gap-3">
            {results.map((plan) => {
              const message = buildWhatsAppMessage({
                pageContext: 'simulation',
                planName: plan.planName,
                simulationData: {
                  ageRange: ageRange!,
                  dependents,
                  estimatedPrice: plan.priceFormatted,
                },
              })
              const url = buildWhatsAppUrl(WHATSAPP_PHONE, message)

              return (
                <a
                  key={plan.planId}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-touch w-full rounded-xl bg-whatsapp text-white font-bold text-body hover:bg-whatsapp-dark focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors"
                  aria-label={`Contratar ${plan.planName} pelo WhatsApp`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contratar {plan.planName} pelo WhatsApp
                </a>
              )
            })}
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={reset}
            className="mt-4 min-h-touch px-6 py-3 rounded-xl border border-warm-300 text-body text-warm-600 font-medium hover:bg-warm-50 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-colors"
            aria-label="Refazer simulação"
          >
            Refazer simulação
          </button>
        </div>
      )}
    </section>
  )
}

export default SimulationWidget
