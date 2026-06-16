import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { query } from '../../config/database';
import { logger } from '../../utils/logger';

/**
 * Interface para o usuário admin retornado pelo banco.
 */
interface AdminUserRow {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: 'admin' | 'operador';
  status: 'ativo' | 'inativo';
  tentativas_login_falhas: number;
  bloqueado_ate: Date | null;
}

/**
 * Dados públicos do usuário retornados no login.
 */
export interface AdminUserPublic {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'operador';
}

/**
 * Resultado do login.
 */
export interface LoginResult {
  success: boolean;
  token?: string;
  usuario?: AdminUserPublic;
  error?: 'invalid_credentials' | 'rate_limited' | 'inactive_user';
}

/**
 * Payload do JWT.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  perfil: 'admin' | 'operador';
  nome: string;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Busca um usuário admin pelo email.
 */
async function findUserByEmail(email: string): Promise<AdminUserRow | null> {
  const result = await query<AdminUserRow>(
    'SELECT id, nome, email, senha_hash, perfil, status, tentativas_login_falhas, bloqueado_ate FROM admin_users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * Verifica se o usuário está bloqueado por tentativas falhas.
 */
function isUserLocked(user: AdminUserRow): boolean {
  if (!user.bloqueado_ate) {
    return false;
  }

  const now = new Date();
  return now < new Date(user.bloqueado_ate);
}

/**
 * Incrementa o contador de tentativas falhas.
 * Se atingir o limite, bloqueia o usuário por 15 minutos.
 */
async function recordFailedAttempt(user: AdminUserRow): Promise<void> {
  const newAttempts = user.tentativas_login_falhas + 1;

  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    await query(
      'UPDATE admin_users SET tentativas_login_falhas = $1, bloqueado_ate = $2, atualizado_em = NOW() WHERE id = $3',
      [newAttempts, lockUntil.toISOString(), user.id]
    );
  } else {
    await query(
      'UPDATE admin_users SET tentativas_login_falhas = $1, atualizado_em = NOW() WHERE id = $2',
      [newAttempts, user.id]
    );
  }
}

/**
 * Reseta o contador de tentativas falhas após login bem-sucedido.
 */
async function resetFailedAttempts(userId: string): Promise<void> {
  await query(
    'UPDATE admin_users SET tentativas_login_falhas = 0, bloqueado_ate = NULL, atualizado_em = NOW() WHERE id = $1',
    [userId]
  );
}

/**
 * Gera um token JWT para o usuário.
 * Usa HS256, segredo do env JWT_SECRET, expiração do env JWT_EXPIRATION (padrão 8h).
 */
export function generateToken(user: AdminUserPublic): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  }

  const expiresIn = process.env.JWT_EXPIRATION || '8h';

  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    perfil: user.perfil,
    nome: user.nome,
  };

  const signOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiresIn as unknown as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, signOptions);
}

/**
 * Verifica e decodifica um token JWT.
 * Retorna o payload se válido, null se inválido/expirado.
 */
export function verifyToken(token: string): JwtPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Executa o fluxo de login administrativo.
 *
 * 1. Busca o usuário por email
 * 2. Verifica se está bloqueado (rate limit)
 * 3. Compara senha com bcrypt (tempo constante)
 * 4. Gera JWT em caso de sucesso
 * 5. Registra tentativa falha em caso de erro
 */
export async function login(email: string, senha: string): Promise<LoginResult> {
  const normalizedEmail = email.toLowerCase();

  // 1. Buscar usuário
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    // Comparação fictícia para manter tempo constante mesmo quando o usuário não existe
    // Isso previne ataques de timing que poderiam revelar se um email está cadastrado
    await bcrypt.compare(senha, '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

    logger.warn('auth.login', {
      userId: normalizedEmail,
      result: 'failure',
      metadata: { reason: 'user_not_found' },
    });

    return { success: false, error: 'invalid_credentials' };
  }

  // 2. Verificar bloqueio
  if (isUserLocked(user)) {
    logger.warn('auth.login', {
      userId: user.id,
      result: 'failure',
      metadata: { reason: 'account_locked', email: normalizedEmail },
    });

    return { success: false, error: 'rate_limited' };
  }

  // 3. Verificar status do usuário
  if (user.status !== 'ativo') {
    logger.warn('auth.login', {
      userId: user.id,
      result: 'failure',
      metadata: { reason: 'inactive_user', email: normalizedEmail },
    });

    return { success: false, error: 'inactive_user' };
  }

  // 4. Comparar senha (bcrypt.compare é constant-time por design)
  const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);

  if (!isPasswordValid) {
    await recordFailedAttempt(user);

    logger.warn('auth.login', {
      userId: user.id,
      result: 'failure',
      metadata: { reason: 'invalid_password', email: normalizedEmail, attempts: user.tentativas_login_falhas + 1 },
    });

    return { success: false, error: 'invalid_credentials' };
  }

  // 5. Login bem-sucedido
  await resetFailedAttempts(user.id);

  const usuario: AdminUserPublic = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.perfil,
  };

  const token = generateToken(usuario);

  logger.info('auth.login', {
    userId: user.id,
    result: 'success',
    metadata: { email: normalizedEmail, perfil: user.perfil },
  });

  return { success: true, token, usuario };
}
