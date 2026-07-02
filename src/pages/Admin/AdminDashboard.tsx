import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  bgColorClass: string;
  icon: React.ReactNode;
  href?: string;
}

function CounterCard({ label, value, colorClass, bgColorClass, icon, href }: CounterCardProps) {
  const content = (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group ${href ? 'cursor-pointer' : ''}`}
      aria-label={`${label}: ${value}`}
    >
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${bgColorClass}`} aria-hidden="true" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-warm-500 uppercase tracking-wide">{label}</p>
          <p className={`mt-2 text-4xl font-extrabold ${colorClass}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColorClass} transition-transform duration-200 group-hover:scale-110`} aria-hidden="true">
          {icon}
        </div>
      </div>

      {href && (
        <div className="mt-4 pt-3 border-t border-warm-100">
          <span className="text-xs font-medium text-primary-600 group-hover:text-primary-700 inline-flex items-center gap-1">
            Ver detalhes
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </article>
  );

  if (href) {
    return <Link to={href} className="block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-2xl">{content}</Link>;
  }
  return content;
}

// --- Skeleton Card ---

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-warm-200 bg-white p-6 shadow-card animate-pulse"
      role="status"
      aria-label="Carregando contador"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-20 rounded bg-warm-200" />
          <div className="mt-4 h-9 w-14 rounded bg-warm-200" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-warm-100" />
      </div>
      <div className="mt-4 pt-3 border-t border-warm-100">
        <div className="h-3 w-16 rounded bg-warm-100" />
      </div>
    </div>
  );
}

// --- Quick Action Card ---

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function QuickAction({ title, description, href, icon }: QuickActionProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-4 rounded-xl bg-white border border-warm-200 p-4 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary-900 group-hover:text-primary-700">{title}</p>
        <p className="text-xs text-warm-500 truncate">{description}</p>
      </div>
      <svg className="w-4 h-4 text-warm-400 group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
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

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

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
      {/* Header banner with texture */}
      <div className="relative bg-primary-900 overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
          aria-hidden="true"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-brand" aria-hidden="true" />
        {/* Floating shapes */}
        <div className="absolute top-4 right-[15%] w-32 h-32 rounded-full bg-primary-500/10 blur-2xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-[10%] w-48 h-24 rounded-full bg-cyan-400/5 blur-xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 tablet:px-8 py-8 tablet:py-10">
          <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-200 bg-white/10 px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Painel Administrativo
                </span>
              </div>
              <h1 className="text-2xl tablet:text-3xl font-bold text-white">
                {getGreeting()}, {session?.usuario?.nome || 'Administrador'}
              </h1>
              <p className="mt-1 text-sm text-primary-200 capitalize">
                {getCurrentDate()}
              </p>
            </div>

            {/* Quick stats summary */}
            {fetchState === 'success' && contadores && !isAllZero && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-sm font-medium text-white">
                    {contadores.pendentes + contadores.comPendencia} precisam de atenção
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 tablet:px-8">
        {/* Quick Actions */}
        <section className="mb-8" aria-label="Ações rápidas">
          <h2 className="text-sm font-semibold text-warm-500 uppercase tracking-wide mb-3">
            Acesso rápido
          </h2>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3">
            <QuickAction
              title="Ver solicitações"
              description="Listar e filtrar todas as solicitações"
              href="/admin/solicitacoes"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <QuickAction
              title="Pendentes de análise"
              description="Solicitações aguardando revisão"
              href="/admin/solicitacoes?status=Pendente+de+an%C3%A1lise"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <QuickAction
              title="Com pendência documental"
              description="Aguardando documentos do beneficiário"
              href="/admin/solicitacoes?status=Pendente+de+documento"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Counters Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-warm-500 uppercase tracking-wide">
            Visão geral
          </h2>
          {fetchState === 'success' && (
            <button
              onClick={fetchContadores}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-500 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 rounded-lg px-2 py-1"
              aria-label="Atualizar contadores"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar
            </button>
          )}
        </div>

        {/* Loading State */}
        {fetchState === 'loading' && (
          <section aria-label="Carregando contadores">
            <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        )}

        {/* Error State */}
        {fetchState === 'error' && (
          <section
            className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-8 text-center"
            role="alert"
            aria-live="assertive"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-red-500"
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
            </div>
            <h2 className="text-lg font-semibold text-red-800">
              Não foi possível carregar os dados
            </h2>
            <p className="mt-2 text-sm text-red-600">
              Ocorreu um erro ao buscar os contadores. Verifique sua conexão e tente novamente.
            </p>
            <button
              onClick={fetchContadores}
              className="mt-6 inline-flex items-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
            >
              Tentar novamente
            </button>
          </section>
        )}

        {/* Empty State (all counters are zero) */}
        {fetchState === 'success' && isAllZero && (
          <section
            className="rounded-2xl border border-warm-200 bg-gradient-to-br from-white to-warm-50 p-12 text-center"
            aria-label="Nenhuma solicitação"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-5">
              <svg
                className="h-10 w-10 text-warm-400"
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
            </div>
            <h2 className="text-lg font-semibold text-warm-700">
              Nenhuma solicitação cadastrada
            </h2>
            <p className="mt-2 text-sm text-warm-500 max-w-sm mx-auto">
              Quando solicitações forem registradas pelos beneficiários, os contadores aparecerão aqui automaticamente.
            </p>
          </section>
        )}

        {/* Success State with counters */}
        {fetchState === 'success' && contadores && !isAllZero && (
          <section aria-label="Contadores de solicitações">
            <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
              <CounterCard
                label="Total"
                value={contadores.total}
                colorClass="text-primary-700"
                bgColorClass="bg-primary-100"
                icon={<TotalIcon />}
                href="/admin/solicitacoes"
              />
              <CounterCard
                label="Pendentes"
                value={contadores.pendentes}
                colorClass="text-yellow-700"
                bgColorClass="bg-yellow-100"
                icon={<PendentesIcon />}
                href="/admin/solicitacoes?status=Pendente+de+an%C3%A1lise"
              />
              <CounterCard
                label="Enviadas ao CRM"
                value={contadores.enviadasCrm}
                colorClass="text-blue-700"
                bgColorClass="bg-blue-100"
                icon={<EnviadasIcon />}
                href="/admin/solicitacoes?enviadoCrm=sim"
              />
              <CounterCard
                label="Autorizadas"
                value={contadores.autorizadas}
                colorClass="text-green-700"
                bgColorClass="bg-green-100"
                icon={<AutorizadasIcon />}
                href="/admin/solicitacoes?status=Autorizada"
              />
              <CounterCard
                label="Negadas"
                value={contadores.negadas}
                colorClass="text-red-700"
                bgColorClass="bg-red-100"
                icon={<NegadasIcon />}
                href="/admin/solicitacoes?status=Negada"
              />
              <CounterCard
                label="Com Pendência"
                value={contadores.comPendencia}
                colorClass="text-orange-700"
                bgColorClass="bg-orange-100"
                icon={<PendenciaIcon />}
                href="/admin/solicitacoes?status=Pendente+de+documento"
              />
            </div>
          </section>
        )}

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t border-warm-200 flex items-center justify-between">
          <p className="text-xs text-warm-400">
            Dados atualizados automaticamente ao carregar a página.
          </p>
          <Link
            to="/admin/solicitacoes"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
          >
            Ir para solicitações
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
