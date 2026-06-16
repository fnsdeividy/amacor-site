/**
 * Geração de protocolo no formato AMC-YYYYMMDD-NNNNN.
 *
 * O protocolo é gerado no momento da criação de uma solicitação.
 * O número sequencial é fornecido pelo chamador (obtido via SERIAL do PostgreSQL).
 */

/**
 * Gera um protocolo no formato AMC-YYYYMMDD-NNNNN.
 *
 * @param sequenceNumber - Número sequencial (obtido do banco de dados)
 * @param date - Data de referência (padrão: data atual)
 * @returns Protocolo formatado (ex: AMC-20250115-00042)
 */
export function gerarProtocolo(sequenceNumber: number, date: Date = new Date()): string {
  if (!Number.isInteger(sequenceNumber) || sequenceNumber < 1) {
    throw new Error('O número sequencial deve ser um inteiro positivo');
  }

  if (sequenceNumber > 99999) {
    throw new Error('O número sequencial não pode exceder 99999');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const datePart = `${year}${month}${day}`;
  const sequencePart = String(sequenceNumber).padStart(5, '0');

  return `AMC-${datePart}-${sequencePart}`;
}
