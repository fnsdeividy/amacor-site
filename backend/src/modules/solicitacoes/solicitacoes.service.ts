import { query, getPool } from '../../config/database';
import { HistoricoEvento, Solicitacao, SolicitacaoStatus } from '../../types/index';
import { logger } from '../../utils/logger';
import * as repository from './solicitacoes.repository';
import * as anexosRepository from '../anexos/anexos.repository';
import {
  CriarSolicitacaoInput,
  FiltrosSolicitacao,
  Paginacao,
  ResultadoPaginado,
} from './solicitacoes.repository';
import { validarTransicao } from './stateMachine';
import { AppError, ValidationError } from '../../middleware/errorHandler';

/**
 * Resultado paginado para histórico de eventos.
 */
export interface ResultadoHistoricoPaginado {
  dados: HistoricoEvento[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/**
 * Informações do arquivo de pedido médico para criação de solicitação.
 */
export interface PedidoMedicoFile {
  nomeOriginal: string;
  caminhoArmazenamento: string;
  tipoMime: string;
  tamanhoBytes: number;
}

/**
 * Resultado da criação de solicitação retornado ao cliente.
 */
export interface CriarSolicitacaoResult {
  id: string;
  protocolo: string;
  numeroInterno: number;
}

/**
 * Cria uma nova solicitação de autorização.
 *
 * - Rejeita criação se pedido médico não for anexado
 * - Delega criação ao repositório (protocolo gerado automaticamente, status "Pendente de análise")
 * - Registra evento de criação no histórico (feito pelo repositório)
 * - Vincula o arquivo de pedido médico como anexo com tipoAnexo "pedido_medico"
 * - Retorna id, protocolo e numeroInterno
 */
export async function criarSolicitacao(
  dados: CriarSolicitacaoInput,
  pedidoMedico?: PedidoMedicoFile
): Promise<CriarSolicitacaoResult> {
  // Rejeitar criação se pedido médico não está anexado (Requisito 7.5)
  if (!pedidoMedico) {
    throw new ValidationError('Pedido médico é obrigatório para criar uma solicitação');
  }

  // Criar solicitação com status "Pendente de análise" e protocolo gerado (Requisitos 7.1, 7.2, 7.3)
  const solicitacao = await repository.criar(dados);

  // Vincular arquivo de pedido médico como anexo com tipoAnexo "pedido_medico" (Requisito 7.4)
  await anexosRepository.criar({
    solicitacaoId: solicitacao.id,
    nomeOriginal: pedidoMedico.nomeOriginal,
    caminhoArmazenamento: pedidoMedico.caminhoArmazenamento,
    tipoMime: pedidoMedico.tipoMime,
    tamanhoBytes: pedidoMedico.tamanhoBytes,
    tipoAnexo: 'pedido_medico',
  });

  logger.info('solicitacoes.criar', {
    userId: dados.codigoBeneficiario,
    result: 'success',
    metadata: {
      solicitacaoId: solicitacao.id,
      protocolo: solicitacao.protocolo,
      numeroInterno: solicitacao.numeroInterno,
    },
  });

  // Retornar id, protocolo e numeroInterno (Requisito 7.6)
  return {
    id: solicitacao.id,
    protocolo: solicitacao.protocolo,
    numeroInterno: solicitacao.numeroInterno,
  };
}

/**
 * Lista solicitações com filtros e paginação (endpoint admin).
 */
export async function listarSolicitacoes(
  filtros: FiltrosSolicitacao,
  paginacao: Paginacao
): Promise<ResultadoPaginado<Solicitacao>> {
  return repository.listar(filtros, paginacao);
}

/**
 * Busca uma solicitação por ID com detalhes completos.
 */
export async function buscarSolicitacaoPorId(id: string) {
  return repository.buscarPorId(id);
}

/**
 * Retorna contadores agrupados por status.
 */
export async function obterContadores() {
  return repository.contadores();
}

/**
 * Lista solicitações de um beneficiário específico.
 */
export async function listarPorBeneficiario(
  codigo: string,
  paginacao: Paginacao
): Promise<ResultadoPaginado<Solicitacao>> {
  return repository.listarPorBeneficiario(codigo, paginacao);
}

/**
 * Altera o status de uma solicitação, validando a transição via máquina de estados.
 *
 * Integração completa: máquina de estados + histórico de eventos.
 * - Valida a transição usando `validarTransicao` (lança TransicaoInvalidaError HTTP 422 se inválida)
 * - Registra evento no histórico com tipo, responsável, perfil e timestamp em toda transição válida
 */
export async function alterarStatus(
  solicitacaoId: string,
  novoStatus: SolicitacaoStatus,
  responsavelNome: string,
  responsavelPerfil: string,
  descricao?: string
): Promise<{ success: true; solicitacao: Solicitacao } | { success: false; erro: string }> {
  // Buscar solicitação atual para validar transição
  const resultado = await repository.buscarPorId(solicitacaoId);

  if (!resultado) {
    return { success: false, erro: 'Solicitação não encontrada' };
  }

  const { solicitacao } = resultado;

  // Validar transição via máquina de estados (lança TransicaoInvalidaError se inválida)
  validarTransicao(solicitacao.status, novoStatus);

  // Transição válida — atualizar status e registrar evento no histórico
  const solicitacaoAtualizada = await repository.atualizarStatus(
    solicitacaoId,
    novoStatus,
    responsavelNome,
    responsavelPerfil,
    descricao || `Status alterado de "${solicitacao.status}" para "${novoStatus}"`
  );

  if (!solicitacaoAtualizada) {
    return { success: false, erro: 'Falha ao atualizar solicitação' };
  }

  logger.info('solicitacoes.alterar_status', {
    userId: responsavelNome,
    result: 'success',
    metadata: {
      solicitacaoId,
      statusAnterior: solicitacao.status,
      statusNovo: novoStatus,
    },
  });

  return { success: true, solicitacao: solicitacaoAtualizada };
}

/**
 * Marca uma solicitação como enviada ao CRM.
 *
 * Utiliza a máquina de estados para validar que a transição para "Enviada ao CRM" é permitida.
 * Registra evento no histórico em caso de transição válida.
 */
export async function enviarParaCrm(
  solicitacaoId: string,
  responsavelNome: string,
  responsavelPerfil: string,
  protocoloCrm?: string
): Promise<{ success: true; solicitacao: Solicitacao } | { success: false; erro: string }> {
  // Buscar solicitação atual para validar transição de status
  const resultado = await repository.buscarPorId(solicitacaoId);

  if (!resultado) {
    return { success: false, erro: 'Solicitação não encontrada' };
  }

  const { solicitacao } = resultado;

  // Validar transição via máquina de estados (lança TransicaoInvalidaError se inválida)
  validarTransicao(solicitacao.status, 'Enviada ao CRM');

  const solicitacaoAtualizada = await repository.marcarEnviadoCrm(solicitacaoId, {
    protocoloCrm,
    responsavelNome,
    responsavelPerfil,
  });

  if (!solicitacaoAtualizada) {
    return { success: false, erro: 'Falha ao atualizar solicitação' };
  }

  logger.info('solicitacoes.enviar_crm', {
    userId: responsavelNome,
    result: 'success',
    metadata: {
      solicitacaoId,
      protocoloCrm,
      statusAnterior: solicitacao.status,
      statusNovo: 'Enviada ao CRM',
    },
  });

  return { success: true, solicitacao: solicitacaoAtualizada };
}

/**
 * Adiciona uma observação interna a uma solicitação.
 *
 * - Registra evento no histórico
 * - Atualiza campo observacoes da solicitação (append)
 */
export async function adicionarObservacao(
  solicitacaoId: string,
  texto: string,
  responsavelNome: string,
  responsavelPerfil: string
): Promise<{ success: true } | { success: false; erro: string }> {
  // Verificar se a solicitação existe
  const resultado = await repository.buscarPorId(solicitacaoId);

  if (!resultado) {
    return { success: false, erro: 'Solicitação não encontrada' };
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Registrar evento no histórico
    await client.query(
      `INSERT INTO historico_eventos (
        solicitacao_id, tipo_evento, descricao, responsavel_nome, responsavel_perfil
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        solicitacaoId,
        'observacao_interna',
        texto,
        responsavelNome,
        responsavelPerfil,
      ]
    );

    // Atualizar campo observacoes da solicitação
    await client.query(
      `UPDATE solicitacoes SET observacoes = $1, atualizado_em = NOW() WHERE id = $2`,
      [texto, solicitacaoId]
    );

    await client.query('COMMIT');

    logger.info('solicitacoes.observacao', {
      userId: responsavelNome,
      result: 'success',
      metadata: { solicitacaoId, textoLength: texto.length },
    });

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Dados do arquivo para upload de documento adicional.
 */
export interface DocumentoAdicionalFile {
  nomeOriginal: string;
  caminhoArmazenamento: string;
  tipoMime: string;
  tamanhoBytes: number;
}

/**
 * Faz upload de um documento adicional a uma solicitação.
 *
 * - Apenas permite upload quando status é "Pendente de documento" (Requisito 13.1)
 * - Rejeita com HTTP 422 quando status é diferente de "Pendente de documento" (Requisito 13.2)
 * - Cria registro de anexo com tipoAnexo "outro"
 */
export async function uploadDocumentoAdicional(
  solicitacaoId: string,
  arquivo: DocumentoAdicionalFile
): Promise<{ success: true; anexo: { id: string; nomeOriginal: string; tipoMime: string; tamanhoBytes: number } }> {
  const resultado = await repository.buscarPorId(solicitacaoId);

  if (!resultado) {
    throw new ValidationError('Solicitação não encontrada');
  }

  const { solicitacao } = resultado;

  // Requisito 13.1 e 13.2: upload apenas quando status é "Pendente de documento"
  if (solicitacao.status !== 'Pendente de documento') {
    throw new AppError(
      422,
      `Upload de documentos adicionais não permitido. Status atual: "${solicitacao.status}". Upload é permitido apenas quando o status é "Pendente de documento".`
    );
  }

  const anexo = await anexosRepository.criar({
    solicitacaoId,
    nomeOriginal: arquivo.nomeOriginal,
    caminhoArmazenamento: arquivo.caminhoArmazenamento,
    tipoMime: arquivo.tipoMime,
    tamanhoBytes: arquivo.tamanhoBytes,
    tipoAnexo: 'outro',
  });

  logger.info('solicitacoes.upload_documento_adicional', {
    userId: solicitacao.codigoBeneficiario,
    result: 'success',
    metadata: {
      solicitacaoId,
      anexoId: anexo.id,
      nomeOriginal: arquivo.nomeOriginal,
    },
  });

  return {
    success: true,
    anexo: {
      id: anexo.id,
      nomeOriginal: anexo.nomeOriginal,
      tipoMime: anexo.tipoMime,
      tamanhoBytes: anexo.tamanhoBytes,
    },
  };
}

/**
 * Busca histórico de eventos de uma solicitação com paginação.
 * Paginação fixa de 50 eventos por página, ordenação desc.
 */
export async function buscarHistorico(
  solicitacaoId: string,
  pagina: number
): Promise<ResultadoHistoricoPaginado | null> {
  const porPagina = 50;
  const offset = (pagina - 1) * porPagina;

  // Verificar se a solicitação existe
  const checkResult = await query<{ count: string }>(
    'SELECT COUNT(*) as count FROM solicitacoes WHERE id = $1',
    [solicitacaoId]
  );

  if (parseInt(checkResult.rows[0].count, 10) === 0) {
    return null;
  }

  // Contar total de eventos
  const countResult = await query<{ count: string }>(
    'SELECT COUNT(*) as count FROM historico_eventos WHERE solicitacao_id = $1',
    [solicitacaoId]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Buscar página
  const dataResult = await query<{
    id: string;
    solicitacao_id: string;
    tipo_evento: string;
    descricao: string;
    responsavel_nome: string;
    responsavel_perfil: string;
    criado_em: string;
  }>(
    `SELECT * FROM historico_eventos WHERE solicitacao_id = $1 ORDER BY criado_em DESC LIMIT $2 OFFSET $3`,
    [solicitacaoId, porPagina, offset]
  );

  const dados: HistoricoEvento[] = dataResult.rows.map((row) => ({
    id: row.id,
    solicitacaoId: row.solicitacao_id,
    tipoEvento: row.tipo_evento,
    descricao: row.descricao,
    responsavelNome: row.responsavel_nome,
    responsavelPerfil: row.responsavel_perfil,
    criadoEm: row.criado_em,
  }));

  return {
    dados,
    total,
    pagina,
    porPagina,
    totalPaginas: Math.ceil(total / porPagina),
  };
}
