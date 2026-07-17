export interface FooterProps { }

export function Footer(_props: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-warm-200 relative">
      <div className="mx-auto max-w-7xl px-4 py-14 tablet:px-6 desktop:px-8">
        <div className="grid grid-cols-1 gap-10 tablet:grid-cols-2 desktop:grid-cols-4">
          {/* Brand & Description */}
          <div>
            <div className="mb-5">
              <img
                src="/img/logo.png"
                alt="Amacor"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-warm-600 mb-4">
              A Amacor Planos de Saúde disponibiliza diversos meios de contatos, escolha abaixo e fale conosco agora!
            </p>
          </div>

          {/* Nossas Informações */}
          <div>
            <h3 className="text-primary-900 font-semibold text-sm mb-4">Nossas Informações</h3>
            <ul className="space-y-2.5 text-sm text-warm-600">
              <li>CRM: 52-0096605-3</li>
              <li>CRM-PJ: 52-0104580-6</li>
              <li>
                <span className="font-medium">EMAIL:</span>{' '}
                <a href="mailto:ouvidoria@mhvida.com.br" className="text-primary-600 hover:underline">
                  ouvidoria@mhvida.com.br
                </a>
              </li>
              <li>
                <span className="font-medium">PLANO AMBULATORIAL:</span>(21) 99018-4171
              </li>
              <li>RT: Dr. Raíssa Heber Pinto Lima</li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-primary-900 font-semibold text-sm mb-4">Serviços</h3>
            <nav aria-label="Links de serviços do rodapé">
              <ul className="space-y-2.5">
                {[
                  { label: 'ANS', href: 'https://www.gov.br/ans' },
                  { label: 'Ouvidoria', href: '/contato' },
                  { label: '2ª Via de Boletos', href: '/beneficiario/boletos' },
                  { label: 'Manual do Associado', href: '#' },
                  { label: 'Rede de Atendimento', href: '/rede-credenciada' },
                  { label: 'Telemedicina', href: '/telemedicina' },
                  { label: 'Politica de Reembolso', href: '/politica-de-reembolso' },
                  { label: 'IDSS', href: '/idss' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-warm-600 hover:text-primary-600 transition-colors"
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Outros canais */}
          <div>
            <h3 className="text-primary-900 font-semibold text-sm mb-4">Outros canais da Amacor:</h3>
            <div className="flex items-center gap-3 mb-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/5521990184171"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Amacor"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/amacorsaude/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Amacor"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/amacorsaude/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Amacor"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <h3 className="text-primary-900 font-semibold text-sm mb-3">Atendimento</h3>
            <ul className="space-y-2 text-sm text-warm-600">
              <li>Seg-Sex: 8h às 18h</li>
              <li>Sábado: 8h às 12h</li>
            </ul>
          </div>
        </div>

        {/* Regulatory info */}
        <div className="mt-10 pt-8 border-t border-warm-200">
          <div className="flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4">
            <div className="text-xs text-warm-500 space-y-1">
              <p className="font-medium text-warm-700">MH VIDA OPERADORA DE PLANOS DE SAÚDE LTDA</p>
              <p>CRM: 52-0096605-3</p>
              <p>Rua Augusto Vasconcelos, 544 - loja 148 - Campo Grande, Rio de Janeiro</p>
              <p>CEP - 23045-120</p>
            </div>
            <div className="flex-shrink-0 border border-warm-300 rounded-md px-3 py-2">
              <span className="text-xs font-semibold text-warm-700">ANS nº 41201-5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — azul primário como no site original */}
      <div className="bg-primary-500">
        <div className="mx-auto max-w-7xl px-4 py-4 tablet:px-6 desktop:px-8 text-center">
          <p className="text-sm text-white">
            © Copyright Amacor Planos de Saúde.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
