import { useState } from 'react'

interface TISSComponent {
  id: string
  title: string
  description: string
  documents: {
    name: string
    format: string
    url: string
  }[]
}

const tissComponents: TISSComponent[] = [
  {
    id: 'organizacional',
    title: 'Componente Organizacional',
    description:
      'Estabelece o conjunto de regras operacionais do Padrão TISS.',
    documents: [
      {
        name: 'Componente Organizacional - Maio/2026',
        format: 'PDF',
        url: '/docs/tiss/PadroTISS-ComponenteOrganizacional-202605.pdf',
      },
    ],
  },
  {
    id: 'conteudo-estrutura',
    title: 'Componente Conteúdo e Estrutura',
    description:
      'Estabelece a arquitetura dos dados utilizados nas mensagens eletrônicas e no plano de contingência, para coleta e disponibilidade dos dados de atenção à saúde.',
    documents: [
      {
        name: 'Conteúdo e Estrutura - Novembro/2025',
        format: 'XLSX',
        url: '/docs/tiss/Padrao-TISS-Componente-de-Conteudo-e-Estrutura-202511.xlsx',
      },
    ],
  },
  {
    id: 'representacao-conceitos',
    title: 'Componente Representação de Conceitos em Saúde',
    description:
      'Estabelece o conjunto de termos para identificar os eventos e itens assistenciais na saúde suplementar, consolidados na Terminologia Unificada da Saúde Suplementar - TUSS.',
    documents: [],
  },
  {
    id: 'seguranca-privacidade',
    title: 'Componente Segurança e Privacidade',
    description:
      'Estabelece os requisitos de proteção para assegurar o direito individual ao sigilo, à privacidade e à confidencialidade dos dados de atenção à saúde. Tem como base o sigilo profissional e segue a legislação.',
    documents: [
      {
        name: 'Segurança e Privacidade - Novembro/2025',
        format: 'PDF',
        url: '/docs/tiss/Padrao-TISS-seguranca-202511.pdf',
      },
    ],
  },
  {
    id: 'comunicacao',
    title: 'Componente Comunicação',
    description:
      'Estabelece os meios e os métodos de comunicação das mensagens eletrônicas definidas no componente de conteúdo e estrutura. Adota a linguagem de marcação de dados XML - Extensible Markup Language.',
    documents: [],
  },
]

function DNAIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
      <path d="M17 6l-2.5 2.5" />
      <path d="M14 8l-1 1" />
      <path d="M7 18l2.5-2.5" />
      <path d="M10 16l1-1" />
      <path d="M2 9c6.667 6 13.333 0 20 6" />
    </svg>
  )
}

export default function TISSManual() {
  const [activeCard, setActiveCard] = useState<string | null>(null)

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-gradient-brand py-16 tablet:py-20 px-4 tablet:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            Padrão TISS
          </h1>
          <p className="text-body-lg text-white/75 mt-4 max-w-3xl">
            O Padrão TISS (Troca de Informações na Saúde Suplementar) é obrigatório
            para o registro e intercâmbio de dados entre operadoras de planos de saúde
            e prestadores de serviços de saúde, estabelecido pela ANS.
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-warm-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
            {tissComponents.map((component) => (
              <div
                key={component.id}
                className={`relative rounded-2xl border border-warm-200 p-8 flex flex-col items-center text-center transition-all duration-300 cursor-pointer hover:shadow-card-hover hover:-translate-y-1 ${activeCard === component.id
                    ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white border-transparent shadow-xl'
                    : 'bg-white text-primary-900'
                  }`}
                onClick={() =>
                  setActiveCard(activeCard === component.id ? null : component.id)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveCard(activeCard === component.id ? null : component.id)
                  }
                }}
                aria-expanded={activeCard === component.id}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-5 ${activeCard === component.id
                      ? 'bg-white/20'
                      : 'bg-warm-100'
                    }`}
                >
                  <DNAIcon
                    className={`w-8 h-8 ${activeCard === component.id
                        ? 'text-white'
                        : 'text-primary-700'
                      }`}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-[17px] font-semibold leading-snug mb-3 ${activeCard === component.id ? 'text-white' : 'text-primary-900'
                    }`}
                >
                  {component.title}
                </h3>

                {/* Description - shown when expanded */}
                {activeCard === component.id && (
                  <p className="text-sm text-white/85 leading-relaxed mb-4">
                    {component.description}
                  </p>
                )}

                {/* Download buttons - shown when expanded */}
                {activeCard === component.id && component.documents.length > 0 && (
                  <div className="mt-auto pt-4 w-full space-y-2">
                    {component.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors no-underline"
                        aria-label={`Baixar ${doc.name} em formato ${doc.format}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Baixar {doc.format}
                      </a>
                    ))}
                  </div>
                )}

                {/* "No documents" message when expanded */}
                {activeCard === component.id && component.documents.length === 0 && (
                  <p className="mt-auto pt-4 text-xs text-white/60 italic">
                    Documento em breve disponível.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 bg-white rounded-2xl border border-warm-200 p-8 tablet:p-10">
            <h2 className="text-heading-md text-primary-900 mb-4">
              Sobre o Padrão TISS
            </h2>
            <p className="text-body text-warm-600 leading-relaxed">
              O TISS (Troca de Informações na Saúde Suplementar) é o padrão obrigatório
              estabelecido pela ANS (Agência Nacional de Saúde Suplementar) para o registro
              e intercâmbio de dados entre operadoras de planos de saúde e prestadores de
              serviços de saúde. Seu objetivo é padronizar as informações administrativas,
              garantindo maior transparência, agilidade e qualidade no atendimento aos
              beneficiários.
            </p>
            <p className="text-body text-warm-600 leading-relaxed mt-4">
              O Padrão TISS é composto por cinco componentes: Organizacional, Conteúdo e
              Estrutura, Representação de Conceitos em Saúde, Segurança e Privacidade, e
              Comunicação. Clique nos cards acima para ver mais detalhes e baixar os
              documentos disponíveis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
