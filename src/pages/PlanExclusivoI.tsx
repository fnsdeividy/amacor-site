import ContactForm from '../components/ContactForm/ContactForm'
import { WhatsAppCTA } from '../components/WhatsAppCTA/WhatsAppCTA'
import { InfoCard } from '../components/InfoCard/InfoCard'
import type { FormFieldConfig } from '../types/forms'
import plansData from '../data/plans.json'

const plan = plansData.find((p) => p.id === 'plan-exclusivo-i')!

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
    </svg>
  ),
  flask: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94 2.06a2.25 2.25 0 002.012 3.19h11.856a2.25 2.25 0 002.012-3.19L19 14.5" />
    </svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
  ),
  video: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  hospital: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
  ),
}

const formFields: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    required: true,
    maxLength: 120,
    placeholder: 'Seu nome completo',
    validation: [
      { type: 'required', message: 'O nome e obrigatorio.' },
      { type: 'maxLength', value: 120, message: 'O nome deve ter no maximo 120 caracteres.' },
    ],
  },
  {
    name: 'phone',
    label: 'Telefone',
    type: 'tel',
    required: true,
    maxLength: 15,
    placeholder: '(21) 99999-9999',
    validation: [
      { type: 'required', message: 'O telefone e obrigatorio.' },
      { type: 'phone', message: 'Informe um telefone valido com DDD.' },
    ],
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'email',
    required: true,
    maxLength: 254,
    placeholder: 'seu@email.com',
    validation: [
      { type: 'required', message: 'O e-mail e obrigatorio.' },
      { type: 'email', message: 'Informe um e-mail valido.' },
      { type: 'maxLength', value: 254, message: 'O e-mail deve ter no maximo 254 caracteres.' },
    ],
  },
  {
    name: 'message',
    label: 'Mensagem (opcional)',
    type: 'textarea',
    required: false,
    maxLength: 1000,
    placeholder: 'Conte-nos como podemos ajudar...',
    validation: [
      { type: 'maxLength', value: 1000, message: 'A mensagem deve ter no maximo 1000 caracteres.' },
    ],
  },
]

async function handleFormSubmit(_data: Record<string, string>): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export default function PlanExclusivoI() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative w-full overflow-hidden min-h-[300px] tablet:min-h-[360px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl w-full px-4 tablet:px-8 py-20 tablet:py-24 text-center">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            Plano Individual Amacor {plan.name}
          </h1>
          <p className="mt-3 text-body-lg text-white/90 font-medium">
            {plan.tagline}
          </p>
          <p className="mt-4 text-body-lg text-white/80 max-w-3xl mx-auto">
            {plan.description}
          </p>
        </div>
      </section>

      {/* Detailed Benefits Section */}
      <section className="py-20 tablet:py-28 px-4 tablet:px-8 bg-white" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Benefícios
            </span>
            <h2 id="benefits-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Benefícios do Plano
            </h2>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
            {plan.detailedBenefits.map((benefit) => (
              <InfoCard
                key={benefit.title}
                title={benefit.title}
                description={benefit.description}
                icon={iconMap[benefit.icon] || iconMap['stethoscope']}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Details Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-warm-50" aria-labelledby="coverage-heading">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Coberturas
            </span>
            <h2 id="coverage-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Detalhes da Cobertura
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-warm-200 p-8 tablet:p-10">
            <ul className="space-y-4" role="list">
              {plan.coverageDetails.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-warm-700">
                  <svg className="w-6 h-6 text-accent-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Co-participation Rules Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-white" aria-labelledby="coparticipation-heading">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Coparticipação
            </span>
            <h2 id="coparticipation-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Regras de Coparticipação
            </h2>
          </div>
          <div className="bg-confirmation-light rounded-2xl border border-green-200 p-8 tablet:p-10 text-center">
            <svg className="w-12 h-12 text-whatsapp mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-body-lg font-semibold text-green-800">
              {plan.coParticipation}
            </p>
            <p className="mt-2 text-body text-green-700">
              Você não paga nenhum valor adicional ao utilizar os serviços cobertos pelo plano.
            </p>
          </div>
        </div>
      </section>

      {/* Network Info Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-warm-50" aria-labelledby="network-heading">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Rede Credenciada
            </span>
            <h2 id="network-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Informações da Rede
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-warm-200 p-8 tablet:p-10 text-center">
            <svg className="w-12 h-12 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-body-lg font-semibold text-primary-900">
              {plan.networkInfo}
            </p>
            {plan.includesTelemedicine && (
              <p className="mt-3 text-body text-warm-600">
                Inclui telemedicina 24 horas — atendimento médico online de qualquer lugar.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-white" aria-labelledby="whatsapp-cta-heading">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="whatsapp-cta-heading" className="text-heading-md tablet:text-heading-lg text-primary-900 mb-4">
            Contrate agora pelo WhatsApp
          </h2>
          <p className="text-body text-warm-600 mb-8">
            Fale com um consultor e contrate o plano {plan.name} de forma rápida e fácil.
          </p>
          <WhatsAppCTA
            phoneNumber="5521990184171"
            message={`Olá! Tenho interesse no plano ${plan.name}. Gostaria de mais informações.`}
            label="Contratar pelo WhatsApp"
            variant="primary"
          />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-warm-50" aria-labelledby="contact-form-heading">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Formulário
            </span>
            <h2 id="contact-form-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Solicite um Contato
            </h2>
            <p className="text-body text-warm-600 mt-3">
              Preencha o formulário abaixo e nossa equipe entrará em contato com
              você para apresentar o plano {plan.name}.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-warm-200 p-8 tablet:p-10">
            <ContactForm
              fields={formFields}
              onSubmit={handleFormSubmit}
              submitButtonText="Solicitar contato"
              successMessage="Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
