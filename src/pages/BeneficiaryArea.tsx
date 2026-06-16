import { Link } from 'react-router-dom'

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
    id: 'manual',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Manual do associado',
    description: 'Acesse o manual completo do seu plano.',
    href: '/manual-associado',
  },
  {
    id: 'ouvidoria',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Ouvidoria',
    description: 'Fale com nossa ouvidoria para reclamações.',
    href: '/contato',
  },
  {
    id: 'reembolso',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Reembolso',
    description: 'Saiba como solicitar reembolso de despesas.',
    href: '/reembolso',
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
  {
    id: 'reajuste',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Reajuste anual',
    description: 'Consulte os índices de reajuste do seu plano.',
    href: '/reajuste-anual',
  },
]

export default function BeneficiaryArea() {
  return (
    <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-background-light">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="text-center mb-14">
          <h1 className="text-heading-md tablet:text-heading-lg text-primary-900">
            Área do Beneficiário
          </h1>
          <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
            Acesse os serviços disponíveis para associados de forma rápida e prática.
          </p>
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
