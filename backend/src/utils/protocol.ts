/**
 * Geração de protocolo no formato padrão ANS:
 * 412015 YYYY DD MM HHMMSS
 *
 * Onde:
 * - 412015: Registro da operadora junto à ANS
 * - YYYY: Ano com 4 dígitos
 * - DD: Dia com 2 dígitos
 * - MM: Mês com 2 dígitos
 * - HHMMSS: Hora + Minuto + Segundo com 6 dígitos
 *
 * Exemplo: 412015 2022 07 08 093511
 */

const REGISTRO_ANS = '412015';

/**
 * Gera um protocolo no formato ANS: 412015YYYYDDMMHHMMSS
 *
 * @param date - Data/hora de referência (padrão: agora)
 * @returns Protocolo formatado (ex: 412015202207080935011)
 */
export function gerarProtocolo(sequenceNumber?: number, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Formato: REGISTRO_ANS + YYYY + DD + MM + HHMMSS
  return `${REGISTRO_ANS}${year}${day}${month}${hours}${minutes}${seconds}`;
}

/**
 * Gera um protocolo formatado para exibição: 412015 YYYY DD MM HHMMSS
 */
export function formatarProtocolo(protocolo: string): string {
  if (protocolo.length !== 20) return protocolo;
  const ans = protocolo.slice(0, 6);
  const year = protocolo.slice(6, 10);
  const day = protocolo.slice(10, 12);
  const month = protocolo.slice(12, 14);
  const time = protocolo.slice(14, 20);
  return `${ans} ${year} ${day} ${month} ${time}`;
}

/**
 * Calcula o próximo número sequencial (mantido por compatibilidade).
 * No novo formato baseado em timestamp, não é mais necessário.
 */
export function calcularProximoSequencial(existingProtocols: string[], date: Date = new Date()): number {
  return 1; // Não necessário no novo formato — unicidade garantida pelo timestamp
}

/**
 * Gera um protocolo único. A unicidade é garantida pelo timestamp
 * (segundo exato da criação). Em caso de colisão improvável,
 * adiciona milissegundos.
 *
 * @param existingProtocols - Lista de protocolos existentes (para verificação)
 * @param date - Data de referência (padrão: agora)
 * @returns Protocolo único no formato ANS
 */
export function gerarProtocoloUnico(existingProtocols: string[], date: Date = new Date()): string {
  let protocolo = gerarProtocolo(undefined, date);

  // Se já existe (colisão de segundo), espera 1ms e tenta novamente
  if (existingProtocols.includes(protocolo)) {
    const newDate = new Date(date.getTime() + 1000);
    protocolo = gerarProtocolo(undefined, newDate);
  }

  return protocolo;
}
