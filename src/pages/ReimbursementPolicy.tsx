export default function ReimbursementPolicy() {
  const pdfUrl = '/docs/tabela-reembolso-mhvida.pdf'

  return (
    <div className="w-full min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-700/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-3xl" />
        </div>

        <div className="relative py-16 tablet:py-20 px-4 tablet:px-8">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li><a href="/" className="hover:text-white/80 transition-colors">Inicio</a></li>
                <li aria-hidden="true">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-white/80 font-medium">Política de Reembolso</li>
              </ol>
            </nav>

            <h1 className="font-display text-heading-lg tablet:text-heading-xl text-white tracking-tight">
              Política de <span className="text-accent-300">Reembolso</span>
            </h1>
            <p className="mt-4 text-body-lg text-white/70 leading-relaxed max-w-3xl">
              Saiba como funciona o processo de reembolso para procedimentos ambulatoriais realizados fora da rede credenciada.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-12 tablet:py-16 px-4 tablet:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-elevated border border-warm-100 p-8 tablet:p-12">
            <div className="prose prose-warm max-w-none space-y-6 text-warm-700 text-body leading-relaxed">
              <p>
                <strong className="text-primary-900">1.</strong> Quando nao for possivel a utilizacao dos servicos de prestadores da rede, o Beneficiario devera entrar em contato com a Operadora MH Vida e solicitar a indicacao de um local para o atendimento.
              </p>

              <p>
                <strong className="text-primary-900">2.</strong> Quando nao for possivel o atendimento pelos prestadores proprios ou contratados, dentro da area de abrangencia, em razao da urgencia e emergencia, definidos e comprovados pelo medico assistente, a MH VIDA, garantira o reembolso dentro dos limites contratuais do plano. Ou seja, o pagamento ocorrera dentro dos mesmos valores pagos a rede propria ou contratada.
              </p>

              <p>
                <strong className="text-primary-900">3.</strong> O pagamento do reembolso sera efetuado de acordo com os valores da Tabela de Reembolso da CONTRATADA (que equivale a relacao de servicos medicos e hospitalares praticados pela CONTRATADA junto a rede de prestadores do respectivo plano), descontados os eventuais valores de coparticipacao (se houver), no prazo maximo de 30 (trinta) dias contados a partir do recebimento da documentacao completa pela CONTRATADA.
              </p>

              <p>
                <strong className="text-primary-900">4.</strong> O reembolso sera efetuado dentro do prazo maximo de 30 (trinta) dias apos a apresentacao dos seguintes documentos originais:
              </p>

              <div className="pl-6 space-y-3">
                <p>
                  <strong className="text-primary-900">a)</strong> O relatorio do medico assistente onde somente podera ser exigida tal declaracao do medico assistente, nos casos de emergencia, atestando a emergencia, declarando o nome do paciente, descricao do tratamento e respectiva justificativa dos procedimentos realizados, data do atendimento;
                </p>
                <p>
                  <strong className="text-primary-900">b)</strong> Recibos/Notas Fiscais individualizados de honorarios dos medicos assistentes, auxiliares e outros, discriminando funcoes e o evento a que se referem;
                </p>
                <p>
                  <strong className="text-primary-900">c)</strong> Comprovantes relativos aos servicos de exames laboratoriais, de radiodiagnosticos, terapias e servicos auxiliares, acompanhados do pedido do medico assistente.
                </p>
              </div>

              <p>
                <strong className="text-primary-900">5.</strong> Se a documentacao nao contiver todos os dados comprobatorios que permitam o calculo correto do ressarcimento, a CONTRATADA podera solicitar a CONTRATANTE documentacao ou informacoes complementares sobre o procedimento a ser ressarcido, o que acarretara novo prazo de 30 (TRINTA) dias contados da data da juntada do novo documento.
              </p>

              <p>
                <strong className="text-primary-900">6.</strong> So serao ressarcidas as despesas com cobertura no Rol da ANS e vinculadas diretamente ao evento que originou o atendimento ao BENEFICIARIO.
              </p>

              <p>
                <strong className="text-primary-900">7.</strong> Os documentos (recibos, laudos e relatorios medicos) deverao ser entregues a CONTRATADA diretamente em sua sede ou em um endereco local indicado por ela no prazo maximo de ate 12 (doze) meses corridos, contados a partir da data em que ocorrer o evento medico sob pena de perda do direito apos esta data.
              </p>

              <p>
                <strong className="text-primary-900">8.</strong> Os demais casos de reembolso que nao se enquadrarem nos casos acima especificados e nao considerados como urgencia e emergencia, serao tratados dentro do ambito da Resolucao Normativa da Agencia Nacional de Saude n 259/11. De acordo com esta resolucao a operadora so sera obrigada ao reembolso nos casos em que houver registro e protocolo da solicitacao do atendimento pretendido fornecido pela operadora. Sendo assim, torna-se obrigatorio o contato previo do Beneficiario junto a MH VIDA antes da realizacao do atendimento.
              </p>
            </div>

            {/* CTA to download PDF */}
            <div className="mt-10 pt-8 border-t border-warm-200">
              <p className="text-body text-warm-600 mb-4">
                Para verificar a tabela com os valores de reembolso acesse:
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 min-h-touch px-6 py-3.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tabela de Reembolso (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
