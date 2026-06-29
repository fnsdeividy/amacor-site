import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// --- Types ---

interface Anexo {
  id: string;
  nomeOriginal: string;
  tipoMime: string;
  tamanhoBytes: number;
  tipoAnexo: 'pedido_medico' | 'outro';
  criadoEm: string;
}

interface HistoricoEvento {
  id: string;
  tipoEvento: string;
  descricao: string;
  responsavelNome: string;
  responsavelPerfil: string;
  criadoEm: string;
}

interface SolicitacaoDetalhe {
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
  status: string;
  enviadoCrm: boolean;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
  anexos: Anexo[];
}

interface HistoricoResponse {
  dados: HistoricoEvento[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}

type FetchState = 'loading' | 'success' | 'error' | 'not-found';

// --- Constants ---

const API_BASE_URL = '/api';
const OBSERVACAO_MIN = 1;
const OBSERVACAO_MAX = 1000;
const HISTORICO_POR_PAGINA = 50;

// --- Helper Functions ---

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatDateTimeFull(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Pendente de análise':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Enviada ao CRM':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Em análise':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Pendente de documento':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Autorizada':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Negada':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Cancelada':
      return 'bg-warm-100 text-warm-800 border-warm-300';
    case 'Erro de integração':
      return 'bg-red-200 text-red-900 border-red-400';
    default:
      return 'bg-warm-100 text-warm-700 border-warm-300';
  }
}

// --- Sub-Components ---

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-primary-900 mb-4 pb-2 border-b border-warm-200">
      {children}
    </h2>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-warm-50">
      <div className="mx-auto max-w-5xl px-4 py-8 tablet:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-warm-200 rounded" />
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="h-6 w-48 bg-warm-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-warm-200 rounded" />
                  <div className="h-5 w-40 bg-warm-100 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="h-6 w-40 bg-warm-200 rounded" />
            <div className="h-20 bg-warm-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Confirmation Modal ---

