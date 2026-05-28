import { useState } from 'react'
import idssData from '../data/idssData.json'
import { formatIDSSValue } from '../utils/formatters'

const AVAILABLE_YEARS = [2020, 2023, 2025] as const

const INDICATOR_LABELS: Record<string, string> = {
  IDSS: 'IDSS - Indice de Desempenho da Saude Suplementar',
  IDQS: 'IDQS - Indice de Desempenho da Qualidade em Saude',
  IDGA: 'IDGA - Indice de Desempenho da Garantia de Acesso',
  IDSM: 'IDSM - Indice de Desempenho da Sustentabilidade no Mercado',
  IDGR: 'IDGR - Indice de Desempenho da Gestao de Recursos',
}

export default function IDSS() {
  const [selectedYear, setSelectedYear] = useState<number>(2025)

  const yearData = idssData.find((d) => d.year === selectedYear)

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-primary-900 py-16 tablet:py-20 px-4 tablet:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            Desempenho IDSS
          </h1>
          <p className="mt-4 text-body-lg text-white/75 max-w-3xl mx-auto">
            Acompanhe os indicadores de desempenho da Amacor Planos de Saude
            avaliados pela ANS.
          </p>
        </div>
      </section>

      {/* Year Selector */}
      <section className="py-10 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Selecionar ano">
            {AVAILABLE_YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                aria-pressed={selectedYear === year}
                className={`min-w-[90px] min-h-touch px-6 py-3 rounded-xl text-body font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300 ${selectedYear === year
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-warm-100 text-warm-700 hover:bg-warm-200'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Indicators Display */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 mb-10 text-center">
            Indicadores - {selectedYear}
          </h2>

          {yearData ? (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
              {Object.entries(yearData.indicators).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white rounded-2xl border border-warm-200 p-8 flex flex-col items-center text-center hover:shadow-card-hover transition-all duration-300"
                >
                  <span className="text-heading-sm text-primary-600 font-bold">
                    {key}
                  </span>
                  <span className="mt-2 text-sm text-warm-500 leading-snug">
                    {INDICATOR_LABELS[key]}
                  </span>
                  <span className="mt-5 text-heading-lg text-primary-900 font-mono font-bold">
                    {formatIDSSValue(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-warm-200">
              <p className="text-body text-warm-600">
                Dados nao disponiveis para o ano selecionado.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
