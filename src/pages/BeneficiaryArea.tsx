import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ServiceCard {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  href: string
  external?: boolean
}

const serviceCards: ServiceCard[] = [
  {
    id: 'boleto',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: '2ª via de boleto',
    description: 'Emita a segunda via do seu boleto de pagamento.',
    href: '/beneficiario/boletos',
  },
  {
    id: 'dados',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Meus dados',
    description: 'Consulte seus dados cadastrais.',
    href: '/beneficiario/dados',
  },
  {
    id: 'protocolos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Protocolos',
    description: 'Consulte o andamento dos seus protocolos.',
    href: '/beneficiario/protocolos',
  },
  {
    id: 'senha',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Alterar senha',
    description: 'Altere sua senha de acesso.',
    href: '/beneficiario/alterar-senha',
  },
  {
    id: 'solicitar-exame',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Solicitar exame',
    description: 'Peça autorização para exames e procedimentos.',
    href: '/beneficiario/solicitacoes/nova',
  },
  {
    id: 'telemedicina',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: 'Telemedicina',
    description: 'Acesse consultas médicas online 24 horas.',
    href: '/telemedicina',
  },
]

/**
 * Gera iniciais do nome do beneficiário para exibir no avatar.
 */
function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function BeneficiaryArea() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)]">
      {/* Banner de contexto — quando NÃO logado */}
      {!session && (
        <section className="relative w-full overflow-hidden min-h-[280px] tablet:min-h-[340px] flex items-center">
          <div className="absolute inset-0 bg-gradient-brand" />
          <div className="relative z-10 mx-auto max-w-6xl w-full px-4 tablet:px-8 py-20 tablet:py-24 text-center">
            <h1 className="text-heading-lg tablet:text-heading-xl text-white">
              Área do Beneficiário
            </h1>
            <p className="text-body-lg text-white/80 mt-3 max-w-2xl mx-auto">
              Acesse os serviços disponíveis para associados de forma rápida e prática.
            </p>
          </div>
        </section>
      )}

      {/* Banner de contexto — deixa claro que é uma área logada/restrita */}
      {session && (
        <div className="w-full bg-gradient-brand text-white">
          <div className="mx-auto max-w-5xl px-4 tablet:px-8 py-6 tablet:py-8 flex flex-col tablet:flex-row items-center gap-4 tablet:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-bold">
              {getInitials(session.nome || session.codigo)}
            </div>

            {/* Info do usuário */}
            <div className="flex-1 text-center tablet:text-left">
              <div className="flex items-center justify-center tablet:justify-start gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Área Restrita
                </span>
              </div>
              <h1 className="text-xl tablet:text-2xl font-bold">
                Olá, {session.nome || session.codigo}!
              </h1>
              <p className="text-sm text-white/80 mt-0.5">
                Matrícula: {session.codigo}
              </p>
            </div>

            {/* Ação de sair */}
            <button
              onClick={handleLogout}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair da conta
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <section className="w-full py-12 tablet:py-16 px-4 tablet:px-8 bg-background-light">
        <div className="mx-auto max-w-5xl">
          {/* Subtítulo quando logado */}
          {session && (
            <div className="text-center mb-10">
              <h2 className="text-heading-sm tablet:text-heading-md text-primary-900">
                O que deseja fazer?
              </h2>
              <p className="mt-2 text-[15px] text-warm-500">
                Selecione um dos serviços abaixo para continuar.
              </p>
            </div>
          )}

          {/* Service cards grid: 2-col <768px, 3-col >=768px */}
          <div
            className="grid grid-cols-2 tablet:grid-cols-3 gap-6"
            role="list"
            aria-label="Serviços para beneficiários"
          >
            {serviceCards.map((card) => (
              <Link
                key={card.id}
                to={card.href}
                role="listitem"
                aria-label={`${card.title}: ${card.description}`}
                className="group flex flex-col items-center text-center p-6 tablet:p-8 bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-warm-200 hover:border-primary-300 transition-all duration-300 min-w-[120px] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon with touch-target sizing */}
                <div className="flex items-center justify-center w-touch h-touch rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors mb-4">
                  {card.icon}
                </div>
                {/* Title */}
                <h2 className="text-[18px] font-bold text-primary-900 leading-tight mb-2">
                  {card.title}
                </h2>
                {/* Description (≤60 chars) */}
                <p className="text-[15px] text-warm-600 leading-snug">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
