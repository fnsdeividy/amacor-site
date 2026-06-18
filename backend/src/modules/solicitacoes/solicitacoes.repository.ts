import { query, getPool } from '../../config/database';
import { gerarProtocoloUnico } from '../../utils/protocol';
import {
  Solicitacao,
  SolicitacaoStatus,
  HistoricoEvento,
  Contadores,
  Anexo,
} from '../../types/index';

/**
 * Dados necessários para criar uma nova solicitação.
 */
export interface CriarSolicitacaoInput {
  codigoBeneficiario: string;
  nomeBeneficiario: string;
  cpfCnpj: string;
  plano: string;
  tipoExame: string;
  nomeExame: string;
  prestadorNome: string;
  prestadorEndereco?: string;
  observacoes?: string;
}

/**
 * Filtros disponíveis para listagem de solicitações.
 */
export interface FiltrosSolicitacao {
  nome?: string;
  codigo?: string;
  cpfCnpj?: string;
  protocolo?: string;
  status?: SolicitacaoStatus;
  enviadoCrm?: boolean;
  dataInicio?: string;
  dataFim?: string;
}

/**
 * Parâmetros de paginação.
 */
export interface Paginacao {
  pagina: number;
  porPagina?: number;
}

/**
 * Resultado paginado genérico.
 */
