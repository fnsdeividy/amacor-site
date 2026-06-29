import { Link } from 'react-router-dom'
import institutionalData from '../data/institutional.json'
import WhatsAppCTA from '../components/WhatsAppCTA'
import type { InstitutionalData } from '../types/simulation'

const data = institutionalData as InstitutionalData

export default function Institutional() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[340px] tablet:min-h-[420px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-overlay" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 tablet:px-8 py-20 tablet:py-28">
          <span className="inline-block text-sm font-semibold text-accent-300 uppercase tracking-wider mb-4">
            Quem somos
          </span>
          <h1 className="text-heading-lg tablet:text-heading-xl text-white leading-tight max-w-3xl">
            Mais de 30 anos cuidando da saúde da Zona Oeste
          </h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-2xl">
            Conheça a história, os valores e os compromissos que fazem da Amacor uma referência em saúde acessível.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-gradient-to-b from-warm-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Nossa história
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              {data.history.title}
            </h2>
          </div>
          <p className="text-body text-warm-600 leading-relaxed max-w-4xl mx-auto text-center mb-16">
            {data.history.content}
          </p>

          {/* Milestones Timeline */}
          <div className="relative">
            <div className="absolute left-4 tablet:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 -translate-x-1/2" aria-hidden="true" />
            <ol className="space-y-10" aria-label="Marcos históricos da Amacor">
              {data.history.milestones.map((milestone, index) => (
                <li
                  key={milestone.year}
                  className={`relative flex flex-col tablet:flex-row items-start tablet:items-center gap-4 ${index % 2 === 0 ? 'tablet:flex-row' : 'tablet:flex-row-reverse'
                    }`}
                >
                  {/* Year badge */}
                  <div className="tablet:w-1/2 flex tablet:justify-end tablet:pr-8">
                    {index % 2 === 0 ? (
                      <div className="tablet:text-right">
                        <span className="inline-block bg-primary-600 text-white font-bold text-body px-4 py-2 rounded-lg">
                          {milestone.year}
                        </span>
                        <p className="mt-3 text-body text-warm-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    ) : (
                      <span className="sr-only">{milestone.year}</span>
                    )}
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 tablet:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-sm" aria-hidden="true" />

                  {/* Content (alternate side) */}
                  <div className="tablet:w-1/2 pl-10 tablet:pl-8">
                    {index % 2 !== 0 ? (
                      <div>
                        <span className="inline-block bg-primary-600 text-white font-bold text-body px-4 py-2 rounded-lg">
                          {milestone.year}
                        </span>
                        <p className="mt-3 text-body text-warm-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    ) : (
                      <span className="sr-only">{milestone.description}</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values Section */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-primary-900 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-accent-300 uppercase tracking-wider mb-3">
              Nosso propósito
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-white">
              Missão, Visão e Valores
            </h2>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 mb-14">
            <div className="rounded-2xl shadow-elevated bg-white/10 backdrop-blur-sm border border-white/20 p-8">
              <h3 className="text-heading-md text-accent-300 mb-4">Missão</h3>
              <p className="text-body text-white/80 leading-relaxed">
                {data.mission}
              </p>
            </div>
            <div className="rounded-2xl shadow-elevated bg-white/10 backdrop-blur-sm border border-white/20 p-8">
              <h3 className="text-heading-md text-accent-300 mb-4">Visão</h3>
              <p className="text-body text-white/80 leading-relaxed">
                {data.vision}
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
            {data.values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 flex flex-col items-center text-center hover:bg-white/15 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent-400/20 flex items-center justify-center mb-4" aria-hidden="true">
                  <ValueIcon name={value.icon} light />
                </div>
                <h4 className="text-heading-md text-white mb-2">
                  {value.title}
                </h4>
                <p className="text-body text-white/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANS Registration Section */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-gradient-to-br from-warm-50 via-white to-primary-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Regulamentação
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Registro ANS
            </h2>
          </div>
          <div className="rounded-2xl shadow-elevated bg-white border border-warm-200 p-8 tablet:p-10 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-600" />
            <dl className="space-y-4">
              <div className="flex flex-col tablet:flex-row tablet:items-center gap-2">
                <dt className="text-body font-semibold text-primary-800 tablet:w-48">
                  Número de registro:
                </dt>
                <dd className="text-body text-warm-700">
                  {data.ans.registryNumber}
                </dd>
              </div>
              <div className="flex flex-col tablet:flex-row tablet:items-center gap-2">
                <dt className="text-body font-semibold text-primary-800 tablet:w-48">
                  Status:
                </dt>
                <dd className="text-body text-warm-700">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-whatsapp" aria-hidden="true" />
                    {data.ans.status}
                  </span>
                </dd>
              </div>
            </dl>
            <a
              href={data.ans.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-body font-semibold text-primary-600 hover:text-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 rounded"
            >
              Verificar no site da ANS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* IDSS Link Section */}
      <section className="w-full py-16 tablet:py-20 px-4 tablet:px-8 bg-primary-50 border-y border-primary-100">
        <div className="mx-auto max-w-7xl flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-6">
          <div>
            <h2 className="text-heading-md text-primary-900 mb-2">
              Índice de Desempenho (IDSS)
            </h2>
            <p className="text-body text-warm-600">
              Consulte os indicadores de desempenho da Amacor avaliados pela ANS.
            </p>
          </div>
          <Link
            to={data.idssLink}
            className="inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-body hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Ver indicadores IDSS
          </Link>
        </div>
      </section>

      {/* CTA Section — Plans and WhatsApp */}
      <section className="w-full relative overflow-hidden py-20 tablet:py-28 px-4 tablet:px-8">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-950/85" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-heading-md tablet:text-heading-lg text-white">
            Conheça nossos planos
          </h2>
          <p className="mt-4 text-body text-white/75 max-w-2xl mx-auto">
            Descubra o plano ideal para você e sua família ou fale com um consultor pelo WhatsApp.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 tablet:flex-row tablet:justify-center">
            <Link
              to="/planos"
              className="inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-accent-400 text-primary-950 font-bold text-body hover:bg-accent-300 focus:outline-none focus:ring-4 focus:ring-accent-300/50 transition-all duration-200 shadow-lg"
            >
              Ver planos
            </Link>
            <WhatsAppCTA
              phoneNumber="5521999999999"
              message="Olá! Estou na página institucional da Amacor e gostaria de mais informações sobre os planos."
              label="Falar no WhatsApp"
              variant="primary"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

/** Simple icon mapper for value cards */
function ValueIcon({ name, light }: { name: string; light?: boolean }) {
  const colorClass = light ? 'text-accent-300' : 'text-primary-600'
  switch (name) {
    case 'Heart':
      return (
        <svg className={`w-7 h-7 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    case 'Shield':
      return (
        <svg className={`w-7 h-7 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'Eye':
      return (
        <svg className={`w-7 h-7 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    case 'Lightbulb':
      return (
        <svg className={`w-7 h-7 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    default:
      return (
        <svg className={`w-7 h-7 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
  }
}
