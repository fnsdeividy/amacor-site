import type { WhatsAppMessageConfig } from '../types';

/**
 * Strips all non-digit characters from a phone number and builds a WhatsApp URL.
 * @param phoneNumber - Raw phone number string (may contain +, spaces, dashes, parens)
 * @param message - Pre-filled message text (will be URI-encoded)
 * @returns Full WhatsApp URL: https://wa.me/{digits}?text={encodedMessage}
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encodedMessage}`;
}

/**
 * Generates a contextual WhatsApp message based on page context and optional plan/simulation data.
 *
 * Message templates:
 * - Plans page with planName: "Olá! Tenho interesse no plano {planName}. Gostaria de mais informações."
 * - Simulation result: "Olá! Simulei o plano {planName} para {dependents} dependente(s), faixa {ageRange}. Preço estimado: {price}. Gostaria de contratar."
 * - Generic fallback: "Olá! Estou no site da Amacor e gostaria de mais informações."
 */
export function buildWhatsAppMessage(config: WhatsAppMessageConfig): string {
  const { pageContext, planName, simulationData } = config;

  // Simulation result context — includes plan, dependents, age range, and price
  if (simulationData && planName) {
    return `Olá! Simulei o plano ${planName} para ${simulationData.dependents} dependente(s), faixa ${simulationData.ageRange}. Preço estimado: ${simulationData.estimatedPrice}. Gostaria de contratar.`;
  }

  // Plans page or plan detail context — includes plan name
  if (planName && (pageContext === 'plans' || pageContext === 'plan-detail')) {
    return `Olá! Tenho interesse no plano ${planName}. Gostaria de mais informações.`;
  }

  // Generic fallback for any other page
  return 'Olá! Estou no site da Amacor e gostaria de mais informações.';
}
