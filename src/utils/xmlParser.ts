import type { Boleto } from '../types/beneficiary';

/**
 * Parseia uma resposta XML do CRM WebService e extrai pares chave-valor
 * dos elementos filhos do primeiro elemento <row>.
 *
 * @throws Error('Erro ao processar resposta do servidor') se XML inválido (parsererror)
 * @throws Error('Resposta inválida do servidor') se <row> ausente
 */
export function parseXMLResponse(xmlString: string): Record<string, string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('Erro ao processar resposta do servidor');
  }

  const row = doc.querySelector('row');
  if (!row) {
    throw new Error('Resposta inválida do servidor');
  }

  const result: Record<string, string> = {};
  for (let i = 0; i < row.children.length; i++) {
    const child = row.children[i];
    result[child.tagName] = child.textContent || '';
  }

  return result;
}

/**
 * Parseia uma resposta XML de boletos do CRM WebService.
 * Extrai um array de boletos a partir de múltiplos elementos <row>.
 *
 * @throws Error('Erro ao processar resposta do servidor') se XML inválido (parsererror)
 * @returns Array vazio se nenhum <row> encontrado
 */
export function parseBoletosXML(xmlString: string): Boleto[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('Erro ao processar resposta do servidor');
  }

  const rows = doc.querySelectorAll('row');
  if (rows.length === 0) {
    return [];
  }

  const boletos: Boleto[] = [];

  rows.forEach((row) => {
    const fields: Record<string, string> = {};
    for (let i = 0; i < row.children.length; i++) {
      const child = row.children[i];
      fields[child.tagName] = child.textContent || '';
    }

    const vencimentoRaw = fields['Vencimento'] || '';
    const valorStr = fields['Valor'] || fields['Saldo'] || '0';
    const pdfUrl = fields['LinkPDF'] || fields['Link'] || '';
    const parcela = fields['Parcela'] || '';
    const codigoRec = fields['CodigoREC'] || '';

    // Parsear valor substituindo vírgula por ponto antes da conversão
    const valor = parseFloat(valorStr.replace(',', '.')) || 0;

    // Formatar data de vencimento: YYYY-MM-DD → DD/MM/AAAA
    const vencimento = formatarDataBoleto(vencimentoRaw);

    // Calcular status comparando data de vencimento com hoje
    const status = calcularStatusBoleto(vencimentoRaw);

    boletos.push({
      vencimento,
      valor,
      status,
      pdfUrl: pdfUrl || '',
      parcela,
      codigoRec: codigoRec || undefined,
    });
  });

  return boletos;
}

/**
 * Converte data YYYY-MM-DD para DD/MM/AAAA.
 * Se já estiver em DD/MM/AAAA ou formato desconhecido, retorna como está.
 */
function formatarDataBoleto(data: string): string {
  // Formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  return data;
}

/**
 * Calcula o status do boleto comparando a data de vencimento com a data atual.
 * Aceita formatos: DD/MM/AAAA ou YYYY-MM-DD
 *
 * @returns 'vencido' se vencimento < hoje, 'a vencer' se vencimento >= hoje
 */
function calcularStatusBoleto(vencimento: string): 'vencido' | 'a vencer' {
  let dataVencimento: Date;

  // Formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(vencimento)) {
    const [ano, mes, dia] = vencimento.split('-');
    dataVencimento = new Date(parseInt(ano, 10), parseInt(mes, 10) - 1, parseInt(dia, 10));
  } else {
    // Formato DD/MM/AAAA
    const parts = vencimento.split('/');
    if (parts.length !== 3) {
      return 'vencido';
    }
    const [dia, mes, ano] = parts;
    dataVencimento = new Date(parseInt(ano, 10), parseInt(mes, 10) - 1, parseInt(dia, 10));
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return dataVencimento < hoje ? 'vencido' : 'a vencer';
}

/**
 * Parseia uma resposta XML com múltiplos elementos <row> e retorna um array
 * de objetos chave-valor. Usado para ListaCRMs e RedeDoUsuario.
 *
 * @throws Error('Erro ao processar resposta do servidor') se XML inválido (parsererror)
 * @returns Array vazio se nenhum <row> encontrado
 */
export function parseMultiRowXML(xmlString: string): Record<string, string>[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('Erro ao processar resposta do servidor');
  }

  const rows = doc.querySelectorAll('row');
  if (rows.length === 0) {
    return [];
  }

  const results: Record<string, string>[] = [];

  rows.forEach((row) => {
    const item: Record<string, string> = {};
    for (let i = 0; i < row.children.length; i++) {
      const child = row.children[i];
      item[child.tagName] = child.textContent || '';
    }
    results.push(item);
  });

  return results;
}
