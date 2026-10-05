import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { validateContatoInput, sendContato } from './contato.service';

const router = Router();

// O formulário da LP envia multipart/form-data (FormData), sem arquivos
const parseForm = multer().none();

/**
 * IP real do visitante. A requisição chega via Vercel (rewrite /api) → proxy do
 * Render, então req.ip é o IP do proxy e todos os visitantes dividiriam o mesmo
 * limite. A Vercel sobrescreve o X-Forwarded-For com o IP do cliente, e os
 * proxies seguintes só acrescentam à direita, então o primeiro valor é o cliente.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const primeiro = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return primeiro || req.ip || req.socket.remoteAddress || 'unknown';
}

// Limite mais apertado que o público geral: evita spam no e-mail da triagem
const contatoRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente mais tarde ou fale no WhatsApp.',
  },
  keyGenerator: (req) => clientIp(req),
  validate: { trustProxy: false },
});

/**
 * POST /api/contato
 *
 * Recebe o formulário de contato da landing page /promocao-planos.
 * Responde no formato esperado pelo js/main.js da LP: { success, message }.
 *
 * Responses:
 * - 200: { success: true, message }
 * - 400: { success: false, message } (validação)
 * - 502: { success: false, message } (falha no envio pelo Resend)
 */
router.post(
  '/',
  contatoRateLimiter,
  parseForm,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = (req.body || {}) as Record<string, unknown>;

      // Honeypot: campo invisível que só um robô preencheria
      if (typeof body.website === 'string' && body.website.trim() !== '') {
        res.status(200).json({ success: true, message: 'Recebido.' });
        return;
      }

      const validation = validateContatoInput(body);
      if (!validation.valid || !validation.contato) {
        res.status(400).json({ success: false, message: validation.message });
        return;
      }

      const enviado = await sendContato(validation.contato);
      if (!enviado) {
        res.status(502).json({
          success: false,
          message: 'Não foi possível enviar agora. Tente novamente ou fale no WhatsApp.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Mensagem enviada! Nossa equipe entra em contato em breve.',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