interface ConfirmModalProps {
  isOpen: boolean;
  protocolo: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmEnvioCrmModal({ isOpen, protocolo, isSubmitting, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-xl p-6">
        <h3 id="modal-title" className="text-lg font-semibold text-primary-900 mb-4">
          Confirmar Envio ao CRM
        </h3>

        <p className="text-sm text-warm-600 mb-4">
          Deseja marcar esta solicitação como enviada ao CRM? Esta ação registrará que a solicitação foi cadastrada manualmente no sistema do CRM.
        </p>

        <div className="bg-warm-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-warm-500 mb-1">Protocolo da solicitação</p>
          <p className="text-sm font-medium text-primary-800">{protocolo}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-warm-700 bg-warm-100 rounded-lg hover:bg-warm-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSubmitting ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function AdminSolicitacaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAdminAuth();

  // Solicitação state
  const [solicitacao, setSolicitacao] = useState<SolicitacaoDetalhe | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>('loading');

  // Histórico state
  const [historico, setHistorico] = useState<HistoricoEvento[]>([]);
  const [historicoPagina, setHistoricoPagina] = useState(1);
  const [historicoTotalPaginas, setHistoricoTotalPaginas] = useState(1);
  const [historicoLoading, setHistoricoLoading] = useState(false);

  // Modal state
  const [showCrmModal, setShowCrmModal] = useState(false);
  const [crmSubmitting, setCrmSubmitting] = useState(false);

  // Observação state
  const [observacao, setObservacao] = useState('');
  const [observacaoError, setObservacaoError] = useState('');
  const [observacaoSubmitting, setObservacaoSubmitting] = useState(false);
  const [observacaoSuccess, setObservacaoSuccess] = useState('');

  // CRM status state
  const [crmStatusLoading, setCrmStatusLoading] = useState(false);
  const [crmStatusMessage, setCrmStatusMessage] = useState('');
  const [crmStatusError, setCrmStatusError] = useState('');

  // --- Fetch Solicitação ---

  const fetchSolicitacao = useCallback(async () => {
    if (!session?.token || !id) return;

    setFetchState('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/solicitacoes/${id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.status === 404) {
        setFetchState('not-found');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const merged: SolicitacaoDetalhe = {
        ...data.solicitacao,
        anexos: data.anexos || [],
      };
      setSolicitacao(merged);
      setFetchState('success');
    } catch {
      setFetchState('error');
    }
  }, [session?.token, id]);

  // --- Fetch Histórico ---

  const fetchHistorico = useCallback(async (pagina: number = 1) => {
    if (!session?.token || !id) return;

    setHistoricoLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/solicitacoes/${id}/historico?pagina=${pagina}&porPagina=${HISTORICO_POR_PAGINA}`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: HistoricoResponse = await response.json();
      setHistorico(data.dados);
      setHistoricoPagina(data.paginaAtual);
      setHistoricoTotalPaginas(data.totalPaginas);
    } catch {
      // silently fail, historico section will show empty
    } finally {
      setHistoricoLoading(false);
    }
  }, [session?.token, id]);

  useEffect(() => {
    fetchSolicitacao();
  }, [fetchSolicitacao]);

  useEffect(() => {
    if (fetchState === 'success') {
      fetchHistorico(1);
    }
  }, [fetchState, fetchHistorico]);

  // --- Marcar como Enviada ao CRM ---

  const handleEnviarCrm = async () => {
    if (!session?.token || !id) return;

    setCrmSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/solicitacoes/${id}/enviar-crm`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setShowCrmModal(false);
      // Refresh data
      await fetchSolicitacao();
      await fetchHistorico(1);
    } catch {
      // Keep modal open, user can retry
    } finally {
      setCrmSubmitting(false);
    }
  };

  // --- Adicionar Observação ---

  const handleObservacaoSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = observacao.trim();
    if (trimmed.length < OBSERVACAO_MIN || trimmed.length > OBSERVACAO_MAX) {
      setObservacaoError(`A observação deve ter entre ${OBSERVACAO_MIN} e ${OBSERVACAO_MAX} caracteres.`);
      return;
    }

    if (!session?.token || !id) return;

    setObservacaoError('');
    setObservacaoSuccess('');
    setObservacaoSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/solicitacoes/${id}/observacoes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: trimmed }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setObservacao('');
      setObservacaoSuccess('Observação adicionada com sucesso.');
      // Refresh historico
      await fetchHistorico(1);
      setTimeout(() => setObservacaoSuccess(''), 4000);
    } catch {
      setObservacaoError('Erro ao adicionar observação. Tente novamente.');
    } finally {
      setObservacaoSubmitting(false);
    }
  };

  // --- Consultar Status CRM ---

  const handleAtualizarStatusCrm = async () => {
    if (!session?.token || !id) return;

    setCrmStatusLoading(true);
    setCrmStatusMessage('');
    setCrmStatusError('');

    try {
      const response = await fetch(`${API_BASE_URL}/crm/status/${id}`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.atualizado) {
        setCrmStatusMessage(`Status atualizado para: ${data.novoStatus}`);
        await fetchSolicitacao();
        await fetchHistorico(1);
      } else {
        setCrmStatusMessage(data.mensagem || 'Solicitação ainda não cadastrada no CRM.');
      }

      setTimeout(() => setCrmStatusMessage(''), 5000);
    } catch {
      setCrmStatusError('Falha na comunicação com o CRM. Tente novamente.');
      setTimeout(() => setCrmStatusError(''), 5000);
    } finally {
      setCrmStatusLoading(false);
    }
  };

  // --- Handlers for Attachments ---

  function handleVisualizar(anexoId: string) {
    if (!session?.token) return;
    fetch(`${API_BASE_URL}/anexos/${anexoId}/visualizar`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar arquivo');
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch(() => {
        alert('Não foi possível abrir o arquivo.');
      });
  }

  function handleDownload(anexoId: string, nomeOriginal?: string) {
    if (!session?.token) return;
    fetch(`${API_BASE_URL}/anexos/${anexoId}/download`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao baixar arquivo');
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeOriginal || 'arquivo';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        alert('Não foi possível baixar o arquivo.');
      });
  }

  // --- Render States ---

  if (fetchState === 'loading') {
    return <LoadingSkeleton />;
  }

  if (fetchState === 'not-found') {
    return (
      <div className="min-h-screen bg-warm-50">
        <div className="mx-auto max-w-5xl px-4 py-8 tablet:px-8">
          <section className="rounded-xl border border-warm-200 bg-white p-12 text-center" role="alert">
            <svg className="mx-auto h-16 w-16 text-warm-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="mt-4 text-lg font-semibold text-warm-700">Solicitação não encontrada</h1>
            <p className="mt-2 text-sm text-warm-500">A solicitação solicitada não existe ou o ID é inválido.</p>
            <Link
              to="/admin/solicitacoes"
              className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Voltar para listagem
            </Link>
          </section>
        </div>
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="min-h-screen bg-warm-50">
        <div className="mx-auto max-w-5xl px-4 py-8 tablet:px-8">
          <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center" role="alert" aria-live="assertive">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="mt-4 text-lg font-semibold text-red-800">Não foi possível carregar os dados</h1>
            <p className="mt-2 text-sm text-red-600">Ocorreu um erro ao buscar os detalhes da solicitação.</p>
            <button
              onClick={fetchSolicitacao}
              className="mt-6 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </section>
        </div>
      </div>
    );
  }

  if (!solicitacao) return null;

  const canMarkAsSent = solicitacao.status === 'Pendente de análise';

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="mx-auto max-w-5xl px-4 py-8 tablet:px-8">
        {/* Header */}
        <header className="mb-6">
          <Link
            to="/admin/solicitacoes"
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 transition-colors mb-4"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para listagem
          </Link>
          <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
            <div>
              <h1 className="text-heading-md tablet:text-heading-lg text-primary-900">
                Solicitação #{solicitacao.numeroInterno}
              </h1>
              <p className="mt-1 text-sm text-warm-500">
                Protocolo: <span className="font-medium text-warm-700">{solicitacao.protocolo}</span>
                {' · '}Criada em {formatDateTime(solicitacao.criadoEm)}
              </p>
            </div>
            <span
              className={`inline-flex items-center self-start px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadgeClass(solicitacao.status)}`}
            >
              {solicitacao.status}
            </span>
          </div>
        </header>

        <div className="space-y-6">
          {/* Dados do Beneficiário */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionTitle>Dados do Beneficiário</SectionTitle>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Nome</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.nomeBeneficiario}</p>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Código</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.codigoBeneficiario}</p>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">CPF/CNPJ</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.cpfCnpj}</p>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Plano</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.plano}</p>
              </div>
            </div>
          </section>

          {/* Dados do Exame */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionTitle>Dados do Exame / Procedimento</SectionTitle>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Tipo</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.tipoExame}</p>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Nome do Exame/Procedimento</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.nomeExame}</p>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Prestador</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.prestadorNome}</p>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Endereço do Prestador</p>
                <p className="text-sm font-medium text-warm-800">{solicitacao.prestadorEndereco || '—'}</p>
              </div>
            </div>
          </section>

          {/* Anexos */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionTitle>Anexos</SectionTitle>
            {solicitacao.anexos.length === 0 ? (
              <p className="text-sm text-warm-500">Nenhum anexo disponível.</p>
            ) : (
              <ul className="space-y-3">
                {solicitacao.anexos.map((anexo) => (
                  <li
                    key={anexo.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-warm-200 bg-warm-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <svg className="h-5 w-5 text-warm-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-warm-800 truncate">{anexo.nomeOriginal}</p>
                        <p className="text-xs text-warm-500">
                          {anexo.tipoAnexo === 'pedido_medico' ? 'Pedido médico' : 'Outro'} · {formatFileSize(anexo.tamanhoBytes)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleVisualizar(anexo.id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Visualizar"
                        aria-label={`Visualizar ${anexo.nomeOriginal}`}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(anexo.id, anexo.nomeOriginal)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Download"
                        aria-label={`Download ${anexo.nomeOriginal}`}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Status e Protocolo CRM */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionTitle>Status e Protocolo CRM</SectionTitle>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Status Atual</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(solicitacao.status)}`}>
                  {solicitacao.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-warm-500 mb-0.5">Protocolo CRM</p>
                {solicitacao.protocoloCrm ? (
                  <p className="text-sm font-medium text-warm-800">{solicitacao.protocoloCrm}</p>
                ) : (
                  <p className="text-sm text-warm-400 italic">Protocolo CRM ainda não gerado</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {/* Botão Marcar como Enviada ao CRM */}
              {canMarkAsSent && (
                <button
                  type="button"
                  onClick={() => setShowCrmModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Marcar como Enviada ao CRM
                </button>
              )}

              {/* Botão Atualizar Status CRM */}
              <button
                type="button"
                onClick={handleAtualizarStatusCrm}
                disabled={crmStatusLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
              >
                {crmStatusLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {crmStatusLoading ? 'Consultando...' : 'Atualizar Status CRM'}
              </button>
            </div>

            {/* CRM status messages */}
            {crmStatusMessage && (
              <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3" role="status">
                {crmStatusMessage}
              </p>
            )}
            {crmStatusError && (
              <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                {crmStatusError}
              </p>
            )}
          </section>

          {/* Observações */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionTitle>Observações Internas</SectionTitle>

            {solicitacao.observacoes && (
              <div className="mb-4 p-3 bg-warm-50 rounded-lg border border-warm-200">
                <p className="text-sm text-warm-700 whitespace-pre-wrap">{solicitacao.observacoes}</p>
              </div>
            )}

            <form onSubmit={handleObservacaoSubmit} className="space-y-3">
              <div>
                <label htmlFor="observacao-input" className="block text-sm font-medium text-warm-700 mb-1">
                  Adicionar observação
                </label>
                <textarea
                  id="observacao-input"
                  value={observacao}
                  onChange={(e) => {
                    setObservacao(e.target.value);
                    setObservacaoError('');
                  }}
                  placeholder="Digite uma observação interna sobre esta solicitação..."
                  maxLength={OBSERVACAO_MAX}
                  rows={3}
                  className="w-full px-4 py-2 border border-warm-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-shadow resize-y text-sm"
                  aria-describedby="observacao-counter observacao-error-msg"
                />
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {observacaoError && (
                      <p id="observacao-error-msg" className="text-xs text-red-600" role="alert">
                        {observacaoError}
                      </p>
                    )}
                    {observacaoSuccess && (
                      <p className="text-xs text-green-600" role="status">
                        {observacaoSuccess}
                      </p>
                    )}
                  </div>
                  <p id="observacao-counter" className="text-xs text-warm-400">
                    {observacao.length}/{OBSERVACAO_MAX}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={observacaoSubmitting || observacao.trim().length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {observacaoSubmitting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {observacaoSubmitting ? 'Salvando...' : 'Adicionar Observação'}
              </button>
            </form>
          </section>

          {/* Histórico de Eventos */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionTitle>Histórico de Eventos</SectionTitle>

            {historicoLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3 p-3 rounded-lg border border-warm-100">
                    <div className="h-3 w-3 rounded-full bg-warm-200 mt-1 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-warm-200 rounded" />
                      <div className="h-3 w-32 bg-warm-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : historico.length === 0 ? (
              <p className="text-sm text-warm-500">Nenhum evento registrado.</p>
            ) : (
              <>
                <ul className="space-y-3" aria-label="Lista de eventos">
                  {historico.map((evento) => (
                    <li
                      key={evento.id}
                      className="flex gap-3 p-3 rounded-lg border border-warm-100 hover:bg-warm-50 transition-colors"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-primary-400 mt-1.5 shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-1">
                          <p className="text-sm font-medium text-warm-800">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warm-100 text-warm-700 mr-2">
                              {evento.tipoEvento}
                            </span>
                            {evento.descricao}
                          </p>
                          <time className="text-xs text-warm-400 shrink-0" dateTime={evento.criadoEm}>
                            {formatDateTimeFull(evento.criadoEm)}
                          </time>
                        </div>
                        <p className="text-xs text-warm-500 mt-1">
                          {evento.responsavelNome} ({evento.responsavelPerfil})
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Paginação do Histórico */}
                {historicoTotalPaginas > 1 && (
                  <nav className="flex items-center justify-between mt-4 pt-4 border-t border-warm-100" aria-label="Paginação do histórico">
                    <button
                      type="button"
                      onClick={() => fetchHistorico(historicoPagina - 1)}
                      disabled={historicoPagina <= 1 || historicoLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                    <span className="text-sm text-warm-600">
                      Página {historicoPagina} de {historicoTotalPaginas}
                    </span>
                    <button
                      type="button"
                      onClick={() => fetchHistorico(historicoPagina + 1)}
                      disabled={historicoPagina >= historicoTotalPaginas || historicoLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Próximo
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* Modal de confirmação de envio ao CRM */}
      <ConfirmEnvioCrmModal
        isOpen={showCrmModal}
        protocolo={solicitacao.protocolo}
        isSubmitting={crmSubmitting}
        onConfirm={handleEnviarCrm}
        onCancel={() => setShowCrmModal(false)}
      />
    </div>
  );
}
