import { useState, useCallback } from 'react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleItem = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          if (!allowMultiple) {
            next.clear()
          }
          next.add(id)
        }
        return next
      })
    },
    [allowMultiple]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleItem(id)
      }
    },
    [toggleItem]
  )

  return (
    <div className="w-full divide-y divide-warm-100 border border-warm-200 rounded-2xl overflow-hidden">
      {items.map((item) => {
        const isExpanded = expandedIds.has(item.id)
        const panelId = `accordion-panel-${item.id}`
        const headerId = `accordion-header-${item.id}`

        return (
          <div key={item.id} className="bg-white">
            <h3>
              <button
                id={headerId}
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className="flex w-full items-center justify-between min-h-touch px-6 py-4 text-left text-[17px] font-medium text-primary-900 hover:bg-warm-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset transition-colors"
              >
                <span>{item.title}</span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-warm-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isExpanded}
              className={`px-6 pb-5 text-body text-warm-600 ${isExpanded ? 'block' : 'hidden'
                }`}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
