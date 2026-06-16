import { Router, Request, Response, NextFunction } from 'express';
import { validateLoginInput } from './auth.validation';
import { login } from './auth.service';
import { ValidationError } from '../../middleware/errorHandler';
import { AuthenticationError, RateLimitError } from '../../middleware/errorHandler';

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
    res.status(200).json({
      token: result.token,
      usuario: result.usuario,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
