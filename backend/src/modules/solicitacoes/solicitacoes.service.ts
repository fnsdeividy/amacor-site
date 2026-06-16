import { query, getPool } from '../../config/database';
import { HistoricoEvento, Solicitacao } from '../../types/index';
import { logger } from '../../utils/logger';
import * as repository from './solicitacoes.repository';
import {
  CriarSolicitacaoInput,
  FiltrosSolicitacao,
  Paginacao,
  ResultadoPaginado,
} from './solicitacoes.repository';

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
 * Cria uma nova solicitação de autorização.
 *
 * - Valida dados de entrada (já validados pelo controller)
 * - Delega criação ao repositório (protocolo gerado automaticamente)
 * - Registra evento de criação no histórico (feito pelo repositório)
 */
export async function criarSolicitacao(dados: CriarSolicitacaoInput): Promise<Solicitacao> {
  const solicitacao = await repository.criar(dados);

  logger.info('solicitacoes.criar', {
    userId: dados.codigoBeneficiario,
    result: 'success',
    metadata: {
      solicitacaoId: solicitacao.id,
      protocolo: solicitacao.protocolo,
      numeroInterno: solicitacao.numeroInterno,
    },
  });

  return solicitacao;
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
 * Marca uma solicitação como enviada ao CRM.
 *
 * Regra de negócio: Só permite se status atual for "Pendente de análise".
 * Caso contrário, retorna erro.
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

  // Validar transição de status - apenas "Pendente de análise" pode ser enviada ao CRM
  if (solicitacao.status !== 'Pendente de análise') {
    return {
      success: false,
      erro: `Não é possível enviar ao CRM. Status atual: "${solicitacao.status}". Apenas solicitações com status "Pendente de análise" podem ser enviadas.`,
    };
  }

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
