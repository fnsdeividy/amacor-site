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
              {/* WhatsApp Planos Card */}
              <div className="bg-white rounded-2xl border border-warm-200 p-7 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-primary-900">WhatsApp – Faça seu plano agora</h3>
                    <a
                      href="https://wa.me/5521972318026"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-green-600 hover:text-green-700 mt-1 inline-block"
                    >
                      (21) 97231-8026
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Atendimento Card */}
              <div className="bg-white rounded-2xl border border-warm-200 p-7 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-primary-900">WhatsApp – Atendimento</h3>
                    <a
                      href="https://wa.me/5521990184171"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-green-600 hover:text-green-700 mt-1 inline-block"
                    >
                      (21) 99018-4171
                    </a>
                  </div>
                </div>
              </div>

              {/* Telefone Card */}
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
                      href="tel:+552134059466"
                      className="text-body text-primary-600 hover:text-primary-700 mt-1 inline-block"
                    >
                      (21) 3405-9466
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
                      href="mailto:comercial@mhvida.com.br"
                      className="text-body text-primary-600 hover:text-primary-700 mt-1 inline-block"
                    >
                      comercial@mhvida.com.br
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
                      Seg-Sex: 7h às 18h
                    </p>
                    <p className="text-body text-warm-600">
                      Sáb: 7h às 12h
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
