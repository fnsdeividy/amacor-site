import { logger } from '../../utils/logger';

/**
 * Resultado da consulta de status por protocolo (ws_DadosCRM).
 */
export interface ConsultaStatusResult {
  success: boolean;
  status?: string;
  dados?: Record<string, unknown>;
  error?: 'timeout' | 'communication_error' | 'not_found';
  message?: string;
}

/**
 * Item retornado na listagem de CRMs.
 */
export interface CrmSolicitacaoItem {
  protocolo: string;
  status: string;
  data: string;
  [key: string]: unknown;
}

/**
 * Resultado da listagem de solicitações CRM (ws_ListaCRMs).
 */
export interface ListaCrmsResult {
  success: boolean;
  solicitacoes?: CrmSolicitacaoItem[];
  error?: 'timeout' | 'communication_error' | 'invalid_interval';
  message?: string;
}

const WS_DADOS_CRM_TIMEOUT = 10_000; // 10 segundos
const WS_LISTA_CRMS_TIMEOUT = 15_000; // 15 segundos
const MAX_INTERVAL_DAYS = 90;

/**
 * Retorna a URL base do CRM a partir da variável de ambiente.
 */
function getCrmBaseUrl(): string {
  const url = process.env.CRM_BASE_URL;
  if (!url) {
    throw new Error('CRM_BASE_URL não configurada');
  }
  // Remove trailing slash se houver
  return url.replace(/\/+$/, '');
}

/**
 * Calcula a diferença em dias entre duas datas (ignora horário).
 */
function diffInDays(dateA: Date, dateB: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utcA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const utcB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  return Math.abs(utcA - utcB) / msPerDay;
}

/**
 * Consulta o status de uma solicitação no CRM utilizando o protocolo gerado pelo site.
 *
 * Endpoint: ws_DadosCRM
 * Parâmetros: Parse, Codigo, Tipo=USR, Protocolo
 * Timeout: 10 segundos
 *
 * Comportamento de erro:
 * - HTTP 404: solicitação ainda não cadastrada no CRM → retorna not_found
 * - Timeout ou erro de comunicação: mantém status atual → retorna erro
 * - HTTP 200 com status válido: retorna status do CRM
 */
export async function consultarStatusPorProtocolo(
  parse: string,
  codigo: string,
  protocolo: string
): Promise<ConsultaStatusResult> {
  const baseUrl = getCrmBaseUrl();
  const url = `${baseUrl}/ws_DadosCRM`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WS_DADOS_CRM_TIMEOUT);

  try {
    const params = new URLSearchParams({
      Parse: parse,
      Codigo: codigo,
      Tipo: 'USR',
      Protocolo: protocolo,
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      logger.info('crm.consultarStatus', {
        result: 'success',
        metadata: { protocolo, statusCrm: 'not_found' },
      });

      return {
        success: true,
        error: 'not_found',
        message: 'Solicitação ainda não cadastrada no CRM',
      };
    }

    if (!response.ok) {
      logger.error('crm.consultarStatus', {
        result: 'failure',
        metadata: { protocolo, httpStatus: response.status },
      });

      return {
        success: false,
        error: 'communication_error',
        message: `Erro na comunicação com o CRM (HTTP ${response.status})`,
      };
    }

    const data = await response.json();

    logger.info('crm.consultarStatus', {
      result: 'success',
      metadata: { protocolo, statusCrm: data.Status || data.status },
    });

    return {
      success: true,
      status: data.Status || data.status,
      dados: data,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('crm.consultarStatus', {
        result: 'failure',
        metadata: { protocolo, reason: 'timeout', timeoutMs: WS_DADOS_CRM_TIMEOUT },
      });

      return {
        success: false,
        error: 'timeout',
        message: `Timeout ao consultar CRM (${WS_DADOS_CRM_TIMEOUT / 1000}s)`,
      };
    }

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    logger.error('crm.consultarStatus', {
      result: 'failure',
      metadata: { protocolo, reason: 'communication_error', error: errorMessage },
    });

    return {
      success: false,
      error: 'communication_error',
      message: 'Falha na comunicação com o CRM',
    };
  }
}

/**
 * Lista solicitações CRM de um beneficiário em um período.
 *
 * Endpoint: ws_ListaCRMs
 * Parâmetros: Parse, Codigo, Tipo=USR, DataIni, DataFim
 * Timeout: 15 segundos
 * Restrição: intervalo máximo de 90 dias entre DataIni e DataFim
 *
 * Comportamento de erro:
 * - Intervalo > 90 dias: rejeitado localmente antes de chamar o CRM
 * - Timeout ou erro de comunicação: retorna erro
 * - HTTP 200: retorna lista de solicitações
 */
export async function listarSolicitacoesCrm(
  parse: string,
  codigo: string,
  dataIni: string,
  dataFim: string
): Promise<ListaCrmsResult> {
  // Validar intervalo de datas antes de chamar o CRM
  const dateIni = new Date(dataIni);
  const dateFim = new Date(dataFim);

  if (isNaN(dateIni.getTime()) || isNaN(dateFim.getTime())) {
    return {
      success: false,
      error: 'invalid_interval',
      message: 'Datas informadas são inválidas',
    };
  }

  if (dateFim < dateIni) {
    return {
      success: false,
      error: 'invalid_interval',
      message: 'Data final não pode ser anterior à data inicial',
    };
  }

  const interval = diffInDays(dateIni, dateFim);
  if (interval > MAX_INTERVAL_DAYS) {
    return {
      success: false,
      error: 'invalid_interval',
      message: `Intervalo máximo permitido é de ${MAX_INTERVAL_DAYS} dias (informado: ${Math.ceil(interval)} dias)`,
    };
  }

  const baseUrl = getCrmBaseUrl();
  const url = `${baseUrl}/ws_ListaCRMs`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WS_LISTA_CRMS_TIMEOUT);

  try {
    const params = new URLSearchParams({
      Parse: parse,
      Codigo: codigo,
      Tipo: 'USR',
      DataIni: dataIni,
      DataFim: dataFim,
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error('crm.listarSolicitacoes', {
        result: 'failure',
        metadata: { codigo, httpStatus: response.status, dataIni, dataFim },
      });

      return {
        success: false,
        error: 'communication_error',
        message: `Erro na comunicação com o CRM (HTTP ${response.status})`,
      };
    }

    const data = await response.json();

    // O CRM pode retornar um array ou um objeto com array
    const solicitacoes: CrmSolicitacaoItem[] = Array.isArray(data)
      ? data
      : (data.solicitacoes || data.Solicitacoes || []);

    logger.info('crm.listarSolicitacoes', {
      result: 'success',
      metadata: { codigo, dataIni, dataFim, count: solicitacoes.length },
    });

    return {
      success: true,
      solicitacoes,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('crm.listarSolicitacoes', {
        result: 'failure',
        metadata: { codigo, reason: 'timeout', timeoutMs: WS_LISTA_CRMS_TIMEOUT, dataIni, dataFim },
      });

      return {
        success: false,
        error: 'timeout',
        message: `Timeout ao consultar CRM (${WS_LISTA_CRMS_TIMEOUT / 1000}s)`,
      };
    }

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    logger.error('crm.listarSolicitacoes', {
      result: 'failure',
      metadata: { codigo, reason: 'communication_error', error: errorMessage, dataIni, dataFim },
    });

    return {
      success: false,
      error: 'communication_error',
      message: 'Falha na comunicação com o CRM',
    };
  }
}
