import type { SimulationResult } from '../../types'

const SIMULATOR_URL = 'https://amacorsaude.com.br/simulador/'

export interface SimulationWidgetProps {
  onSimulationComplete?: (result: SimulationResult) => void
  className?: string
}

export function SimulationWidget({
  className = '',
}: SimulationWidgetProps) {
  return (
    <section
      className={`rounded-2xl shadow-soft bg-white p-6 tablet:p-10 ${className}`}
      aria-labelledby="simulation-heading"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-5">
          <svg
            className="w-8 h-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2
          id="simulation-heading"
          className="text-heading-md text-primary-900 mb-3"
        >
          Simule seu plano
        </h2>

        <p className="text-body text-warm-600 max-w-lg mb-8">
          Descubra o valor ideal para você e sua família. Simule agora mesmo e
          encontre o plano perfeito para suas necessidades.
        </p>

        <a
          href={SIMULATOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-touch px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-body shadow-sm hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          Simular meu plano
        </a>

        <p className="mt-4 text-sm text-warm-500">
          Você será redirecionado para nosso simulador oficial.
        </p>
      </div>
    </section>
  )
}

export default SimulationWidget
