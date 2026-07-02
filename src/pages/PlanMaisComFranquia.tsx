import plansData from '../data/plans.json'
import ContactForm from '../components/ContactForm/ContactForm'
import { WhatsAppCTA } from '../components/WhatsAppCTA/WhatsAppCTA'
import { CTASection } from '../components/CTASection/CTASection'
import { InfoCard } from '../components/InfoCard/InfoCard'
import type { FormFieldConfig } from '../types/forms'

const plan = plansData.find((p) => p.id === 'plan-mais-com-franquia')!

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

export default function PlanMaisComFranquia() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative w-full overflow-hidden min-h-[300px] tablet:min-h-[360px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl w-full px-4 tablet:px-8 py-20 tablet:py-24 text-center">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            {plan.name}
          </h1>
          <p className="mt-3 text-body-lg text-white/90 font-medium">
            {plan.tagline}
          </p>
          <p className="mt-4 text-body-lg text-white/80 max-w-3xl mx-auto">
            {plan.description}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 tablet:py-28 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Coberturas
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Beneficios do Plano
            </h2>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
            {plan.detailedBenefits.map((benefit) => (
              <InfoCard
                key={benefit.title}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Details Section */}
      <section className="py-20 tablet:py-28 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Detalhes
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Detalhes da Cobertura
            </h2>
          </div>
          <ul className="space-y-4" role="list">
            {plan.coverageDetails.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-body text-warm-700"
              >
                <svg
                  className="w-5 h-5 text-accent-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Co-participation Section */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 tablet:p-10">
            <h3 className="text-heading-sm text-primary-900 mb-4">
              Regras de Coparticipacao
            </h3>
            <p className="text-body text-warm-700">
              {plan.coParticipation}
            </p>
            <p className="text-body text-warm-600 mt-4">
              Com o modelo de coparticipacao, voce paga uma mensalidade mais acessivel e contribui apenas quando utiliza os servicos. E a forma inteligente de cuidar da saude sem comprometer o orcamento.
            </p>
          </div>
        </div>
      </section>

      {/* Network Info Section */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-heading-sm tablet:text-heading-md text-primary-900">
              Rede Credenciada
            </h3>
          </div>
          <p className="text-body text-warm-700 text-center max-w-2xl mx-auto">
            {plan.networkInfo}
          </p>
          {plan.includesTelemedicine && (
            <p className="text-body text-accent-600 font-medium text-center mt-4">
              Inclui Telemedicina 24 horas — atendimento online a qualquer momento.
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Quer saber mais sobre o Amacor Mais com Franquia?"
        description="Entre em contato conosco pelo WhatsApp ou telefone e tire todas as suas duvidas sobre o plano."
        primaryAction={{
          text: 'Fale pelo WhatsApp',
          link: 'https://wa.me/5521999999999?text=Ola! Gostaria de saber mais sobre o plano Amacor Mais com Franquia.',
          variant: 'whatsapp',
        }}
        secondaryAction={{
          text: 'Ligue para nos',
          link: 'tel:+5521972318026',
          variant: 'phone',
        }}
      />

      {/* Contact Form Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-warm-50">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Formulario
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Solicite um Contato
            </h2>
            <p className="text-body text-warm-600 mt-3">
              Preencha o formulario abaixo e nossa equipe entrara em contato com
              voce para apresentar o plano Amacor Mais com Franquia.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-warm-200 p-8 tablet:p-10">
            <ContactForm
              fields={formFields}
              onSubmit={handleFormSubmit}
              submitButtonText="Solicitar contato"
              successMessage="Solicitacao enviada com sucesso! Nossa equipe entrara em contato em breve."
            />
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-white">
        <div className="mx-auto max-w-md text-center">
          <h3 className="text-heading-sm text-primary-900 mb-6">
            Prefere falar pelo WhatsApp?
          </h3>
          <WhatsAppCTA
            phoneNumber="5521999999999"
            message="Ola! Tenho interesse no plano Amacor Mais com Franquia. Gostaria de mais informacoes."
            label="Contratar pelo WhatsApp"
            variant="primary"
          />
        </div>
      </section>
    </div>
  )
}
