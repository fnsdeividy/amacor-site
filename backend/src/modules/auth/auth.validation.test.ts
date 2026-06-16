import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateLoginInput } from './auth.validation';

describe('auth.validation', () => {
  describe('validateEmail', () => {
    it('retorna null para email válido', () => {
      expect(validateEmail('admin@amacor.com.br')).toBeNull();
    });

    it('retorna erro para email vazio', () => {
      expect(validateEmail('')).toBe('Email é obrigatório');
    });

    it('retorna erro para email não-string', () => {
      expect(validateEmail(null)).toBe('Email é obrigatório');
      expect(validateEmail(undefined)).toBe('Email é obrigatório');
      expect(validateEmail(123)).toBe('Email é obrigatório');
    });

    it('retorna erro para email com mais de 254 caracteres', () => {
      const longEmail = 'a'.repeat(246) + '@test.com'; // 255 chars
      expect(validateEmail(longEmail)).toBe('Email deve ter no máximo 254 caracteres');
    });

    it('retorna erro para formato inválido', () => {
      expect(validateEmail('invalido')).toBe('Formato de email inválido');
      expect(validateEmail('sem@dominio')).toBe('Formato de email inválido');
      expect(validateEmail('@semlocal.com')).toBe('Formato de email inválido');
    });

    it('aceita formatos válidos', () => {
      expect(validateEmail('user@domain.com')).toBeNull();
      expect(validateEmail('user.name@domain.co')).toBeNull();
      expect(validateEmail('user+tag@domain.com.br')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('retorna null para senha válida (8-128 chars)', () => {
      expect(validatePassword('12345678')).toBeNull();
      expect(validatePassword('a'.repeat(128))).toBeNull();
    });

    it('retorna erro para senha vazia', () => {
      expect(validatePassword('')).toBe('Senha é obrigatória');
    });

    it('retorna erro para senha não-string', () => {
      expect(validatePassword(null)).toBe('Senha é obrigatória');
      expect(validatePassword(undefined)).toBe('Senha é obrigatória');
    });

    it('retorna erro para senha curta (< 8)', () => {
      expect(validatePassword('1234567')).toBe('Senha deve ter no mínimo 8 caracteres');
    });

    it('retorna erro para senha longa (> 128)', () => {
      expect(validatePassword('a'.repeat(129))).toBe('Senha deve ter no máximo 128 caracteres');
    });
  });

  describe('validateLoginInput', () => {
    it('retorna valid true para input válido', () => {
      const result = validateLoginInput({ email: 'admin@test.com', senha: '12345678' });
      expect(result.valid).toBe(true);
      expect(result.campos).toBeUndefined();
    });

    it('retorna erros para body null', () => {
      const result = validateLoginInput(null);
      expect(result.valid).toBe(false);
      expect(result.campos).toHaveProperty('email');
      expect(result.campos).toHaveProperty('senha');
    });

    it('retorna erros para ambos os campos inválidos', () => {
      const result = validateLoginInput({ email: 'invalido', senha: '123' });
      expect(result.valid).toBe(false);
      expect(result.campos?.email).toBe('Formato de email inválido');
      expect(result.campos?.senha).toBe('Senha deve ter no mínimo 8 caracteres');
    });

    it('retorna erro apenas para o campo inválido', () => {
      const result = validateLoginInput({ email: 'admin@test.com', senha: '123' });
      expect(result.valid).toBe(false);
      expect(result.campos?.email).toBeUndefined();
      expect(result.campos?.senha).toBe('Senha deve ter no mínimo 8 caracteres');
    });
  });
});
