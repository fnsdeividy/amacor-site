import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// --- Types ---

interface HistoricoTransicao {
  id: string;
  tipoEvento: string;
  descricao: string;
  responsavelNome: string;
  criadoEm: string;
}

interface SolicitacaoBeneficiario {
  id: string;
  protocolo: string;
  tipoExame: string;
  nomeExame: string;
  prestadorNome: string;
  status: string;
  criadoEm: string;
  historico: HistoricoTransicao[];
}

type FetchState = 'loading' | 'success' | 'error' | 'not-found';

// --- Constants ---

const API_BASE_URL = '/api';

// --- Helper Functions ---

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Em análise':
      return 'bg-indigo-100 text-indigo-800';
    case 'Autorizada':
    case 'Aprovada':
      return 'bg-green-100 text-green-800';
    case 'Negada':
      return 'bg-red-100 text-red-800';
    case 'Cancelada':
      return 'bg-gray-100 text-gray-800';
    case 'Pendente de análise':
      return 'bg-yellow-100 text-yellow-800';
    case 'Enviada ao CRM':
      return 'bg-blue-100 text-blue-800';
    case 'Pendente de documento':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

// --- Sub-Components ---

function LoadingSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6" aria-label="Carregando detalhes da solicitação">
          <div className="h-5 w-48 bg-gray-200 rounded" />
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-36 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mt-1" />
                  <div className="space-y-1 flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Component ---

/**
 * Página de detalhe de solicitação do beneficiário.
 * Exibe: protocolo, tipo, prestador, data, status, histórico de transições.
 *
 * Requisitos: 16.2
 */
export default function BeneficiarySolicitacaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { session, handleParseExpired } = useAuth();

  const [solicitacao, setSolicitacao] = useState<SolicitacaoBeneficiario | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>('loading');

  const fetchSolicitacao = useCallback(async () => {
    if (!session || !id) return;

    setFetchState('loading');

    try {
      const response = await fetch(
        `${API_BASE_URL}/solicitacoes/beneficiario/${encodeURIComponent(session.codigo)}/${encodeURIComponent(id)}`
      );

      if (response.status === 404) {
        setFetchState('not-found');
        return;
      }

      if (response.status === 401) {
        handleParseExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: SolicitacaoBeneficiario = await response.json();
      setSolicitacao(data);
      setFetchState('success');
    } catch {
      setFetchState('error');
    }
  }, [session, id, handleParseExpired]);

  useEffect(() => {
    fetchSolicitacao();
  }, [fetchSolicitacao]);

  // --- Render States ---

  if (fetchState === 'loading') {
    return <LoadingSkeleton />;
  }

  if (fetchState === 'not-found') {
    return (
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-700 mb-2">Solicitação não encontrada</h1>
            <p className="text-gray-500 mb-6">
              A solicitação que você está procurando não existe ou não pertence à sua conta.
            </p>
            <Link
              to="/beneficiario/solicitacoes"
              className="inline-flex items-center px-5 py-2.5 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Voltar para solicitações
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (fetchState === 'error') {
    return (
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar solicitação</h1>
            <p className="text-gray-500 mb-6" role="alert">
              Não foi possível carregar os detalhes da solicitação. Tente novamente.
            </p>
            <button
              onClick={fetchSolicitacao}
              className="px-6 py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors min-w-[48px] min-h-[48px]"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!solicitacao) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to="/beneficiario/solicitacoes"
          className="inline-flex items-center gap-1 text-sm text-primary-green hover:text-green-700 transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para solicitações
        </Link>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-green">
            Solicitação
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Protocolo: <span className="font-medium text-gray-700">{solicitacao.protocolo}</span>
          </p>
        </header>

        {/* Dados da Solicitação */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Dados da Solicitação
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Protocolo</p>
              <p className="text-sm font-medium text-gray-800">{solicitacao.protocolo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Tipo de Exame/Procedimento</p>
              <p className="text-sm font-medium text-gray-800">{solicitacao.tipoExame}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Prestador</p>
              <p className="text-sm font-medium text-gray-800">{solicitacao.prestadorNome}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Data da Solicitação</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(solicitacao.criadoEm)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(solicitacao.status)}`}
              >
                {solicitacao.status}
              </span>
            </div>
          </div>
        </div>

        {/* Histórico de Transições */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Histórico de Alterações de Status
          </h2>

          {solicitacao.historico.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma alteração de status registrada.</p>
          ) : (
            <ol className="relative border-l border-gray-200 ml-3 space-y-6" aria-label="Timeline de alterações de status">
              {solicitacao.historico.map((evento) => (
                <li key={evento.id} className="ml-6">
                  <span
                    className="absolute -left-2 flex items-center justify-center w-4 h-4 bg-primary-green rounded-full ring-4 ring-white"
                    aria-hidden="true"
                  />
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        {evento.descricao}
                      </span>
                      <time className="text-xs text-gray-500" dateTime={evento.criadoEm}>
                        {formatDateTime(evento.criadoEm)}
                      </time>
                    </div>
                    <p className="text-xs text-gray-500">
                      {evento.responsavelNome}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
