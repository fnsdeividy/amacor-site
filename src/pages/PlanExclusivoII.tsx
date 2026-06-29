import ContactForm from '../components/ContactForm/ContactForm'
import { CTASection } from '../components/CTASection/CTASection'
import { InfoCard } from '../components/InfoCard/InfoCard'
import type { FormFieldConfig } from '../types/forms'

const benefits = [
  {
    title: 'Consultas em Diversas Especialidades',
    description:
      'Acesso a consultas medicas em clinica geral, cardiologia, dermatologia, ginecologia, ortopedia, oftalmologia e muito mais.',
  },
  {
    title: 'Exames Laboratoriais e de Imagem',
    description:
      'Cobertura completa para exames de sangue, urina, raio-x, ultrassonografia, tomografia e ressonancia magnetica.',
  },
  {
    title: 'Fisioterapia e Reabilitacao',
    description:
      'Sessoes de fisioterapia, RPG e reabilitacao com profissionais qualificados da rede credenciada.',
  },
  {
    title: 'Psicologia e Saude Mental',
    description:
      'Acompanhamento psicologico com sessoes regulares para cuidar do seu bem-estar emocional.',
  },
  {
    title: 'Atendimento Prioritario',
    description:
      'Agendamento facilitado e atendimento prioritario em toda a rede credenciada Amacor.',
  },
  {
    title: 'Telemedicina 24 Horas',
    description:
      'Consultas medicas por video disponiveis a qualquer hora, sem sair de casa.',
  },
]

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

export default function PlanExclusivoII() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative w-full overflow-hidden min-h-[300px] tablet:min-h-[360px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl w-full px-4 tablet:px-8 py-20 tablet:py-24 text-center">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            Plano Individual Amacor Exclusivo II
          </h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-3xl mx-auto">
            Plano ambulatorial completo com cobertura ampliada, incluindo
            especialidades adicionais e atendimento prioritario para voce e sua
            familia.
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
              Coberturas do Plano
            </h2>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <InfoCard
                key={benefit.title}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Quer saber mais sobre o Exclusivo II?"
        description="Entre em contato conosco pelo WhatsApp ou telefone e tire todas as suas duvidas sobre o plano."
        primaryAction={{
          text: 'Fale pelo WhatsApp',
          link: 'https://wa.me/5521999999999?text=Ola! Gostaria de saber mais sobre o plano Exclusivo II.',
          variant: 'whatsapp',
        }}
        secondaryAction={{
          text: 'Ligue para nos',
          link: 'tel:+552140200639',
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
              voce para apresentar o plano Exclusivo II.
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
    </div>
  )
}
