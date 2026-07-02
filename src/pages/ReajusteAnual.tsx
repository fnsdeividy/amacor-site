import { useState } from 'react'
import reajusteData from '../data/reajustes.json'
import { poolContratos } from '../data/poolContratos'

export default function ReajusteAnual() {
  const [expandedYear, setExpandedYear] = useState<number | null>(null)

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year)
  }
  return (
    <div className="w-full min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-700/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-3xl" />
        </div>

        <div className="relative py-16 tablet:py-20 px-4 tablet:px-8">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li><a href="/" className="hover:text-white/80 transition-colors">Início</a></li>
                <li aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-white/80 font-medium">Reajuste Anual</li>
              </ol>
            </nav>

            <h1 className="font-display text-heading-lg tablet:text-heading-xl text-white tracking-tight">
              {reajusteData.title}
            </h1>
            <p className="mt-4 text-body-lg text-white/70 leading-relaxed max-w-3xl">
              {reajusteData.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-12 tablet:py-16 px-4 tablet:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Entendendo o Reajuste */}
          <div className="mb-12">
            <h2 className="text-heading-md text-primary-900 mb-4">
              {reajusteData.explanation.title}
            </h2>
            <p className="text-body text-warm-700 leading-relaxed mb-4">
              {reajusteData.explanation.content}
            </p>
            <p className="text-body text-warm-700 leading-relaxed">
              {reajusteData.explanation.calculation}
            </p>
          </div>

          {/* Rates */}
          <div className="mb-12 bg-white rounded-2xl border border-warm-200 shadow-soft p-6 tablet:p-8">
            <h3 className="text-heading-sm text-primary-900 mb-6">Índices de Reajuste por Ano</h3>
            <ul className="space-y-3">
              {reajusteData.rates.map((rate) => (
                <li
                  key={rate.year}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-warm-50 border border-warm-100"
                >
                  <span className="text-body font-semibold text-primary-800">
                    Ano Base {rate.year}:
                  </span>
                  <span className="text-body font-bold text-primary-600">
                    {rate.rate}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pool Tables */}
          <div className="mb-12">
            <h3 className="text-heading-sm text-primary-900 mb-3">
              Contratos Alcançados pelo Reajuste
            </h3>
            <p className="text-body text-warm-600 mb-6">
              Para consultar os contratos alcançados neste reajuste, clique no ano correspondente abaixo:
            </p>
            <div className="flex flex-col gap-3">
              {poolContratos.map((pool) => (
                <div key={pool.year} className="rounded-2xl border border-warm-200 bg-white shadow-soft overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleYear(pool.year)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-warm-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-inset"
                    aria-expanded={expandedYear === pool.year}
                  >
                    <span className="text-body font-bold text-primary-600">
                      {pool.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-warm-500">
                        {pool.contratos.length} contratos
                      </span>
                      <svg
                        className={`w-5 h-5 text-warm-400 transition-transform duration-200 ${expandedYear === pool.year ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {expandedYear === pool.year && (
                    <div className="border-t border-warm-200 overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-warm-50">
                          <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-warm-600 uppercase tracking-wide">Produto</th>
                            <th className="px-6 py-3 text-xs font-semibold text-warm-600 uppercase tracking-wide">Proposta</th>
                            <th className="px-6 py-3 text-xs font-semibold text-warm-600 uppercase tracking-wide">Código ANS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-100">
                          {pool.contratos.map((contrato, idx) => (
                            <tr key={idx} className="hover:bg-warm-50/50">
                              <td className="px-6 py-3 text-sm text-warm-700">{contrato.produto}</td>
                              <td className="px-6 py-3 text-sm text-warm-700 font-mono">{contrato.proposta}</td>
                              <td className="px-6 py-3 text-sm text-warm-700 font-mono">{contrato.codigoAns}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Factors */}
          <div className="mb-12">
            <h2 className="text-heading-md text-primary-900 mb-4">
              {reajusteData.factors.title}
            </h2>
            <p className="text-body text-warm-700 mb-4">
              {reajusteData.factors.description}
            </p>
            <ul className="space-y-4">
              {reajusteData.factors.items.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <svg className="mt-1 flex-shrink-0 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" strokeWidth={2} />
                  </svg>
                  <div>
                    <span className="font-semibold text-primary-800">{item.title}:</span>{' '}
                    <span className="text-warm-700">{item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="mb-12 bg-white rounded-2xl border border-warm-200 shadow-soft p-6 tablet:p-8">
            <h2 className="text-heading-md text-primary-900 mb-3">
              {reajusteData.contact.title}
            </h2>
            <p className="text-body text-warm-700 mb-4">
              {reajusteData.contact.description}
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-body text-warm-700">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span><strong>Email:</strong> {reajusteData.contact.email}</span>
              </li>
              <li className="flex items-center gap-2 text-body text-warm-700">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span><strong>Telefone:</strong> {reajusteData.contact.phone}</span>
              </li>
            </ul>
          </div>

          {/* Commitment */}
          <div className="mb-12">
            <h2 className="text-heading-md text-primary-900 mb-4">
              {reajusteData.commitment.title}
            </h2>
            <p className="text-body text-warm-700 leading-relaxed">
              {reajusteData.commitment.content}
            </p>
          </div>

          {/* Footer signature */}
          <p className="text-body font-semibold text-primary-800">
            Amacor Planos de Saúde
          </p>
        </div>
      </section>
    </div>
  )
}
