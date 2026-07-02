import ContactForm from '../components/ContactForm/ContactForm'
import type { FormFieldConfig } from '../types/forms'

const contactFormFields: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    required: true,
    maxLength: 100,
    placeholder: 'Seu nome completo',
    validation: [
      { type: 'required', message: 'O nome é obrigatório.' },
      { type: 'maxLength', value: 100, message: 'O nome deve ter no máximo 100 caracteres.' },
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
      { type: 'required', message: 'O telefone é obrigatório.' },
      { type: 'phone', message: 'Informe um telefone válido.' },
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
      { type: 'required', message: 'O e-mail é obrigatório.' },
      { type: 'email', message: 'Informe um e-mail válido.' },
      { type: 'maxLength', value: 254, message: 'O e-mail deve ter no máximo 254 caracteres.' },
    ],
  },
  {
    name: 'subject',
    label: 'Assunto',
    type: 'text',
    required: true,
    maxLength: 150,
    placeholder: 'Assunto da mensagem',
    validation: [
      { type: 'required', message: 'O assunto é obrigatório.' },
      { type: 'maxLength', value: 150, message: 'O assunto deve ter no máximo 150 caracteres.' },
    ],
  },
  {
    name: 'message',
    label: 'Mensagem',
    type: 'textarea',
    required: true,
    maxLength: 2000,
    placeholder: 'Escreva sua mensagem...',
    validation: [
      { type: 'required', message: 'A mensagem é obrigatória.' },
      { type: 'maxLength', value: 2000, message: 'A mensagem deve ter no máximo 2000 caracteres.' },
    ],
  },
]

async function handleContactSubmit(_data: Record<string, string>): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export default function Contact() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative w-full overflow-hidden min-h-[280px] tablet:min-h-[340px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-brand-overlay" />
        <div className="relative z-10 mx-auto max-w-6xl w-full px-4 tablet:px-8 py-20 tablet:py-24">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">Contato</h1>
          <p className="text-body-lg text-white/80 mt-3">
            Entre em contato conosco. Estamos prontos para atender você.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 tablet:px-8 py-20 tablet:py-24">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-16">
          {/* Contact Form Section */}
          <section aria-labelledby="contact-form-heading">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Formulário
            </span>
            <h2
              id="contact-form-heading"
              className="text-heading-md text-primary-900 mb-8"
            >
              Envie sua mensagem
            </h2>
            <div className="bg-white rounded-2xl shadow-soft border border-warm-200 p-8 tablet:p-10">
              <ContactForm
                fields={contactFormFields}
                onSubmit={handleContactSubmit}
                submitButtonText="Enviar mensagem"
                successMessage="Mensagem enviada com sucesso! Retornaremos em breve."
              />
            </div>
          </section>

          {/* Contact Info Section */}
          <section aria-labelledby="contact-info-heading">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Informações
            </span>
            <h2
              id="contact-info-heading"
              className="text-heading-md text-primary-900 mb-8"
            >
              Informações de contato
            </h2>

            <div className="space-y-5">
              {/* Phone Card */}
              <div className="bg-white rounded-2xl border border-warm-200 p-7 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-primary-900">Telefone</h3>
                    <a
                      href="tel:+5521972318026"
                      className="text-body text-primary-600 hover:text-primary-700 mt-1 inline-block"
                    >
                      (21) 97231-8026
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl border border-warm-200 p-7 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-primary-900">E-mail</h3>
                    <a
                      href="mailto:contato@amacor.com.br"
                      className="text-body text-primary-600 hover:text-primary-700 mt-1 inline-block"
                    >
                      contato@amacor.com.br
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="bg-white rounded-2xl border border-warm-200 p-7 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-primary-900">
                      Horário de atendimento
                    </h3>
                    <p className="text-body text-warm-600 mt-1">
                      Seg-Sex: 8h às 18h
                    </p>
                    <p className="text-body text-warm-600">
                      Sáb: 8h às 12h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Embedded Map Section */}
        <section aria-labelledby="map-heading" className="mt-16">
          <h2
            id="map-heading"
            className="text-heading-md text-primary-900 mb-6"
          >
            Nossa localização
          </h2>
          <div className="bg-white rounded-2xl shadow-soft border border-warm-200 overflow-hidden">
            <iframe
              title="Localização da Amacor no mapa"
              src="https://maps.google.com/maps?q=Rua+Augusto+Vasconcelos,+544,+Campo+Grande,+Rio+de+Janeiro,+RJ&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[300px] tablet:h-[400px]"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
