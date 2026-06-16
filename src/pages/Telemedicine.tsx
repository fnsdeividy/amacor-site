import HeroSection from '../components/HeroSection/HeroSection'
import { Accordion } from '../components/Accordion/Accordion'
import { WhatsAppCTA } from '../components/WhatsAppCTA/WhatsAppCTA'
import telemedicineData from '../data/telemedicine.json'
import plansData from '../data/plans.json'

const WHATSAPP_PHONE = '5521999999999'

function StepIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'smartphone':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'stethoscope':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )
    case 'clock':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    default:
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
  }
}

function BenefitIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'clock-24':
      return (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'no-waiting':
      return (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    case 'prescription':
      return (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    case 'location':
      return (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    default:
      return (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

export default function Telemedicine() {
  const { hero, steps, benefits, faq, plansWithTelemedicine, platformUrl } = telemedicineData

  // Get plan details for plans that include telemedicine
  const telemedicinePlans = plansData.filter((plan) =>
    plansWithTelemedicine.includes(plan.id)
  )

  // Build FAQ accordion items
  const faqItems = faq.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    content: <p>{item.answer}</p>,
  }))

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        headline={hero.headline}
        subtitle={hero.subtitle}
        primaryCTA={{
          text: 'Acessar Telemedicina',
          link: platformUrl,
          variant: 'scroll',
        }}
        secondaryCTA={{
          text: 'Falar no WhatsApp',
          link: WHATSAPP_PHONE,
          variant: 'whatsapp',
        }}
      />

      {/* Como funciona — Steps */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-white" aria-labelledby="como-funciona-heading">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 id="como-funciona-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Como funciona
            </h2>
            <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
              Consulte um médico em poucos minutos, de qualquer lugar, sem sair de casa.
            </p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-warm-50 shadow-sm"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-700 mb-4">
                  <StepIcon icon={step.icon} />
                </div>
                <span className="absolute top-4 left-4 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-sm" aria-hidden="true">
                  {step.number}
                </span>
                <h3 className="text-body font-bold text-primary-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-body text-warm-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-warm-50" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 id="benefits-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Vantagens da Telemedicina
            </h2>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-white shadow-sm border border-warm-100"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent-50 text-accent-600 mb-5">
                  <BenefitIcon icon={benefit.icon} />
                </div>
                <h3 className="text-body font-bold text-primary-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-body text-warm-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans with Telemedicine */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-white" aria-labelledby="plans-telemedicine-heading">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 id="plans-telemedicine-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Planos com Telemedicina
            </h2>
            <p className="mt-4 text-body text-warm-600 max-w-2xl mx-auto">
              A telemedicina está disponível nos seguintes planos Amacor:
            </p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {telemedicinePlans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-warm-50 border border-warm-200 shadow-sm"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-700 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-body font-bold text-primary-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-body text-warm-500 mb-4">
                  {plan.tagline}
                </p>
                {plan.startingPrice && (
                  <p className="text-body font-semibold text-primary-700">
                    A partir de R$ {plan.startingPrice.toFixed(2).replace('.', ',')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-warm-50" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 id="faq-heading" className="text-heading-md tablet:text-heading-lg text-primary-900">
              Perguntas Frequentes
            </h2>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 tablet:py-28 px-4 tablet:px-8 bg-primary-900" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="cta-heading" className="text-heading-md tablet:text-heading-lg text-white mb-4">
            Pronto para consultar sem sair de casa?
          </h2>
          <p className="text-body text-white/75 mb-10 max-w-2xl mx-auto">
            Acesse a plataforma de telemedicina agora mesmo ou fale com nossa equipe pelo WhatsApp.
          </p>
          <div className="flex flex-col items-center gap-4 tablet:flex-row tablet:justify-center">
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-touch px-8 py-4 rounded-xl bg-accent-400 text-primary-950 font-bold text-body shadow-lg hover:bg-accent-300 focus:outline-none focus:ring-4 focus:ring-accent-300/50 transition-all duration-300"
            >
              Acessar Telemedicina
            </a>
            <WhatsAppCTA
              phoneNumber={WHATSAPP_PHONE}
              message="Olá! Estou na página de Telemedicina da Amacor e gostaria de mais informações sobre o serviço."
              label="Falar no WhatsApp"
              variant="primary"
              className="tablet:w-auto"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
