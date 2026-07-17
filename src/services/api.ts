/**
 * Serviço de integração com WebService MH Vida
 * Em desenvolvimento, o Vite proxy redireciona /api/ws para o VPS.
 * Em produção (Vercel), a serverless function /api/ws faz o proxy e injeta o token.
 */

import type { LoginResponse, LoginCredentials, CreateLoginRequest, CRMRequest, CRMData, Boleto, BoletosRequest, AlterarSenhaRequest, DadosBeneficiarioRequest, DadosBeneficiario, RedeAtendimentoRequest, PrestadorRede, ListaCRMsRequest, ProtocoloCRM } from '../types/beneficiary';
import { parseXMLResponse, parseBoletosXML, parseMultiRowXML } from '../utils/xmlParser';

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

/**
 * Monta a URL para chamar o proxy serverless.
 * Ex: buildProxyUrl('ws_Login', { Tipo: 'USR', Codigo: '123' })
 *   → '/api/ws?endpoint=ws_Login&Tipo=USR&Codigo=123'
 */
function buildProxyUrl(endpoint: string, params: Record<string, string> = {}): string {
  const searchParams = new URLSearchParams({ endpoint, ...params });
  return `/api/ws?${searchParams.toString()}`;
}

/**
 * Wrapper do fetch que injeta o token em desenvolvimento.
 * Em produção o token é injetado pela serverless function.
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
 * Decodifica o corpo da resposta respeitando o charset declarado.
 *
 * O WebService MH Vida responde em ISO-8859-1 (Latin-1), mas tanto o
 * `response.text()` do navegador quanto o proxy do Vite assumem UTF-8,
 * corrompendo os acentos. Lemos os bytes crus e decodificamos com o charset
 * correto conforme o formato do transporte.
 *
 * IMPORTANTE: quando o WebService responde embrulhado como string JSON
 * (ex.: "<?xml ...?>..."), o transporte é UTF-8 e deve ser decodificado como
 * tal — decodificar como Latin-1/Windows-1252 aí corromperia o texto
 * (transformando o caractere de substituição U+FFFD em "ï¿½").
 * Apenas o XML cru servido diretamente honra o charset declarado (ISO-8859-1).
 */
async function decodeBody(response: Response): Promise<string> {
  // Em runtime real usamos arrayBuffer para controlar o charset.
  // Alguns ambientes (ex.: mocks de teste) expõem apenas text().
  if (typeof response.arrayBuffer !== 'function') {
    return response.text();
  }

  const buffer = await response.arrayBuffer();

  // Espia os primeiros bytes como latin1 (1 byte = 1 char) para inspecionar o formato
  const preview = new TextDecoder('latin1').decode(new Uint8Array(buffer).subarray(0, 300)).trimStart();

  // Resposta embrulhada como JSON (string ou objeto de erro) => transporte UTF-8
  if (preview.startsWith('"') || preview.startsWith('{')) {
    return new TextDecoder('utf-8').decode(buffer);
  }

  // XML cru: honra o charset declarado (o WebService legado usa ISO-8859-1).
  const encMatch = preview.match(/encoding[^\w]*([\w-]+)/i);
  let charset = (encMatch?.[1] || 'utf-8').toLowerCase().trim();
  // ISO-8859-1/Latin-1 de sistemas Windows costuma ser, na prática, Windows-1252.
  if (charset === 'iso-8859-1' || charset === 'iso8859-1' || charset === 'latin1') {
    charset = 'windows-1252';
  }

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder('utf-8').decode(buffer);
  }
}

/**
 * Extrai o XML do body da resposta.
 * O proxy pode retornar o XML como string JSON ou XML direto.
 */
async function extractXML(response: Response): Promise<string> {
  const text = await decodeBody(response);

  // String JSON wrapping o XML
  if (text.startsWith('"')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'string') {
        return parsed;
      }
    } catch {
      // fallthrough
    }
  }

  // JSON de erro do proxy
  if (text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.message || parsed.error) {
        throw new Error(parsed.message || parsed.error);
      }
    } catch (err) {
      if (err instanceof Error && err.message !== text) {
        throw err;
      }
    }
  }

  return text;
}

