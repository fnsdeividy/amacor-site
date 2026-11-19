import { Fragment, type ReactNode } from 'react'
import policy from '../data/privacyPolicy.json'

/**
 * Texto integral da Política de Privacidade aprovada pelo jurídico (gerado a partir do .docx
 * em src/data/privacyPolicy.json). NÃO alterar a redação — apenas formatação.
 *
 * O documento recebido contém campos entre colchetes (ex.: "[DATA]") a serem preenchidos.
 * Preencha os valores aqui, usando o texto exato entre colchetes como chave. Campos sem valor
 * continuam aparecendo entre colchetes, destacados, para não serem publicados por engano.
 */
const PLACEHOLDER_VALUES: Record<string, string> = {
  // Preenchidos com os dados já publicados no site (rodapé e página de contato):
  'CONFIRMAR NOME FANTASIA': 'Amacor Planos de Saúde',
  'NÚMERO DO REGISTRO NA ANS': '41201-5',
  'SITE': 'www.amacor.com.br',
  'E-MAIL INSTITUCIONAL': 'comercial@mhvida.com.br',
  'TELEFONE': '(21) 3405-9466',
  'TELEFONE DA CENTRAL DE ATENDIMENTO': '(21) 3405-9466',
  'HORÁRIO DE ATENDIMENTO': 'segunda a sexta, das 7h às 18h; sábado, das 7h às 12h',
  'TELEFONE E/OU E-MAIL DA OUVIDORIA': 'ouvidoria@mhvida.com.br',

  'DATA': '19/11/2026',
  'NÚMERO DA VERSÃO': '1.0',
  'DATA DE VIGÊNCIA': '19/11/2026',
  'E-MAIL DO RESPONSÁVEL': 'fabio.freitas@amacor.com.br',
  'NOME DO ENCARREGADO OU DA EMPRESA RESPONSÁVEL': 'Fabio Freitas',
  'NOME DO RESPONSÁVEL': 'Fabio Freitas',
  'LINK DO FORMULÁRIO, SE HOUVER': 'www.amacor.com.br/contato',
}

type Block =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

const blocks = policy.blocks as Block[]

/** Renderiza **negrito** e substitui/destaca [CAMPOS]. */
function renderInline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-primary-900">
          {renderPlaceholders(part.slice(2, -2))}
        </strong>
      )
    }
    return <Fragment key={i}>{renderPlaceholders(part)}</Fragment>
  })
}

function renderPlaceholders(text: string): ReactNode {
  return text.split(/(\[[^\]]+\])/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]$/)
    if (!match) return <Fragment key={i}>{part}</Fragment>
    const value = PLACEHOLDER_VALUES[match[1]]
    if (value !== undefined) return <Fragment key={i}>{value}</Fragment>
    return (
      <mark key={i} className="bg-amber-100 text-amber-900 rounded px-1">
        {part}
      </mark>
    )
  })
}

function headingId(text: string) {
  const n = text.match(/^(\d+)\./)
  return n ? `secao-${n[1]}` : undefined
}

function renderMultiline(text: string) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {renderInline(line)}
    </Fragment>
  ))
}

function PolicyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          id={headingId(block.text)}
          className="scroll-mt-28 pt-6 font-display text-heading-sm text-primary-900 tracking-tight"
        >
          {block.text}
        </h2>
      )
    case 'paragraph':
      return <p>{renderInline(block.text)}</p>
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag
          className={`pl-6 space-y-2 ${block.ordered ? 'list-[lower-alpha]' : 'list-disc'} marker:text-primary-500`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ListTag>
      )
    }
    case 'table':
      return (
        <div className="overflow-x-auto rounded-xl border border-warm-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary-50 text-primary-900">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-semibold align-top">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200">
              {block.rows.map((row, r) => (
                <tr key={r} className="align-top">
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className={`px-4 py-3 ${c === 0 ? 'font-medium text-primary-900 min-w-[10rem]' : ''}`}
                    >
                      {renderMultiline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export default function PrivacyPolicy() {
  const sections = blocks.filter((b): b is Extract<Block, { type: 'heading' }> => b.type === 'heading')

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
                <li><a href="/" className="hover:text-white/80 transition-colors">Inicio</a></li>
                <li aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-white/80 font-medium">Política de Privacidade</li>
              </ol>
            </nav>

            <h1 className="font-display text-heading-lg tablet:text-heading-xl text-white tracking-tight">
              {policy.title}
            </h1>
            <p className="mt-4 text-body-lg text-white/80 leading-relaxed max-w-3xl">
              {renderInline(policy.meta)}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-12 tablet:py-16 px-4 tablet:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-elevated border border-warm-100 p-6 tablet:p-12">
            <nav aria-label="Seções da política" className="mb-8 rounded-xl bg-background-light p-5">
              <p className="mb-3 text-sm font-semibold text-primary-900">Nesta página</p>
              <ol className="grid gap-1.5 text-sm tablet:grid-cols-2">
                {sections.map((s) => (
                  <li key={s.text}>
                    <a href={`#${headingId(s.text)}`} className="text-primary-600 hover:underline">
                      {s.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-5 text-warm-700 text-body leading-relaxed">
              {blocks.map((block, i) => (
                <PolicyBlock key={i} block={block} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
