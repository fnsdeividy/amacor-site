import ContactForm from '../components/ContactForm/ContactForm'
import type { FormFieldConfig } from '../types/forms'

const corporateBenefits = [
  {
    title: 'Cobertura Ambulatorial Completa',
    description:
      'Consultas medicas em diversas especialidades, exames laboratoriais e de imagem para todos os colaboradores.',
  },
  {
    title: 'Carencias Reduzidas',
    description:
      'Prazos de carencia reduzidos para grupos empresariais, garantindo acesso rapido aos servicos de saude.',
  },
  {
    title: 'Gestao Simplificada para RH',
    description:
      'Ferramentas e processos simplificados para inclusao, exclusao e acompanhamento de beneficiarios.',
  },
  {
    title: 'Rede Credenciada Ampla',
    description:
      'Acesso a hospitais, clinicas, laboratorios e consultorios em toda a regiao do Rio de Janeiro.',
  },
  {
    title: 'Telemedicina para Colaboradores',
    description:
      'Atendimento medico online disponivel para todos os colaboradores, com praticidade e agilidade.',
  },
  {
    title: 'Franquia com Economia',
    description:
      'Modelo com franquia que oferece economia para a empresa sem comprometer a qualidade do atendimento.',
  },
]

const proposalFormFields: FormFieldConfig[] = [
  {
    name: 'companyName',
    label: 'Nome da Empresa',
    type: 'text',
    required: true,
    maxLength: 100,
    placeholder: 'Nome da sua empresa',
    validation: [
      { type: 'required', message: 'O nome da empresa e obrigatorio.' },
      {
        type: 'maxLength',
        value: 100,
        message: 'O nome da empresa deve ter no maximo 100 caracteres.',
      },
    ],
  },
  {
    name: 'contactName',
    label: 'Nome do Contato',
    type: 'text',
    required: true,
    maxLength: 80,
    placeholder: 'Seu nome completo',
    validation: [
      { type: 'required', message: 'O nome do contato e obrigatorio.' },
      {
        type: 'maxLength',
        value: 80,
        message: 'O nome do contato deve ter no maximo 80 caracteres.',
      },
    ],
  },
  {
    name: 'phone',
    label: 'Telefone',
    type: 'tel',
    required: true,
    maxLength: 20,
    placeholder: '(21) 99999-9999',
    validation: [
      { type: 'required', message: 'O telefone e obrigatorio.' },
      {
        type: 'phone',
        message: 'Informe um telefone valido com pelo menos 10 digitos.',
      },
    ],
  },
  {
    name: 'email',
    label: 'E-mail',
    type: 'email',
    required: true,
    maxLength: 120,
    placeholder: 'contato@empresa.com.br',
    validation: [
      { type: 'required', message: 'O e-mail e obrigatorio.' },
      { type: 'email', message: 'Informe um e-mail valido.' },
      {
        type: 'maxLength',
        value: 120,
        message: 'O e-mail deve ter no maximo 120 caracteres.',
      },
    ],
  },
  {
    name: 'numberOfEmployees',
    label: 'Numero de Colaboradores',
    type: 'number',
    required: true,
    min: 1,
    max: 99999,
    placeholder: 'Ex: 50',
    validation: [
      { type: 'required', message: 'O numero de colaboradores e obrigatorio.' },
      {
        type: 'min',
        value: 1,
        message: 'O numero de colaboradores deve ser no minimo 1.',
      },
      {
        type: 'max',
        value: 99999,
        message: 'O numero de colaboradores deve ser no maximo 99.999.',
      },
    ],
  },
  {
    name: 'message',
    label: 'Mensagem',
    type: 'textarea',
    required: false,
    maxLength: 500,
    placeholder: 'Informacoes adicionais sobre sua empresa ou duvidas...',
    validation: [
      {
        type: 'maxLength',
        value: 500,
        message: 'A mensagem deve ter no maximo 500 caracteres.',
      },
    ],
  },
]

async function handleProposalSubmit(
  _data: Record<string, string>
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })
}

export default function PlanCorporate() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative w-full overflow-hidden min-h-[300px] tablet:min-h-[360px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/80 to-primary-900/60" />
        <div className="relative z-10 mx-auto max-w-6xl w-full px-4 tablet:px-8 py-20 tablet:py-24">
          <h1 className="text-heading-lg tablet:text-heading-xl text-white">
            Plano Empresarial Amacor Mais com Franquia
          </h1>
          <p className="text-body-lg text-white/80 mt-4 max-w-2xl">
            A solucao ideal em saude ambulatorial para sua empresa e seus
            colaboradores.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 tablet:py-28 px-4 tablet:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Beneficios
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Coberturas e Beneficios
            </h2>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
            {corporateBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border border-warm-200 p-8 hover:shadow-card-hover hover:border-warm-300 transition-all duration-300"
              >
                <h3 className="text-[18px] font-bold text-primary-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[16px] text-warm-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposal Form Section */}
      <section className="py-20 tablet:py-24 px-4 tablet:px-8 bg-warm-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-accent-500 uppercase tracking-wider mb-3">
              Proposta
            </span>
            <h2 className="text-heading-md tablet:text-heading-lg text-primary-900">
              Solicite uma Proposta
            </h2>
            <p className="text-body text-warm-600 mt-3">
              Preencha o formulario abaixo e nossa equipe entrara em contato com
              uma proposta personalizada para sua empresa.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-warm-200 p-8 tablet:p-10">
            <ContactForm
              fields={proposalFormFields}
              onSubmit={handleProposalSubmit}
              submitButtonText="Solicitar proposta"
              successMessage="Proposta solicitada com sucesso! Nossa equipe entrara em contato em breve."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
