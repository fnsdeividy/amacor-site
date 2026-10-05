import { logger } from '../../utils/logger';

/**
 * Envio dos contatos da landing page (/promocao-planos) por e-mail para a triagem.
 *
 * Substitui o antigo enviar.php da LP, já que a Vercel não executa PHP.
 * Usa a API HTTP do Resend (resend.com); o domínio do remetente (mhvida.com.br)
 * precisa estar verificado lá. Configuração em backend/.env.example.
 */

export interface ContatoInput {
  nome: string;
  telefone: string;
  email: string;
  plano?: string;
  mensagem?: string;
}

export interface ContatoValidationResult {
  valid: boolean;
  message?: string;
  contato?: ContatoInput;
}

const RESEND_API_URL = 'https://api.resend.com/emails';
const MAX_CAMPO = 200;
const MAX_MENSAGEM = 2000;

function limpar(valor: unknown, max: number): string {
  if (typeof valor !== 'string') return '';
  // Remove tags HTML
  return valor.replace(/<[^>]*>/g, '').trim().slice(0, max);
}

export function validateContatoInput(body: Record<string, unknown>): ContatoValidationResult {
  // Campos usados em cabeçalhos (assunto, reply-to) não podem ter quebra de linha
  const nome = limpar(body.nome, MAX_CAMPO).replace(/[\r\n]+/g, ' ');
  const telefone = limpar(body.telefone, MAX_CAMPO).replace(/[\r\n]+/g, ' ');
  const email = limpar(body.email, 254).replace(/[\r\n]/g, '');
  const plano = limpar(body.plano, MAX_CAMPO);
  const mensagem = limpar(body.mensagem, MAX_MENSAGEM);

  if (!nome || !telefone || !email) {
    return { valid: false, message: 'Preencha nome, telefone e e-mail.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, message: 'E-mail inválido.' };
  }

  return { valid: true, contato: { nome, telefone, email, plano, mensagem } };
}

export function buildContatoEmail(contato: ContatoInput) {
  const corpo = [
    'Novo contato recebido pela landing page Promoção Planos da Amacor:',
    '',
    `Nome: ${contato.nome}`,
    `Telefone/WhatsApp: ${contato.telefone}`,
    `E-mail: ${contato.email}`,
    `Plano de interesse: ${contato.plano || '(não informado)'}`,
    'Mensagem:',
    contato.mensagem || '(não informada)',
  ].join('\n');

  return {
    from: `Site Amacor <${process.env.CONTATO_FROM || 'naoresponder@mhvida.com.br'}>`,
    to: [process.env.CONTATO_TO || 'triagem@mhvida.com.br'],
    reply_to: contato.email,
    subject: `Novo contato pelo site - ${contato.nome}`,
    text: corpo,
  };
}

export async function sendContato(contato: ContatoInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.error('contato.send', {
      result: 'failure',
      metadata: { errorMessage: 'RESEND_API_KEY não configurada' },
    });
    return false;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildContatoEmail(contato)),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      logger.error('contato.send', {
        result: 'failure',
        metadata: { status: res.status, errorMessage: await res.text() },
      });
      return false;
    }

    logger.info('contato.send', { result: 'success' });
    return true;
  } catch (err) {
    logger.error('contato.send', {
      result: 'failure',
      metadata: { errorMessage: (err as Error).message },
    });
    return false;
  }
}
