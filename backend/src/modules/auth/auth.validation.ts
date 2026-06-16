/**
 * Validação de inputs para o módulo de autenticação administrativa.
 * 
 * - Email: máximo 254 caracteres, formato válido (RFC 5322 simplificado)
 * - Senha: 8 a 128 caracteres
 */

export interface LoginInput {
  email: string;
  senha: string;
}

export interface ValidationResult {
  valid: boolean;
  campos?: Record<string, string>;
}

/**
 * Valida formato de email conforme RFC 5322 simplificado.
 * Máximo de 254 caracteres (limite do padrão SMTP).
 */
export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string' || email.trim().length === 0) {
    return 'Email é obrigatório';
  }

  if (email.length > 254) {
    return 'Email deve ter no máximo 254 caracteres';
  }

  // RFC 5322 simplified: local@domain
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Formato de email inválido';
  }

  return null;
}

/**
 * Valida senha: entre 8 e 128 caracteres.
 */
export function validatePassword(senha: unknown): string | null {
  if (typeof senha !== 'string' || senha.length === 0) {
    return 'Senha é obrigatória';
  }

  if (senha.length < 8) {
    return 'Senha deve ter no mínimo 8 caracteres';
  }

  if (senha.length > 128) {
    return 'Senha deve ter no máximo 128 caracteres';
  }

  return null;
}

/**
 * Valida os inputs de login (email e senha).
 * Retorna objeto com `valid: true` se ambos são válidos,
 * ou `valid: false` com detalhes dos campos inválidos.
 */
export function validateLoginInput(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      campos: { email: 'Email é obrigatório', senha: 'Senha é obrigatória' },
    };
  }

  const { email, senha } = body as Record<string, unknown>;
  const campos: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) {
    campos.email = emailError;
  }

  const passwordError = validatePassword(senha);
  if (passwordError) {
    campos.senha = passwordError;
  }

  if (Object.keys(campos).length > 0) {
    return { valid: false, campos };
  }

  return { valid: true };
}
