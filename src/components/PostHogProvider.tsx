import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../lib/posthog';

/**
 * Componente que rastreia page views automaticamente ao detectar mudanças
 * de rota via react-router.
 *
 * A inicialização do PostHog é feita em main.tsx (antes do mount do React),
 * garantindo que o primeiro pageview seja capturado.
 *
 * Deve ser renderizado dentro de um BrowserRouter.
 */
export function PostHogPageTracker() {
  const { pathname, search } = useLocation();

  // Captura page view a cada mudança de rota
  useEffect(() => {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: pathname,
      search,
    });
  }, [pathname, search]);

  return null;
}
