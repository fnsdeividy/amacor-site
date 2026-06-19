/**
 * Serviço de integração com WebService MH Vida
 * Em desenvolvimento, as requisições são proxied pelo Vite dev server.
 * Em produção, usa a URL configurada em VITE_CRM_BASE_URL ou o proxy do backend.
 */

import type { LoginResponse, LoginCredentials, CreateLoginRequest, CRMRequest, CRMData, Boleto, BoletosRequest, AlterarSenhaRequest, DadosBeneficiarioRequest, DadosBeneficiario, RedeAtendimentoRequest, PrestadorRede, ListaCRMsRequest, ProtocoloCRM } from '../types/beneficiary';
import { parseXMLResponse, parseBoletosXML, parseMultiRowXML } from '../utils/xmlParser';

/**
 * Em desenvolvimento, usa path relativo para o proxy do Vite redirecionar e evitar CORS.
 * Em produção, usa a URL completa configurada em VITE_API_URL.
 */
const BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://api.amacor.cloud/webservice').replace(/\/$/, '')
  : '';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

/**
 * Wrapper do fetch que injeta o token de autenticação da API (se configurado)
 */
function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (API_TOKEN) {
    headers['x-internal-token'] = API_TOKEN;
  }
  return fetch(url, { ...options, headers });
}

/**
 * Extrai o XML do body da resposta.
 * O proxy do VPS retorna Content-Type: application/json com o XML como string JSON,
 * ou pode retornar um JSON de erro com { message, detail }.
 */
async function extractXML(response: Response): Promise<string> {
  const text = await response.text();

  // Se começa com aspas, é uma string JSON wrapping o XML
  if (text.startsWith('"')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'string') {
        return parsed;
      }
    } catch {
      // Se falhar o parse JSON, tenta usar como está
    }
  }

  // Se começa com {, pode ser um JSON de erro do proxy
  if (text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.message) {
        throw new Error(parsed.message);
      }
    } catch (err) {
      if (err instanceof Error && err.message !== text) {
        throw err;
      }
    }
  }

  // XML direto
  return text;
}

/**
 * Acessa a tabela de todos os recursos do WebService
 * Endpoint: /ws_help
 */
export async function getWebServiceHelp(): Promise<string> {
  const response = await apiFetch(`${BASE_URL}/ws_help`);
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
    response = await apiFetch(`${BASE_URL}/ws_CriaLogin?${params.toString()}`);
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
    response = await apiFetch(`${BASE_URL}/ws_Login?${params.toString()}`, {
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

  const xmlText = await extractXML(response);
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

  const response = await apiFetch(`${BASE_URL}/ws_DadosCRM?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Erro ao consultar dados do CRM. Verifique o protocolo informado.');
  }

  const xmlText = await extractXML(response);
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
    response = await apiFetch(`${BASE_URL}/ws_Boletos?${params.toString()}`, {
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

  const xmlText = await extractXML(response);
  const boletos = parseBoletosXML(xmlText);
  return boletos;
}


/**
 * Lista protocolos/solicitações do beneficiário no CRM
 * Endpoint: /ws_ListaCRMs
 * Timeout: 15 segundos
 */
export async function getListaCRMs(request: ListaCRMsRequest): Promise<ProtocoloCRM[]> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: 'USR',
    DataIni: request.dataIni,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(`${BASE_URL}/ws_ListaCRMs?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Não foi possível consultar os protocolos. Tente novamente.');
    }
    throw new Error('Não foi possível consultar os protocolos. Tente novamente.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error('Não foi possível consultar os protocolos. Tente novamente.');
  }

  const xmlText = await extractXML(response);
  return parseMultiRowXML(xmlText);
}

/**
 * Altera a senha do beneficiário
 * Endpoint: /ws_AlterarSenha
 */
export async function alterarSenha(request: AlterarSenhaRequest): Promise<string> {
  const params = new URLSearchParams({
    Tipo: request.tipo,
    Codigo: request.codigo,
    SenhaVelha: request.senhaVelha,
    SenhaNova: request.senhaNova,
  });

  let response: Response;
  try {
    response = await apiFetch(`${BASE_URL}/ws_AlterarSenha?${params.toString()}`);
  } catch {
    throw new Error('Não foi possível alterar a senha. Tente novamente.');
  }

  if (!response.ok) {
    throw new Error('Não foi possível alterar a senha. Verifique a senha atual.');
  }

  return response.text();
}

/**
 * Retorna boletos em aberto do beneficiário (2ª via)
 * Endpoint: /ws_BoletosEmAberto
 * Timeout: 10 segundos
 */
export async function getBoletosEmAberto(request: BoletosRequest): Promise<Boleto[]> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: 'USR',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await apiFetch(`${BASE_URL}/ws_BoletosEmAberto?${params.toString()}`, {
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

  const xmlText = await extractXML(response);
  return parseBoletosXML(xmlText);
}

/**
 * Retorna dados do beneficiário
 * Endpoint: /ws_DadosDoBeneficiario
 * Timeout: 10 segundos
 */
export async function getDadosBeneficiario(request: DadosBeneficiarioRequest): Promise<DadosBeneficiario> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: 'USR',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await apiFetch(`${BASE_URL}/ws_DadosDoBeneficiario?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Não foi possível consultar seus dados. Tente novamente.');
    }
    throw new Error('Não foi possível consultar seus dados. Tente novamente.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error('Não foi possível consultar seus dados. Tente novamente.');
  }

  const xmlText = await extractXML(response);
  return parseXMLResponse(xmlText);
}

/**
 * Retorna a rede de atendimento do beneficiário
 * Endpoint: /ws_RedeDoUsuario
 * Timeout: 15 segundos
 */
export async function getRedeDoUsuario(request: RedeAtendimentoRequest): Promise<PrestadorRede[]> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: 'USR',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(`${BASE_URL}/ws_RedeDoUsuario?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Não foi possível consultar a rede de atendimento. Tente novamente.');
    }
    throw new Error('Não foi possível consultar a rede de atendimento. Tente novamente.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error('Não foi possível consultar a rede de atendimento. Tente novamente.');
  }

  const xmlText = await extractXML(response);
  return parseMultiRowXML(xmlText);
}


/**
 * Gera a 2ª via do boleto
 * Endpoint: /ws_Boleto2aVia
 * Retorna dados do boleto (link ou dados para emissão)
 */
export async function getBoleto2aVia(request: {
  parse: string;
  codigo: string;
  codigoRec: string;
}): Promise<Record<string, string>> {
  const params = new URLSearchParams({
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: 'USR',
    CodigoREC: request.codigoRec,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(`${BASE_URL}/ws_Boleto2aVia?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Não foi possível gerar a 2ª via. Tente novamente.');
    }
    throw new Error('Não foi possível gerar a 2ª via. Tente novamente.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error('Não foi possível gerar a 2ª via do boleto.');
  }

  const xmlText = await extractXML(response);
  return parseXMLResponse(xmlText);
}
