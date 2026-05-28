import { useState } from 'react'

interface TISSDocument {
  id: string
  name: string
  format: string
  url: string
}

const documents: TISSDocument[] = [
  {
    id: 'tiss-4-0',
    name: 'Manual TISS 4.0',
    format: 'PDF',
    url: '/documents/manual-tiss-4.0.pdf',
  },
  {
    id: 'tiss-componente-organizacional',
    name: 'Componente Organizacional TISS',
    format: 'PDF',
    url: '/documents/componente-organizacional-tiss.pdf',
  },
  {
    id: 'tiss-tabela-erros',
    name: 'Tabela de Erros TISS',
    format: 'XLSX',
    url: '/documents/tabela-erros-tiss.xlsx',
  },
]

export default function TISSManual() {
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const handleDownload = async (doc: TISSDocument) => {
    setDownloadError(null)

    try {
      const response = await fetch(doc.url, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error('File unavailable')
      }
    } catch {
      setDownloadError(doc.id)
    }
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-primary-900 py-16 tablet:py-20 px-4 tablet:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">Manual TISS</h1>
          <p className="text-body-lg text-white/75 mt-4 max-w-2xl">
            Documentos e manuais do padrao TISS para prestadores de servicos de saude.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-warm-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-warm-200 p-8 tablet:p-10 mb-10">
            <p className="text-body text-warm-600 leading-relaxed">
              O TISS (Troca de Informacoes na Saude Suplementar) e o padrao obrigatorio
              estabelecido pela ANS (Agencia Nacional de Saude Suplementar) para o registro
              e intercambio de dados entre operadoras de planos de saude e prestadores de
              servicos de saude. Seu objetivo e padronizar as informacoes administrativas,
              garantindo maior transparencia, agilidade e qualidade no atendimento aos
              beneficiarios.
            </p>
          </div>

          <h2 className="text-heading-md text-primary-900 mb-6">Documentos para Download</h2>

          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc.id} className="bg-white rounded-2xl border border-warm-200 p-6 tablet:p-8 flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4 hover:shadow-card-hover transition-all duration-300">
                <div>
                  <span className="text-[17px] font-semibold text-primary-900">
                    {doc.name}
                  </span>
                  <span className="ml-2 text-sm text-warm-500 uppercase font-medium">
                    - {doc.format}
                  </span>
                </div>

                <div className="flex flex-col items-start tablet:items-end gap-2">
                  <a
                    href={doc.url}
                    download
                    onClick={() => handleDownload(doc)}
                    className="btn-primary inline-flex items-center gap-2 text-sm no-underline"
                    aria-label={`Baixar ${doc.name} em formato ${doc.format}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                    Baixar
                  </a>

                  {downloadError === doc.id && (
                    <p className="text-error text-sm" role="alert">
                      Arquivo indisponivel. Tente novamente mais tarde.
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
