import { SolicitacaoStatus } from '../../types/index';
import { AppError } from '../../middleware/errorHandler';

/**
 * Mapa de transições válidas entre status de solicitação.
 *
 * Cada chave é um status atual e o valor é a lista de status permitidos
 * como destino. Status terminais (Autorizada, Negada, Cancelada) possuem
 * lista vazia, impedindo qualquer transição posterior.
 */
export const TRANSICOES_VALIDAS: Record<SolicitacaoStatus, SolicitacaoStatus[]> = {
  'Recebida': ['Pendente de análise', 'Cancelada'],
  'Pendente de análise': ['Enviada ao CRM', 'Cancelada'],
  'Enviada ao CRM': ['Em análise', 'Erro de integração', 'Cancelada'],
  'Em análise': ['Pendente de documento', 'Autorizada', 'Negada'],
  'Pendente de documento': ['Em análise', 'Cancelada'],
  'Autorizada': [],
  'Negada': [],
  'Cancelada': [],
  'Erro de integração': ['Enviada ao CRM', 'Cancelada'],
};

/**
 * Status terminais — uma vez atingidos, nenhuma transição é permitida.
 */
export const STATUS_TERMINAIS: SolicitacaoStatus[] = ['Autorizada', 'Negada', 'Cancelada'];

/**
 * Verifica se a transição de `statusAtual` para `novoStatus` é válida
 * conforme o mapa de transições definido.
 */
export function isTransicaoValida(
  statusAtual: SolicitacaoStatus,
  novoStatus: SolicitacaoStatus
): boolean {
  const permitidos = TRANSICOES_VALIDAS[statusAtual];
  if (!permitidos) {
    return false;
  }
  return permitidos.includes(novoStatus);
}

/**
 * Retorna a lista de transições permitidas a partir do status informado.
 */
export function getTransicoesPermitidas(status: SolicitacaoStatus): SolicitacaoStatus[] {
  return TRANSICOES_VALIDAS[status] ?? [];
}

/**
 * Verifica se um status é terminal (não permite transições).
 */
export function isStatusTerminal(status: SolicitacaoStatus): boolean {
  return STATUS_TERMINAIS.includes(status);
}

/**
 * Erro de transição de status inválida (HTTP 422 - Unprocessable Entity).
 *
 * Retorna mensagem explicando o status atual e as transições permitidas.
 */
export class TransicaoInvalidaError extends AppError {
  public readonly statusAtual: SolicitacaoStatus;
  public readonly novoStatus: SolicitacaoStatus;
  public readonly transicoesPermitidas: SolicitacaoStatus[];

  constructor(statusAtual: SolicitacaoStatus, novoStatus: SolicitacaoStatus) {
    const permitidas = getTransicoesPermitidas(statusAtual);
    const mensagem = permitidas.length > 0
      ? `Transição de status inválida. Status atual: "${statusAtual}". Transições permitidas: ${permitidas.map((s) => `"${s}"`).join(', ')}.`
      : `Transição de status inválida. Status atual: "${statusAtual}" é um status terminal e não permite transições.`;

    super(422, mensagem);
    this.name = 'TransicaoInvalidaError';
    this.statusAtual = statusAtual;
    this.novoStatus = novoStatus;
    this.transicoesPermitidas = permitidas;
  }
}

/**
 * Valida a transição de status e lança TransicaoInvalidaError se inválida.
 *
 * Use esta função como guard antes de executar uma mudança de status.
 * Se a transição for inválida, lança erro HTTP 422 automaticamente.
 */
export function validarTransicao(
  statusAtual: SolicitacaoStatus,
  novoStatus: SolicitacaoStatus
): void {
  if (!isTransicaoValida(statusAtual, novoStatus)) {
    throw new TransicaoInvalidaError(statusAtual, novoStatus);
  }
}
