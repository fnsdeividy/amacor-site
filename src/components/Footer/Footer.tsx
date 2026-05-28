export interface FooterProps { }

export function Footer(_props: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-primary-950 text-warm-300">
      <div className="mx-auto max-w-7xl px-4 py-14 tablet:px-6 desktop:px-8">
        <div className="grid grid-cols-1 gap-10 tablet:grid-cols-2 desktop:grid-cols-4">
          {/* Brand & Regulatory */}
          <div>
            <div className="mb-5">
              <img
                src="/img/logo.png"
                alt="Amacor"
                className="h-10 w-auto brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm leading-relaxed text-warm-400 mb-3">
              Operadora de planos de saúde registrada na ANS, oferecendo cobertura ambulatorial de qualidade no Rio de Janeiro.
            </p>
            <p className="text-xs text-warm-500">
              Registro ANS nº 416428
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">Navegação</h3>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-2.5">
                {[
                  { label: 'Planos de Saúde', href: '/planos' },
                  { label: 'Rede Credenciada', href: '/rede-credenciada' },
                  { label: 'A Empresa', href: '/sobre' },
                  { label: 'Carências', href: '/carencia-individual' },
                  { label: 'IDSS', href: '/idss' },
                  { label: 'Manual TISS', href: '/manual-tiss' },
                  { label: 'Contato', href: '/contato' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-warm-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">Contato</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+552140200639"
                  className="flex items-center gap-2 text-sm text-warm-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (21) 4020-0639
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@amacor.com.br"
                  className="flex items-center gap-2 text-sm text-warm-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contato@amacor.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5521999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-warm-400 hover:text-whatsapp transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">Atendimento</h3>
            <ul className="space-y-2.5 text-sm text-warm-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Seg-Sex: 8h às 18h
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sábado: 8h às 12h
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 tablet:px-6 desktop:px-8 flex flex-col tablet:flex-row items-center justify-between gap-2">
          <p className="text-xs text-warm-500">
            © {currentYear} Amacor Planos de Saúde. Todos os direitos reservados.
          </p>
          <p className="text-xs text-warm-500">
            Operadora regulamentada pela ANS — Agência Nacional de Saúde Suplementar
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