/**
 * Acessa a tabela de todos os recursos do WebService
 * Endpoint: ws_help
 */
export async function getWebServiceHelp(): Promise<string> {
  const response = await apiFetch(buildProxyUrl('ws_help'));
  if (!response.ok) {
    throw new Error('Erro ao acessar recursos do WebService');
  }
  return response.text();
}

/**
 * Criação de login e senha para o usuário
 * Endpoint: ws_CriaLogin
 */
export async function createLogin(data: CreateLoginRequest): Promise<string> {
  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_CriaLogin', {
      Tipo: data.tipo,
      Codigo: data.codigo,
      Senha: data.senha,
    }));
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
 * Endpoint: ws_Login
 * Timeout: 15 segundos
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_Login', {
      Tipo: credentials.tipo,
      Codigo: credentials.codigo,
      Senha: credentials.senha,
    }), { signal: controller.signal });
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
 * Endpoint: ws_DadosCRM
 */
export async function getCRMData(request: CRMRequest): Promise<CRMData> {
  const response = await apiFetch(buildProxyUrl('ws_DadosCRM', {
    Parse: request.parse,
    Codigo: request.codigo,
    Tipo: request.tipo,
    Protocolo: request.protocolo,
  }));

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
 * Timeout: 10 segundos
 */
export async function getBoletos(request: BoletosRequest): Promise<Boleto[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_Boletos', {
      Parse: request.parse,
      Codigo: request.codigo,
      Tipo: 'USR',
    }), { signal: controller.signal });
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
 * Lista protocolos/solicitações do beneficiário no CRM
 * Endpoint: ws_ListaCRMs
 * Timeout: 15 segundos
 */
export async function getListaCRMs(request: ListaCRMsRequest): Promise<ProtocoloCRM[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_ListaCRMs', {
      Parse: request.parse,
      Codigo: request.codigo,
      Tipo: 'USR',
      DataIni: request.dataIni,
    }), { signal: controller.signal });
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
 * Endpoint: ws_AlterarSenha
 */
export async function alterarSenha(request: AlterarSenhaRequest): Promise<string> {
  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_AlterarSenha', {
      Tipo: request.tipo,
      Codigo: request.codigo,
      SenhaVelha: request.senhaVelha,
      SenhaNova: request.senhaNova,
    }));
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
 * Endpoint: ws_BoletosEmAberto
 * Timeout: 10 segundos
 */
export async function getBoletosEmAberto(request: BoletosRequest): Promise<Boleto[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_BoletosEmAberto', {
      Parse: request.parse,
      Codigo: request.codigo,
      Tipo: 'USR',
    }), { signal: controller.signal });
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
 * Endpoint: ws_DadosDoBeneficiario
 * Timeout: 10 segundos
 */
export async function getDadosBeneficiario(request: DadosBeneficiarioRequest): Promise<DadosBeneficiario> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_DadosDoBeneficiario', {
      Parse: request.parse,
      Codigo: request.codigo,
      Tipo: 'USR',
    }), { signal: controller.signal });
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
 * Endpoint: ws_RedeDoUsuario
 * Timeout: 15 segundos
 */
export async function getRedeDoUsuario(request: RedeAtendimentoRequest): Promise<PrestadorRede[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_RedeDoUsuario', {
      Parse: request.parse,
      Codigo: request.codigo,
      Tipo: 'USR',
    }), { signal: controller.signal });
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
 * Endpoint: ws_Boleto2aVia
 */
export async function getBoleto2aVia(request: {
  parse: string;
  codigo: string;
  codigoRec: string;
}): Promise<Record<string, string>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await apiFetch(buildProxyUrl('ws_Boleto2aVia', {
      Parse: request.parse,
      Codigo: request.codigo,
      Tipo: 'USR',
      CodigoREC: request.codigoRec,
    }), { signal: controller.signal });
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
