import { useState } from 'react'

const TISS_ANS_URL = 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-2013-maio-2026'

interface TISSComponent {
  id: string
  title: string
  description: string
}

const tissComponents: TISSComponent[] = [
  {
    id: 'organizacional',
    title: 'Componente Organizacional',
    description:
      'Estabelece o conjunto de regras operacionais do Padrão TISS.',
  },
  {
    id: 'conteudo-estrutura',
    title: 'Componente Conteúdo e Estrutura',
    description:
      'Estabelece a arquitetura dos dados utilizados nas mensagens eletrônicas e no plano de contingência, para coleta e disponibilidade dos dados de atenção à saúde.',
  },
  {
    id: 'representacao-conceitos',
    title: 'Componente Representação de Conceitos em Saúde',
    description:
      'Estabelece o conjunto de termos para identificar os eventos e itens assistenciais na saúde suplementar, consolidados na Terminologia Unificada da Saúde Suplementar - TUSS.',
  },
  {
    id: 'seguranca-privacidade',
    title: 'Componente Segurança e Privacidade',
    description:
      'Estabelece os requisitos de proteção para assegurar o direito individual ao sigilo, à privacidade e à confidencialidade dos dados de atenção à saúde. Tem como base o sigilo profissional e segue a legislação.',
  },
  {
    id: 'comunicacao',
    title: 'Componente Comunicação',
    description:
      'Estabelece os meios e os métodos de comunicação das mensagens eletrônicas definidas no componente de conteúdo e estrutura. Adota a linguagem de marcação de dados XML - Extensible Markup Language.',
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

                {/* Link to ANS - shown when expanded */}
                {activeCard === component.id && (
                  <div className="mt-auto pt-4 w-full">
                    <a
                      href={TISS_ANS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors no-underline"
                      aria-label={`Acessar ${component.title} no site da ANS`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                      Acessar na ANS
                    </a>
                  </div>
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
              Comunicação. Clique nos cards acima para ver mais detalhes e acessar os
              documentos disponíveis no site da ANS.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
