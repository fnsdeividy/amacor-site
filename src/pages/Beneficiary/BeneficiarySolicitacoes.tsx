import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Interface para solicitação exibida na listagem do beneficiário.
 */
interface SolicitacaoResumo {
  id: string;
  protocolo: string;
  tipoExame: string;
  criadoEm: string; // ISO date string
  status: string;
}

interface PaginatedResponse {
  dados: SolicitacaoResumo[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

const PAGE_SIZE = 20;

/**
 * Formata data ISO para formato DD/MM/AAAA
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Retorna as classes CSS para o badge de status da solicitação.
 */
function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'Autorizada':
      return 'bg-green-100 text-green-800';
    case 'Negada':
      return 'bg-red-100 text-red-800';
    case 'Cancelada':
      return 'bg-gray-100 text-gray-800';
    case 'Enviada ao CRM':
    case 'Em análise':
      return 'bg-blue-100 text-blue-800';
    case 'Pendente de documento':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-orange-100 text-orange-800';
  }
}

/**
 * Página de listagem de solicitações do beneficiário.
 * Exibe solicitações paginadas (20/página) com protocolo, tipo, data e status.
 * Cada item possui link para detalhe em /beneficiario/solicitacoes/:id.
 *
 * Requisitos: 16.1, 16.3, 16.4, 16.5, 16.6
 */
export default function BeneficiarySolicitacoes() {
  const { session, handleParseExpired } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const fetchSolicitacoes = useCallback(async (page: number) => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/solicitacoes/beneficiario/${encodeURIComponent(session.codigo)}?pagina=${page}&limite=${PAGE_SIZE}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.erro || 'Não foi possível carregar as solicitações.';
        // Detect expired Parse token
        if (response.status === 401 || message.toLowerCase().includes('parse') || message.toLowerCase().includes('expirad')) {
          handleParseExpired();
          return;
        }
        throw new Error(message);
      }

      const data: PaginatedResponse = await response.json();
      setSolicitacoes(data.dados);
      setTotalPaginas(data.totalPaginas);
      setPagina(data.pagina);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Não foi possível carregar as solicitações. Tente novamente.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [session, handleParseExpired]);

  useEffect(() => {
    fetchSolicitacoes(pagina);
  }, [fetchSolicitacoes, pagina]);

  function handlePaginaAnterior() {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  }

  function handleProximaPagina() {
    if (pagina < totalPaginas) {
      setPagina(pagina + 1);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-green mb-8">Minhas Solicitações</h1>
          <div className="space-y-4" aria-label="Carregando solicitações">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                    <div className="h-4 bg-gray-200 rounded w-28" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-green mb-8">Minhas Solicitações</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-6" role="alert">{error}</p>
            <button
              onClick={() => fetchSolicitacoes(pagina)}
              className="px-6 py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors min-w-[48px] min-h-[48px]"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (solicitacoes.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-green mb-8">Minhas Solicitações</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600">Nenhuma solicitação</p>
            <Link
              to="/beneficiario/solicitacoes/nova"
              className="inline-block mt-4 px-6 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Nova Solicitação
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Success state with paginated list
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-primary-green">Minhas Solicitações</h1>
          <Link
            to="/beneficiario/solicitacoes/nova"
            className="inline-flex items-center px-4 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Solicitação
          </Link>
        </div>

        {/* Solicitações list */}
        <div className="space-y-4">
          {solicitacoes.map((solicitacao) => (
            <Link
              key={solicitacao.id}
              to={`/beneficiario/solicitacoes/${solicitacao.id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <p className="text-sm text-gray-500">Protocolo</p>
                  <p className="text-base font-medium text-gray-800">{solicitacao.protocolo}</p>
                  <p className="text-sm text-gray-600">{solicitacao.tipoExame}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {formatDate(solicitacao.criadoEm)}
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(solicitacao.status)}`}
                  >
                    {solicitacao.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePaginaAnterior}
              disabled={pagina <= 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[48px] min-h-[48px]"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={handleProximaPagina}
              disabled={pagina >= totalPaginas}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[48px] min-h-[48px]"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
