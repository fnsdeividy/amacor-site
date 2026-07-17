import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined;

/**
 * Inicializa o PostHog apenas se a chave estiver configurada.
 * Em desenvolvimento sem chave, nenhum tracking é feito.
 */
export function initPostHog(): void {
  if (!POSTHOG_KEY) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST || 'https://us.i.posthog.com',
    autocapture: true,
    capture_pageview: false, // capturamos manualmente via react-router
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  });
}

export { posthog };
