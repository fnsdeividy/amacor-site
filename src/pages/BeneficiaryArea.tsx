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
    id: 'rede',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Rede de atendimento',
    description: 'Veja os prestadores disponíveis no seu plano.',
    href: '/beneficiario/rede',
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

export default function BeneficiaryArea() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-background-light">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="text-center mb-14">
          <h1 className="text-heading-md tablet:text-heading-lg text-primary-900">
            Área do Beneficiário
          </h1>
          <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
            {session ? `Olá, ${session.nome || session.codigo}!` : 'Acesse os serviços disponíveis para associados de forma rápida e prática.'}
          </p>
          {session && (
            <button
              onClick={handleLogout}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair da conta
            </button>
          )}
        </div>

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
  )
}
