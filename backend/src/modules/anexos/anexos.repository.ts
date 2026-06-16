import { query } from '../../config/database';
import { Anexo } from '../../types/index';

interface CriarAnexoData {
  solicitacaoId: string;
  nomeOriginal: string;
  caminhoArmazenamento: string;
  tipoMime: string;
  tamanhoBytes: number;
  tipoAnexo: 'pedido_medico' | 'outro';
}

/**
 * Busca um anexo por ID.
 */
export async function buscarPorId(id: string): Promise<Anexo | null> {
  const result = await query<{
    id: string;
    solicitacao_id: string;
    nome_original: string;
    caminho_armazenamento: string;
    tipo_mime: string;
    tamanho_bytes: string;
    tipo_anexo: 'pedido_medico' | 'outro';
    criado_em: string;
  }>(
    `SELECT id, solicitacao_id, nome_original, caminho_armazenamento, tipo_mime, tamanho_bytes, tipo_anexo, criado_em
     FROM anexos
     WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    solicitacaoId: row.solicitacao_id,
    nomeOriginal: row.nome_original,
    caminhoArmazenamento: row.caminho_armazenamento,
    tipoMime: row.tipo_mime,
    tamanhoBytes: Number(row.tamanho_bytes),
    tipoAnexo: row.tipo_anexo,
    criadoEm: row.criado_em,
  };
}

/**
 * Cria um novo registro de anexo no banco de dados.
 */
export async function criar(dados: CriarAnexoData): Promise<Anexo> {
  const result = await query<{
    id: string;
    solicitacao_id: string;
    nome_original: string;
    caminho_armazenamento: string;
    tipo_mime: string;
    tamanho_bytes: string;
    tipo_anexo: 'pedido_medico' | 'outro';
    criado_em: string;
  }>(
    `INSERT INTO anexos (solicitacao_id, nome_original, caminho_armazenamento, tipo_mime, tamanho_bytes, tipo_anexo)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, solicitacao_id, nome_original, caminho_armazenamento, tipo_mime, tamanho_bytes, tipo_anexo, criado_em`,
    [
      dados.solicitacaoId,
      dados.nomeOriginal,
      dados.caminhoArmazenamento,
      dados.tipoMime,
      dados.tamanhoBytes,
      dados.tipoAnexo,
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    solicitacaoId: row.solicitacao_id,
    nomeOriginal: row.nome_original,
    caminhoArmazenamento: row.caminho_armazenamento,
    tipoMime: row.tipo_mime,
    tamanhoBytes: Number(row.tamanho_bytes),
    tipoAnexo: row.tipo_anexo,
    criadoEm: row.criado_em,
  };
}
