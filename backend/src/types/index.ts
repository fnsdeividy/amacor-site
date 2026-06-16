/**
 * Tipos compartilhados do backend Amacor.
 */

export type SolicitacaoStatus =
  | 'Recebida'
  | 'Pendente de análise'
  | 'Enviada ao CRM'
  | 'Em análise'
  | 'Pendente de documento'
  | 'Autorizada'
  | 'Negada'
  | 'Cancelada'
  | 'Erro de integração';

export interface Solicitacao {
  id: string;
  numeroInterno: number;
  protocolo: string;
  protocoloCrm: string | null;
  codigoBeneficiario: string;
  nomeBeneficiario: string;
  cpfCnpj: string;
  plano: string;
  tipoExame: string;
  nomeExame: string;
  prestadorNome: string;
  prestadorEndereco: string;
  status: SolicitacaoStatus;
  enviadoCrm: boolean;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface HistoricoEvento {
  id: string;
  solicitacaoId: string;
  tipoEvento: string;
  descricao: string;
  responsavelNome: string;
  responsavelPerfil: string;
  criadoEm: string;
}

export interface Contadores {
  total: number;
  pendentes: number;
  enviadasCrm: number;
  autorizadas: number;
  negadas: number;
  comPendencia: number;
}

export interface Anexo {
  id: string;
  solicitacaoId: string;
  nomeOriginal: string;
  caminhoArmazenamento: string;
  tipoMime: string;
  tamanhoBytes: number;
  tipoAnexo: 'pedido_medico' | 'outro';
  criadoEm: string;
}
