import { useState } from 'react'
import idssData from '../data/idssData.json'

const AVAILABLE_YEARS = idssData.map((d) => d.year).sort((a, b) => b - a)

interface IDSSYear {
  year: number
  anoBase: number
  registroAns: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  situacao: string
  totalConsumidores: number
  tipo: string
  modalidade: string
  indicators: {
    IDSS: number
    IDQS: number
    IDGA: number
    IDSM: number
    IDGR: number
  }
}

function formatValue(value: number): string {
  return value.toFixed(4).replace('.', ',')
}

function getScoreColor(value: number): string {
  if (value >= 0.7) return 'text-green-700'
  if (value >= 0.4) return 'text-yellow-700'
  return 'text-red-700'
}

function ScoreBar({ value }: { value: number }) {
  const percentage = Math.min(value * 100, 100)
  let barColor = 'bg-red-500'
  if (value >= 0.7) barColor = 'bg-green-500'
  else if (value >= 0.4) barColor = 'bg-yellow-500'

  return (
    <div className="w-full h-2.5 bg-warm-200 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

const INDICATOR_INFO: Record<string, { label: string; fullName: string }> = {
  IDSS: { label: 'IDSS DA OPERADORA', fullName: 'Índice de Desempenho da Saúde Suplementar' },
  IDQS: { label: '1 - IDQS', fullName: 'Qualidade em Atenção à Saúde' },
  IDGA: { label: '2 - IDGA', fullName: 'Garantia de Acesso' },
  IDSM: { label: '3 - IDSM', fullName: 'Sustentabilidade no Mercado' },
  IDGR: { label: '4 - IDGR', fullName: 'Gestão de Processos e Regulação' },
}

export default function IDSS() {
  const [selectedYear, setSelectedYear] = useState<number>(AVAILABLE_YEARS[0])

  const yearData = idssData.find((d) => d.year === selectedYear) as IDSSYear | undefined

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-white py-10 tablet:py-14 px-4 tablet:px-8 border-b border-warm-200">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-heading-lg tablet:text-heading-xl">
            <span className="text-accent-500 font-extrabold">IDSS {selectedYear}</span>
            <span className="text-warm-700 font-normal"> – Índice de desenvolvimento da saúde suplementar</span>
          </h1>
        </div>
      </section>

      {/* Year Selector */}
      <section className="py-6 px-4 tablet:px-8 bg-warm-50 border-b border-warm-200">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Selecionar ano do IDSS">
            {AVAILABLE_YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                aria-pressed={selectedYear === year}
                className={`min-w-[80px] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 ${selectedYear === year
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-white text-warm-600 border border-warm-300 hover:bg-warm-100'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {yearData && (
        <>
          {/* Operator info + description */}
          <section className="py-10 tablet:py-12 px-4 tablet:px-8 bg-white">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-heading-sm tablet:text-heading-md text-warm-800 mb-6">
                Ano base {yearData.anoBase}
              </h2>

              <div className="flex flex-col desktop:flex-row gap-8">
                {/* Description text */}
                <div className="flex-1">
                  <p className="text-sm text-warm-600 leading-relaxed mb-4">
                    O Índice de Desempenho em Saúde Suplementar (IDSS) é um indicador utilizado para medir a qualidade dos planos de saúde no Brasil. Ele é calculado com base em diversos critérios, como a satisfação dos clientes, a qualidade dos serviços médicos e a eficiência na gestão dos recursos, é constituído por indicadores que compõem uma nota de <strong className="text-warm-800">0 (pior) a 1 (melhor)</strong>.
                  </p>
                  <p className="text-sm text-warm-600 leading-relaxed">
                    Abaixo você pode conferir o resultado do plano de saúde Amacor Saúde, levando em consideração o exercício do ano {yearData.anoBase}.
                  </p>
                </div>

                {/* Operator data table */}
                <div className="flex-1">
                  <div className="overflow-hidden rounded-lg border border-warm-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary-700">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-white uppercase">Campo</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-white uppercase">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-100 bg-white">
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Nome Fantasia</td><td className="px-4 py-2 text-warm-800">{yearData.nomeFantasia}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Registro ANS</td><td className="px-4 py-2 text-warm-800">{yearData.registroAns}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">CNPJ</td><td className="px-4 py-2 text-warm-800">{yearData.cnpj}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Razão Social</td><td className="px-4 py-2 text-warm-800">{yearData.razaoSocial}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Situação do Registro ANS</td><td className="px-4 py-2 text-warm-800">{yearData.situacao}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Total de Consumidores</td><td className="px-4 py-2 text-warm-800">{yearData.totalConsumidores.toLocaleString('pt-BR')}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Tipo</td><td className="px-4 py-2 text-warm-800">{yearData.tipo}</td></tr>
                        <tr><td className="px-4 py-2 text-warm-600 font-medium">Modalidade</td><td className="px-4 py-2 text-warm-800">{yearData.modalidade}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Indicator Cards */}
          <section className="py-10 tablet:py-12 px-4 tablet:px-8 bg-warm-50">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 tablet:grid-cols-3 gap-5">
                {Object.entries(yearData.indicators).map(([key, value]) => {
                  const info = INDICATOR_INFO[key]
                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl border border-warm-200 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      {/* Card header */}
                      <div className="bg-accent-500 px-4 py-3 text-center">
                        <p className="text-xs font-bold text-white uppercase tracking-wide">
                          {info.label} {key === 'IDSS' ? `${yearData.year}` : ''}
                        </p>
                        <p className="text-[11px] text-white/80 uppercase mt-0.5">
                          {key === 'IDSS' ? `(ANO-BASE ${yearData.anoBase})` : info.fullName}
                        </p>
                      </div>
                      {/* Card body */}
                      <div className="px-4 py-6 text-center">
                        <p className={`text-3xl font-bold font-mono ${getScoreColor(value)}`}>
                          {formatValue(value)}
                        </p>
                        <ScoreBar value={value} />
                        <div className="flex justify-between mt-1.5 text-[10px] text-warm-400">
                          <span>0</span>
                          <span>1</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="py-8 px-4 tablet:px-8 bg-white border-t border-warm-200">
            <div className="mx-auto max-w-5xl flex flex-col tablet:flex-row gap-6 text-sm text-warm-600">
              <p>
                Para este resultado detalhado do IDSS {yearData.year} (Ano-base {yearData.anoBase}) da operadora Amacor Saúde acesse o link:{' '}
                <a
                  href="https://www.gov.br/ans/pt-br/assuntos/informacoes-e-avaliacoes-de-operadoras/idss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 font-medium hover:underline"
                >
                  ANS - IDSS
                </a>
              </p>
              <p>
                Para maiores informações sobre o programa de qualificação da ANS acesse o link:{' '}
                <a
                  href="https://www.gov.br/ans/pt-br/assuntos/informacoes-e-avaliacoes-de-operadoras"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 font-medium hover:underline"
                >
                  Programa de Qualificação
                </a>
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
