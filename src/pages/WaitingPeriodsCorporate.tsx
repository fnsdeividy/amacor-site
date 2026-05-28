import { useState, useMemo } from 'react'
import { Accordion } from '../components/Accordion/Accordion'
import { filterBySubstring } from '../utils/filters'
import { formatWaitingPeriod } from '../utils/formatters'
import waitingPeriodsCorporate from '../data/waitingPeriodsCorporate.json'
import type { WaitingPeriod } from '../types/waitingPeriod'

const data: WaitingPeriod[] = waitingPeriodsCorporate

export default function WaitingPeriodsCorporate() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPeriods = useMemo(
    () => filterBySubstring(data, searchQuery, (item) => item.procedure),
    [searchQuery]
  )

  const accordionItems = useMemo(
    () =>
      filteredPeriods.map((period) => ({
        id: period.id,
        title: period.procedure,
        content: (
          <p className="text-body text-warm-600">
            <span className="font-semibold text-primary-900">Carencia:</span>{' '}
            {formatWaitingPeriod(period.durationDays)}
          </p>
        ),
      })),
    [filteredPeriods]
  )

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-primary-900 py-16 tablet:py-20 px-4 tablet:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            Carencia Empresarial
          </h1>
          <p className="text-body-lg text-white/75 mt-4 max-w-2xl">
            Consulte os prazos de carencia para procedimentos do plano empresarial.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <label htmlFor="search-procedures" className="block text-[15px] font-semibold text-primary-900 mb-2">
              Pesquisar procedimento
            </label>
            <input
              id="search-procedures"
              type="text"
              placeholder="Pesquisar procedimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-touch rounded-xl border-2 border-warm-200 px-5 py-4 text-body text-primary-900 placeholder-warm-400 hover:border-warm-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors bg-white"
            />
          </div>

          <h2 className="sr-only">Lista de procedimentos e carencias</h2>

          {accordionItems.length > 0 ? (
            <Accordion items={accordionItems} />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-warm-200">
              <p className="text-body text-warm-600">
                Nenhum procedimento encontrado para o termo pesquisado.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
