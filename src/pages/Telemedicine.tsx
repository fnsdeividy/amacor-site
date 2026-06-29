const TELEMEDICINE_URL = 'https://telemedicina.amacorsaude.com.br/login'

const steps = [
  {
    number: 1,
    highlight: 'CPF',
    text: 'No campo "CPF", insira os 11 dígitos do CPF do titular, sem pontos ou traços, apenas os números.',
  },
  {
    number: 2,
    highlight: 'SENHA',
    text: 'No campo "SENHA", digite os 4 primeiros números do CPF do titular, pois eles serão a sua senha de acesso.',
  },
  {
    number: 3,
    highlight: 'ENTRAR',
    text: 'Clique em "ENTRAR" para acessar o sistema de telemedicina da Amacor Saúde.',
  },
  {
    number: 4,
    highlight: 'SOLICITAR ATENDIMENTO',
    text: 'Na tela que abrirá, clique em "SOLICITAR ATENDIMENTO" e pronto, em instantes você será atendido.',
  },
]

export default function Telemedicine() {
  return (
    <div className="w-full">
      {/* Hero / Header */}
      <section className="bg-gradient-brand py-16 tablet:py-20 px-4 tablet:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white mb-4">
            Telemedicina Amacor
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Consultas médicas online 24 horas, de onde você estiver.
          </p>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-16 tablet:py-20 px-4 tablet:px-8 bg-background-light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-heading-md tablet:text-heading-lg text-primary-900 mb-4">
            Como acessar a <span className="text-primary-500">Telemedicina Amacor</span>:
          </h2>

          {/* CTA Button */}
          <a
            href={TELEMEDICINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 mb-12 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white text-lg font-bold rounded-full transition-colors shadow-md hover:shadow-lg min-h-touch"
          >
            Clique aqui para acessar
          </a>

          {/* Steps */}
          <div className="space-y-8 text-left max-w-xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <p className="text-body text-warm-700 pt-1.5">
                  {step.text.split(`"${step.highlight}"`)[0]}
                  <span className="font-bold text-primary-600">"{step.highlight}"</span>
                  {step.text.split(`"${step.highlight}"`)[1]}
                </p>
              </div>
            ))}
          </div>

          {/* Secondary CTA */}
          <div className="mt-12">
            <a
              href={TELEMEDICINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-lg font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg min-h-touch"
            >
              Acessar Telemedicina
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