export interface ResultadoPaginado<T> {
  dados: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/**
 * Dados para marcar envio ao CRM.
 */
export interface MarcarEnviadoCrmInput {
  protocoloCrm?: string;
  responsavelNome: string;
  responsavelPerfil: string;
}

/**
 * Row type do banco de dados para a tabela solicitacoes.
 */
interface SolicitacaoRow {
  id: string;
  numero_interno: number;
  protocolo: string;
  protocolo_crm: string | null;
  codigo_beneficiario: string;
  nome_beneficiario: string;
  cpf_cnpj: string;
  plano: string;
  tipo_exame: string;
  nome_exame: string;
  prestador_nome: string;
  prestador_endereco: string | null;
  status: SolicitacaoStatus;
  enviado_crm: boolean;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}

/**
 * Row type do banco de dados para a tabela anexos.
 */
interface AnexoRow {
  id: string;
  solicitacao_id: string;
  nome_original: string;
  caminho_armazenamento: string;
  tipo_mime: string;
  tamanho_bytes: number;
  tipo_anexo: 'pedido_medico' | 'outro';
  criado_em: string;
}

/**
 * Row type do banco de dados para a tabela historico_eventos.
 */
interface HistoricoEventoRow {
  id: string;
  solicitacao_id: string;
  tipo_evento: string;
  descricao: string;
  responsavel_nome: string;
  responsavel_perfil: string;
  criado_em: string;
}

/**
 * Converte uma row do banco para a interface Solicitacao.
 */
function mapRowToSolicitacao(row: SolicitacaoRow): Solicitacao {
  return {
    id: row.id,
    numeroInterno: row.numero_interno,
    protocolo: row.protocolo,
    protocoloCrm: row.protocolo_crm,
    codigoBeneficiario: row.codigo_beneficiario,
    nomeBeneficiario: row.nome_beneficiario,
    cpfCnpj: row.cpf_cnpj,
    plano: row.plano,
    tipoExame: row.tipo_exame,
    nomeExame: row.nome_exame,
    prestadorNome: row.prestador_nome,
    prestadorEndereco: row.prestador_endereco ?? '',
    status: row.status,
    enviadoCrm: row.enviado_crm,
    observacoes: row.observacoes,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

/**
 * Converte uma row do banco para a interface Anexo.
 */
function mapRowToAnexo(row: AnexoRow): Anexo {
  return {
    id: row.id,
    solicitacaoId: row.solicitacao_id,
    nomeOriginal: row.nome_original,
    caminhoArmazenamento: row.caminho_armazenamento,
    tipoMime: row.tipo_mime,
    tamanhoBytes: row.tamanho_bytes,
    tipoAnexo: row.tipo_anexo,
    criadoEm: row.criado_em,
  };
}

/**
 * Converte uma row do banco para a interface HistoricoEvento.
 */
function mapRowToHistoricoEvento(row: HistoricoEventoRow): HistoricoEvento {
  return {
    id: row.id,
    solicitacaoId: row.solicitacao_id,
    tipoEvento: row.tipo_evento,
    descricao: row.descricao,
    responsavelNome: row.responsavel_nome,
    responsavelPerfil: row.responsavel_perfil,
    criadoEm: row.criado_em,
  };
}

/**
 * Cria uma nova solicitação no banco de dados.
 *
 * O protocolo é gerado automaticamente a partir do numero_interno (SERIAL)
 * obtido após o INSERT inicial.
 *
 * Utiliza uma transação para garantir consistência entre o INSERT,
 * a geração do protocolo e o registro do evento de criação no histórico.
 */
export async function criar(dados: CriarSolicitacaoInput): Promise<Solicitacao> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // INSERT com protocolo temporário para obter o numero_interno
    const insertResult = await client.query<SolicitacaoRow>(
      `INSERT INTO solicitacoes (
        codigo_beneficiario, nome_beneficiario, cpf_cnpj, plano,
        tipo_exame, nome_exame, prestador_nome, prestador_endereco,
        status, enviado_crm, observacoes, protocolo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        dados.codigoBeneficiario,
        dados.nomeBeneficiario,
        dados.cpfCnpj,
        dados.plano,
        dados.tipoExame,
        dados.nomeExame,
        dados.prestadorNome,
        dados.prestadorEndereco || null,
        'Pendente de análise' as SolicitacaoStatus,
        false,
        dados.observacoes || null,
        'TEMP', // placeholder, será atualizado com o protocolo real
      ]
    );

    const row = insertResult.rows[0];

    // Busca protocolos existentes para a data atual para garantir unicidade
    const hoje = new Date();
    const year = hoje.getFullYear();
    const month = String(hoje.getMonth() + 1).padStart(2, '0');
    const day = String(hoje.getDate()).padStart(2, '0');
    const datePrefix = `AMCR-${year}${month}${day}-%`;

    const existingResult = await client.query<{ protocolo: string }>(
      `SELECT protocolo FROM solicitacoes WHERE protocolo LIKE $1 AND protocolo != 'TEMP'`,
      [datePrefix]
    );
    const existingProtocols = existingResult.rows.map((r) => r.protocolo);
    const protocolo = gerarProtocoloUnico(existingProtocols, hoje);

    // Atualiza com o protocolo gerado
    const updateResult = await client.query<SolicitacaoRow>(
      `UPDATE solicitacoes SET protocolo = $1 WHERE id = $2 RETURNING *`,
      [protocolo, row.id]
    );

    // Registra evento de criação no histórico
    await client.query(
      `INSERT INTO historico_eventos (
        solicitacao_id, tipo_evento, descricao, responsavel_nome, responsavel_perfil
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        row.id,
        'criacao',
        'Solicitação criada pelo beneficiário',
        dados.nomeBeneficiario,
        'beneficiario',
      ]
    );

    await client.query('COMMIT');

    return mapRowToSolicitacao(updateResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Busca uma solicitação pelo ID, incluindo seus anexos e histórico de eventos.
 * Retorna null se não encontrada.
 */
export async function buscarPorId(id: string): Promise<{
  solicitacao: Solicitacao;
  anexos: Anexo[];
  historico: HistoricoEvento[];
} | null> {
  const solicitacaoResult = await query<SolicitacaoRow>(
    'SELECT * FROM solicitacoes WHERE id = $1',
    [id]
  );

  if (solicitacaoResult.rows.length === 0) {
    return null;
  }

  const anexosResult = await query<AnexoRow>(
    'SELECT * FROM anexos WHERE solicitacao_id = $1 ORDER BY criado_em DESC',
    [id]
  );

  const historicoResult = await query<HistoricoEventoRow>(
    'SELECT * FROM historico_eventos WHERE solicitacao_id = $1 ORDER BY criado_em DESC',
    [id]
  );

  return {
    solicitacao: mapRowToSolicitacao(solicitacaoResult.rows[0]),
    anexos: anexosResult.rows.map(mapRowToAnexo),
    historico: historicoResult.rows.map(mapRowToHistoricoEvento),
  };
}

/**
 * Lista solicitações com filtros e paginação.
 *
 * - Filtros usam lógica AND
 * - Filtros textuais (nome, protocolo) usam ILIKE para match parcial case-insensitive
 * - Ordenação: criado_em DESC (mais recentes primeiro)
 * - Paginação: 20 itens por página (padrão)
 */
export async function listar(
  filtros: FiltrosSolicitacao,
  paginacao: Paginacao
): Promise<ResultadoPaginado<Solicitacao>> {
  const porPagina = paginacao.porPagina ?? 20;
  const offset = (paginacao.pagina - 1) * porPagina;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filtros.nome) {
    conditions.push(`nome_beneficiario ILIKE $${paramIndex}`);
    params.push(`%${filtros.nome}%`);
    paramIndex++;
  }

  if (filtros.codigo) {
    conditions.push(`codigo_beneficiario = $${paramIndex}`);
    params.push(filtros.codigo);
    paramIndex++;
  }

  if (filtros.cpfCnpj) {
    conditions.push(`cpf_cnpj = $${paramIndex}`);
    params.push(filtros.cpfCnpj);
    paramIndex++;
  }

  if (filtros.protocolo) {
    conditions.push(`protocolo ILIKE $${paramIndex}`);
    params.push(`%${filtros.protocolo}%`);
    paramIndex++;
  }

  if (filtros.status) {
    conditions.push(`status = $${paramIndex}`);
    params.push(filtros.status);
    paramIndex++;
  }

  if (filtros.enviadoCrm !== undefined) {
    conditions.push(`enviado_crm = $${paramIndex}`);
    params.push(filtros.enviadoCrm);
    paramIndex++;
  }

  if (filtros.dataInicio) {
    conditions.push(`criado_em >= $${paramIndex}`);
    params.push(filtros.dataInicio);
    paramIndex++;
  }

  if (filtros.dataFim) {
    conditions.push(`criado_em <= $${paramIndex}`);
    params.push(filtros.dataFim);
    paramIndex++;
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Count total
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM solicitacoes ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Fetch page
  const dataResult = await query<SolicitacaoRow>(
    `SELECT * FROM solicitacoes ${whereClause} ORDER BY criado_em DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, porPagina, offset]
  );

  return {
    dados: dataResult.rows.map(mapRowToSolicitacao),
    total,
    pagina: paginacao.pagina,
    porPagina,
    totalPaginas: Math.ceil(total / porPagina),
  };
}

/**
 * Lista solicitações de um beneficiário específico, paginadas.
 *
 * - Ordenação: criado_em DESC
 * - Paginação: 20 itens por página (padrão)
 */
export async function listarPorBeneficiario(
  codigo: string,
  paginacao: Paginacao
): Promise<ResultadoPaginado<Solicitacao>> {
  const porPagina = paginacao.porPagina ?? 20;
  const offset = (paginacao.pagina - 1) * porPagina;

  const countResult = await query<{ count: string }>(
    'SELECT COUNT(*) as count FROM solicitacoes WHERE codigo_beneficiario = $1',
    [codigo]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const dataResult = await query<SolicitacaoRow>(
    `SELECT * FROM solicitacoes WHERE codigo_beneficiario = $1 ORDER BY criado_em DESC LIMIT $2 OFFSET $3`,
    [codigo, porPagina, offset]
  );

  return {
    dados: dataResult.rows.map(mapRowToSolicitacao),
    total,
    pagina: paginacao.pagina,
    porPagina,
    totalPaginas: Math.ceil(total / porPagina),
  };
}

/**
 * Retorna contadores agrupados por status.
 *
 * Contadores:
 * - total: todas as solicitações
 * - pendentes: status = 'Pendente de análise'
 * - enviadasCrm: status = 'Enviada ao CRM'
 * - autorizadas: status = 'Autorizada'
 * - negadas: status = 'Negada'
 * - comPendencia: status = 'Pendente de documento'
 */
export async function contadores(): Promise<Contadores> {
  const result = await query<{
    total: string;
    pendentes: string;
    enviadas_crm: string;
    autorizadas: string;
    negadas: string;
    com_pendencia: string;
  }>(
    `SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'Pendente de análise') as pendentes,
      COUNT(*) FILTER (WHERE status = 'Enviada ao CRM') as enviadas_crm,
      COUNT(*) FILTER (WHERE status = 'Autorizada') as autorizadas,
      COUNT(*) FILTER (WHERE status = 'Negada') as negadas,
      COUNT(*) FILTER (WHERE status = 'Pendente de documento') as com_pendencia
    FROM solicitacoes`
  );

  const row = result.rows[0];

  return {
    total: parseInt(row.total, 10),
    pendentes: parseInt(row.pendentes, 10),
    enviadasCrm: parseInt(row.enviadas_crm, 10),
    autorizadas: parseInt(row.autorizadas, 10),
    negadas: parseInt(row.negadas, 10),
    comPendencia: parseInt(row.com_pendencia, 10),
  };
}

/**
 * Atualiza o status de uma solicitação e registra o evento no histórico.
 *
 * Usa transação para garantir consistência entre o UPDATE e o INSERT no histórico.
 */
export async function atualizarStatus(
  id: string,
  status: SolicitacaoStatus,
  responsavelNome: string,
  responsavelPerfil: string,
  descricao?: string
): Promise<Solicitacao | null> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateResult = await client.query<SolicitacaoRow>(
      `UPDATE solicitacoes SET status = $1, atualizado_em = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    // Registra evento no histórico
    await client.query(
      `INSERT INTO historico_eventos (
        solicitacao_id, tipo_evento, descricao, responsavel_nome, responsavel_perfil
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        'mudanca_status',
        descricao || `Status alterado para "${status}"`,
        responsavelNome,
        responsavelPerfil,
      ]
    );

    await client.query('COMMIT');

    return mapRowToSolicitacao(updateResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Marca uma solicitação como enviada ao CRM.
 *
 * - Define enviado_crm = true
 * - Atualiza status para 'Enviada ao CRM'
 * - Opcionalmente registra protocolo_crm
 * - Registra evento no histórico
 */
export async function marcarEnviadoCrm(
  id: string,
  dados: MarcarEnviadoCrmInput
): Promise<Solicitacao | null> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateResult = await client.query<SolicitacaoRow>(
      `UPDATE solicitacoes
       SET enviado_crm = true,
           status = 'Enviada ao CRM',
           protocolo_crm = COALESCE($1, protocolo_crm),
           atualizado_em = NOW()
       WHERE id = $2
       RETURNING *`,
      [dados.protocoloCrm || null, id]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    // Registra evento no histórico
    await client.query(
      `INSERT INTO historico_eventos (
        solicitacao_id, tipo_evento, descricao, responsavel_nome, responsavel_perfil
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        id,
        'envio_crm',
        `Solicitação marcada como enviada ao CRM${dados.protocoloCrm ? ` (protocolo CRM: ${dados.protocoloCrm})` : ''}`,
        dados.responsavelNome,
        dados.responsavelPerfil,
      ]
    );

    await client.query('COMMIT');

    return mapRowToSolicitacao(updateResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
