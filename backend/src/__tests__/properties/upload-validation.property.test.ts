// Feature: admin-login-beneficiary-auth, Property 15: Validação de upload de arquivo
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Validates: Requirements 15.1, 15.2
 *
 * Property 15: Validação de upload de arquivo
 * Para qualquer arquivo submetido como pedido médico, a validação deve aceitar
 * se e somente se: o tipo MIME é um de (application/pdf, image/jpeg, image/png)
 * e o tamanho é <= 10 MB (10.485.760 bytes). Qualquer outra combinação deve ser rejeitada.
 */

// Tipos MIME permitidos para pedido médico
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Tamanho máximo: 10MB em bytes
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10485760 bytes

/**
 * Função pura de validação de upload de arquivo.
 * Retorna true (aceito) se e somente se o tipo MIME é permitido E o tamanho <= 10MB.
 */
function validateUpload(mimeType: string, sizeBytes: number): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType) && sizeBytes >= 0 && sizeBytes <= MAX_FILE_SIZE;
}

// Arbitrary para tipos MIME válidos
const validMimeTypeArb = fc.constantFrom(...ALLOWED_MIME_TYPES);

// Arbitrary para tipos MIME inválidos (strings que NÃO estão na lista de permitidos)
const invalidMimeTypeArb = fc
  .oneof(
    fc.constantFrom(
      'application/zip',
      'application/octet-stream',
      'text/plain',
      'text/html',
      'image/gif',
      'image/bmp',
      'image/webp',
      'video/mp4',
      'audio/mpeg',
      'application/json',
      'application/xml',
      'application/msword',
      'image/svg+xml',
      'application/x-executable'
    ),
    fc.string({ minLength: 1, maxLength: 100 }).filter((s) => !ALLOWED_MIME_TYPES.includes(s))
  );

// Arbitrary para tamanhos de arquivo válidos (0 a 10MB)
const validFileSizeArb = fc.integer({ min: 0, max: MAX_FILE_SIZE });

// Arbitrary para tamanhos de arquivo inválidos (> 10MB, até ~20MB)
const invalidFileSizeArb = fc.integer({ min: MAX_FILE_SIZE + 1, max: 20 * 1024 * 1024 });

// Arbitrary para tamanhos de arquivo aleatórios (0 a 20MB)
const anyFileSizeArb = fc.integer({ min: 0, max: 20 * 1024 * 1024 });

// Arbitrary para qualquer MIME type (mix de válidos e inválidos)
const anyMimeTypeArb = fc.oneof(validMimeTypeArb, invalidMimeTypeArb);

describe('Property 15: Validação de upload de arquivo', () => {
  it('aceita se e somente se MIME é válido E tamanho <= 10MB', () => {
    fc.assert(
      fc.property(anyMimeTypeArb, anyFileSizeArb, (mimeType: string, size: number) => {
        const result = validateUpload(mimeType, size);
        const isValidMime = ALLOWED_MIME_TYPES.includes(mimeType);
        const isValidSize = size >= 0 && size <= MAX_FILE_SIZE;
        const expected = isValidMime && isValidSize;

        expect(result).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  it('rejeita qualquer arquivo com MIME inválido, independente do tamanho', () => {
    fc.assert(
      fc.property(invalidMimeTypeArb, anyFileSizeArb, (mimeType: string, size: number) => {
        const result = validateUpload(mimeType, size);
        expect(result).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('rejeita qualquer arquivo > 10MB, independente do MIME', () => {
    fc.assert(
      fc.property(anyMimeTypeArb, invalidFileSizeArb, (mimeType: string, size: number) => {
        const result = validateUpload(mimeType, size);
        expect(result).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('aceita todos os tipos MIME válidos com tamanho dentro do limite', () => {
    fc.assert(
      fc.property(validMimeTypeArb, validFileSizeArb, (mimeType: string, size: number) => {
        const result = validateUpload(mimeType, size);
        expect(result).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
