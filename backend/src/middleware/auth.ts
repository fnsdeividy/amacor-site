import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../modules/auth/auth.service';

/**
 * Extensão do Request do Express para incluir o usuário autenticado.
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/**
 * Augmentação do tipo Request do Express para incluir campo user opcional.
 * Permite acesso a req.user em rotas protegidas sem necessidade de cast.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware de validação JWT.
 *
 * Extrai o token do header Authorization (formato "Bearer {token}"),
 * valida assinatura e expiração usando verifyToken do auth.service.
 *
 * Em caso de sucesso, anexa o payload decodificado em req.user e chama next().
 * Em caso de falha (token ausente, inválido ou expirado), retorna 401.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: 'Não autorizado' });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ erro: 'Não autorizado' });
    return;
  }

  const token = parts[1];

  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ erro: 'Não autorizado' });
    return;
  }

  req.user = payload;
  next();
}

export default authMiddleware;
