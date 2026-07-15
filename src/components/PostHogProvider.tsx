import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog, initPostHog } from '../lib/posthog';

/**
 * Componente que inicializa o PostHog e rastreia page views automaticamente
 * ao detectar mudanças de rota via react-router.
 *
 * Deve ser renderizado dentro de um BrowserRouter.
 */
export function PostHogPageTracker() {
  const { pathname, search } = useLocation();

  // Inicializa o PostHog uma única vez
  useEffect(() => {
    initPostHog();
  }, []);

  // Captura page view a cada mudança de rota
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: pathname,
        search,
      });
    }
  }, [pathname, search]);

  return null;
}
