import { Router, Request, Response, NextFunction } from 'express';
import { validateLoginInput } from './auth.validation';
import { login } from './auth.service';
import { ValidationError } from '../../middleware/errorHandler';
import { AuthenticationError, RateLimitError } from '../../middleware/errorHandler';
import posthog from '../../config/posthog';

const router = Router();

/**
 * POST /api/auth/login
 *
 * Autentica um administrador com email e senha.
 * 
 * Responses:
 * - 200: { token, usuario: { id, nome, email, perfil } }
 * - 400: Validação de campos falhou
 * - 401: Credenciais inválidas (mensagem genérica)
 * - 429: Muitas tentativas (bloqueio 15 min)
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validar input
    const validation = validateLoginInput(req.body);
    if (!validation.valid) {
      throw new ValidationError('Dados de login inválidos', validation.campos);
    }

    const { email, senha } = req.body as { email: string; senha: string };

    // Executar login
    const result = await login(email, senha);

    if (!result.success) {
      switch (result.error) {
        case 'rate_limited':
          throw new RateLimitError(15);
        case 'invalid_credentials':
        case 'inactive_user':
          throw new AuthenticationError('Credenciais inválidas');
        default:
          throw new AuthenticationError('Credenciais inválidas');
      }
    }

    // Sucesso
    const usuario = result.usuario!;
    posthog.identify({
      distinctId: usuario.id,
      properties: {
        $set: {
          nome: usuario.nome,
          perfil: usuario.perfil,
        },
      },
    });
    posthog.capture({
      distinctId: usuario.id,
      event: 'admin_logged_in',
      properties: {
        perfil: usuario.perfil,
      },
    });

    res.status(200).json({
      token: result.token,
      usuario: result.usuario,
    });
  } catch (error) {
    if (
      error instanceof RateLimitError ||
      error instanceof AuthenticationError
    ) {
      const email = req.body?.email as string | undefined;
      posthog.capture({
        distinctId: email || 'anonymous',
        event: 'admin_login_failed',
        properties: {
          failure_reason: error instanceof RateLimitError ? 'rate_limited' : 'invalid_credentials',
          $process_person_profile: false,
        },
      });
    }
    next(error);
  }
});

export default router;
