export interface FooterProps { }

export function Footer(_props: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-primary-950 text-warm-300 relative overflow-hidden">
      {/* Topography texture */}
      <div className="absolute inset-0 opacity-100" style={{ backgroundImage: 'url(/img/textures/topography.svg)', backgroundSize: '600px 600px', backgroundRepeat: 'repeat' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 tablet:px-6 desktop:px-8">
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
              ANS nº 414069
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">Navegação</h3>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-2.5">
                {[
                  { label: 'Planos de Saúde', href: '/planos' },
                  { label: 'Exclusivo I', href: '/planos/exclusivo-i' },
                  { label: 'Mais com Franquia', href: '/planos/mais-com-franquia' },
                  { label: 'Telemedicina', href: '/telemedicina' },
                  { label: 'Rede Credenciada', href: '/rede-credenciada' },
                  { label: 'Institucional', href: '/institucional' },
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

          {/* Social Media & Hours */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">Redes Sociais</h3>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://www.instagram.com/amacorsaude/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Amacor"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-warm-400 hover:bg-white/20 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/amacorsaude/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Amacor"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-warm-400 hover:bg-white/20 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

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
      <div className="relative border-t border-white/10">
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
