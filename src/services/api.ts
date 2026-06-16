/**
 * Serviço de integração com WebService MH Vida
 * Base URL: http://mhvida.startiss.com.br:83
 */

import type { LoginResponse, LoginCredentials, CreateLoginRequest, CRMRequest, CRMData, Boleto, BoletosRequest } from '../types/beneficiary';

const BASE_URL = 'http://mhvida.startiss.com.br:83';

/**
 * Faz o parse de XML retornado pelo WebService para objeto JavaScript
 */
function parseXMLResponse(xmlString: string): Record<string, string> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Erro ao processar resposta do servidor');
  }

  const row = xmlDoc.querySelector('row');
  if (!row) {
    throw new Error('Resposta inválida do servidor');
  }

  const result: Record<string, string> = {};
  for (const child of Array.from(row.children)) {
    result[child.tagName] = child.textContent || '';
  }

  return result;
}

/**
 * Acessa a tabela de todos os recursos do WebService
 * Endpoint: /ws_help
 */
export async function getWebServiceHelp(): Promise<string> {
  const response = await fetch(`${BASE_URL}/ws_help`);
  if (!response.ok) {
    throw new Error('Erro ao acessar recursos do WebService');
  }
  return response.text();
}

/**
 * Criação de login e senha para o usuário
 * Endpoint: /ws_CriaLogin
 * O campo Código é a matrícula do beneficiário
 */
export async function createLogin(data: CreateLoginRequest): Promise<string> {
  const params = new URLSearchParams({
    Tipo: data.tipo,
    Codigo: data.codigo,
    Senha: data.senha,
  });

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/ws_CriaLogin?${params.toString()}`);
  } catch {
    throw new Error('Não foi possível completar o cadastro. Tente novamente.');
  }

  if (!response.ok) {
    throw new Error('Dados não localizados no sistema');
  }

  return response.text();
}

/**
 * Acessa login com associação de um parse
 * Endpoint: /ws_Login
 * Retorna o parse que é utilizado como permissão para acessar informações do beneficiário
 * Timeout: 15 segundos
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const params = new URLSearchParams({
    Tipo: credentials.tipo,
    Codigo: credentials.codigo,
    Senha: credentials.senha,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/ws_Login?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Serviço temporariamente indisponível. Tente novamente.');
    }
    throw new Error('Serviço temporariamente indisponível. Tente novamente.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error('Serviço temporariamente indisponível. Tente novamente.');
  }

  const xmlText = await response.text();
  const data = parseXMLResponse(xmlText);

  if (!data.Parse || !data.Codigo) {
    throw new Error('Credenciais inválidas');
  }

  return {
    parse: data.Parse,
    codigo: data.Codigo,
    nome: data.Nome || '',
    cpfCnpj: data.CpfCnpj || '',
  };
}

/**
 * Retorna dados do CRM vinculado ao protocolo informado
 * Endpoint: /ws_DadosCRM
 * Parse = Código obtido ao fazer o login (Obrigatório)
 * Codigo = Código do Beneficiário (Obrigatório)
 * Tipo = USR (Obrigatório)
 * Protocolo = Protocolo para buscar dados no CRM
 */
export async function getCRMData(request: CRMRequest): Promise<CRMData> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: request.tipo,
    Protocolo: request.protocolo,
  });

  const response = await fetch(`${BASE_URL}/ws_DadosCRM?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Erro ao consultar dados do CRM. Verifique o protocolo informado.');
  }

  const xmlText = await response.text();
  const data = parseXMLResponse(xmlText);

  return {
    protocolo: request.protocolo,
    ...data,
  };
}


/**
 * Retorna a lista de boletos disponíveis para o beneficiário
 * Consulta o CRM utilizando Parse e Codigo
 * Timeout: 10 segundos (conforme requisito 14.1)
 */
export async function getBoletos(request: BoletosRequest): Promise<Boleto[]> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: 'USR',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/ws_Boletos?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Não foi possível consultar os boletos. Tente novamente.');
    }
    throw new Error('Não foi possível consultar os boletos. Tente novamente.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error('Não foi possível consultar os boletos. Tente novamente.');
  }

  const xmlText = await response.text();
  const boletos = parseBoletosXML(xmlText);
  return boletos;
}

/**
 * Faz o parse de XML contendo lista de boletos retornada pelo WebService
 */
function parseBoletosXML(xmlString: string): Boleto[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Erro ao processar resposta do servidor');
  }

  const rows = xmlDoc.querySelectorAll('row');
  if (!rows || rows.length === 0) {
    return [];
  }

  const boletos: Boleto[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const row of Array.from(rows)) {
    const vencimentoRaw = row.querySelector('Vencimento')?.textContent || '';
    const valorRaw = row.querySelector('Valor')?.textContent || '0';
    const pdfUrl = row.querySelector('LinkPDF')?.textContent || row.querySelector('Link')?.textContent || '';

    // Parse vencimento to determine status
    const [day, month, year] = vencimentoRaw.split('/').map(Number);
    const vencimentoDate = new Date(year, month - 1, day);
    const status: 'vencido' | 'a vencer' = vencimentoDate < today ? 'vencido' : 'a vencer';

    // Parse valor (pode vir como "1234.56" ou "1234,56")
    const valor = parseFloat(valorRaw.replace(',', '.')) || 0;

    boletos.push({
      vencimento: vencimentoRaw,
      valor,
      status,
      pdfUrl,
    });
  }

  return boletos;
}
