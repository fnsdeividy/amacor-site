import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// --- Types ---

interface Contadores {
  total: number;
  pendentes: number;
  enviadasCrm: number;
  autorizadas: number;
  negadas: number;
  comPendencia: number;
}

type FetchState = 'loading' | 'success' | 'error';

// --- Counter Card Component ---

interface CounterCardProps {
  label: string;
  value: number;
  colorClass: string;
  icon: React.ReactNode;
}

function CounterCard({ label, value, colorClass, icon }: CounterCardProps) {
  return (
    <article
      className={`rounded-xl border-l-4 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${colorClass}`}
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-warm-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-primary-900">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warm-50" aria-hidden="true">
          {icon}
        </div>
      </div>
    </article>
  );
}

// --- Skeleton Card ---

function SkeletonCard() {
  return (
    <div
      className="rounded-xl border-l-4 border-warm-200 bg-white p-6 shadow-sm animate-pulse"
      role="status"
      aria-label="Carregando contador"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-24 rounded bg-warm-200" />
          <div className="mt-3 h-8 w-16 rounded bg-warm-200" />
        </div>
        <div className="h-12 w-12 rounded-lg bg-warm-100" />
      </div>
    </div>
  );
}

// --- Icons ---

function TotalIcon() {
  return (
    <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function PendentesIcon() {
  return (
    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function EnviadasIcon() {
  return (
    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function AutorizadasIcon() {
  return (
    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function NegadasIcon() {
  return (
    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PendenciaIcon() {
  return (
    <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

// --- Main Component ---

const API_BASE_URL = '/api';

export default function AdminDashboard() {
  const { session } = useAdminAuth();
  const [contadores, setContadores] = useState<Contadores | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>('loading');

  const fetchContadores = useCallback(async () => {
    if (!session?.token) return;

    setFetchState('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/solicitacoes/contadores`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Contadores = await response.json();
      setContadores(data);
      setFetchState('success');
    } catch {
      setFetchState('error');
    }
  }, [session?.token]);

  useEffect(() => {
    fetchContadores();
  }, [fetchContadores]);

  const isAllZero =
    contadores !== null &&
    contadores.total === 0 &&
    contadores.pendentes === 0 &&
    contadores.enviadasCrm === 0 &&
    contadores.autorizadas === 0 &&
    contadores.negadas === 0 &&
    contadores.comPendencia === 0;

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="mx-auto max-w-7xl px-4 py-8 tablet:px-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-heading-md tablet:text-heading-lg text-primary-900">
            Dashboard
          </h1>
          <p className="mt-2 text-body text-warm-600">
            Visão geral das solicitações de autorização
          </p>
        </header>

        {/* Loading State */}
        {fetchState === 'loading' && (
          <section aria-label="Carregando contadores">
            <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        )}

        {/* Error State */}
        {fetchState === 'error' && (
          <section
            className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
            role="alert"
            aria-live="assertive"
          >
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-semibold text-red-800">
              Não foi possível carregar os dados
            </h2>
            <p className="mt-2 text-sm text-red-600">
              Ocorreu um erro ao buscar os contadores. Verifique sua conexão e tente novamente.
            </p>
            <button
              onClick={fetchContadores}
              className="mt-6 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
            >
              Tentar novamente
            </button>
          </section>
        )}

        {/* Empty State (all counters are zero) */}
        {fetchState === 'success' && isAllZero && (
          <section
            className="rounded-xl border border-warm-200 bg-white p-12 text-center"
            aria-label="Nenhuma solicitação"
          >
            <svg
              className="mx-auto h-16 w-16 text-warm-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-semibold text-warm-700">
              Nenhuma solicitação cadastrada
            </h2>
            <p className="mt-2 text-sm text-warm-500">
              Quando solicitações forem registradas, os contadores aparecerão aqui.
            </p>
          </section>
        )}

        {/* Success State with counters */}
        {fetchState === 'success' && contadores && !isAllZero && (
          <section aria-label="Contadores de solicitações">
            <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
              <CounterCard
                label="Total"
                value={contadores.total}
                colorClass="border-primary-500"
                icon={<TotalIcon />}
              />
              <CounterCard
                label="Pendentes"
                value={contadores.pendentes}
                colorClass="border-yellow-500"
                icon={<PendentesIcon />}
              />
              <CounterCard
                label="Enviadas ao CRM"
                value={contadores.enviadasCrm}
                colorClass="border-blue-500"
                icon={<EnviadasIcon />}
              />
              <CounterCard
                label="Autorizadas"
                value={contadores.autorizadas}
                colorClass="border-green-500"
                icon={<AutorizadasIcon />}
              />
              <CounterCard
                label="Negadas"
                value={contadores.negadas}
                colorClass="border-red-500"
                icon={<NegadasIcon />}
              />
              <CounterCard
                label="Com Pendência"
                value={contadores.comPendencia}
                colorClass="border-orange-500"
                icon={<PendenciaIcon />}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
