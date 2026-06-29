import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

// --- Types ---

interface Solicitacao {
  id: string;
  numeroInterno: number;
  protocolo: string;
  nomeBeneficiario: string;
  codigoBeneficiario: string;
  cpfCnpj: string;
  tipoExame: string;
  nomeExame: string;
  criadoEm: string;
  status: string;
  enviadoCrm: boolean;
}

interface PaginatedResponse {
  dados: Solicitacao[];
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
}

interface Filtros {
  nome: string;
  codigo: string;
  cpfCnpj: string;
  protocolo: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  enviadoCrm: string;
}

interface FiltroErrors {
  cpfCnpj?: string;
  periodo?: string;
}

type FetchState = 'loading' | 'success' | 'error';

// --- Constants ---

const API_BASE_URL = '/api';
const ITENS_POR_PAGINA = 20;

const STATUS_OPTIONS = [
  'Recebida',
  'Pendente de análise',
  'Enviada ao CRM',
  'Em análise',
  'Pendente de documento',
  'Autorizada',
  'Negada',
  'Cancelada',
  'Erro de integração',
];

const STATUS_COLORS: Record<string, string> = {
  'Recebida': 'bg-warm-100 text-warm-700',
  'Pendente de análise': 'bg-yellow-100 text-yellow-800',
  'Enviada ao CRM': 'bg-blue-100 text-blue-800',
  'Em análise': 'bg-blue-50 text-blue-700',
  'Pendente de documento': 'bg-orange-100 text-orange-800',
  'Autorizada': 'bg-green-100 text-green-800',
  'Negada': 'bg-red-100 text-red-800',
  'Cancelada': 'bg-warm-200 text-warm-600',
  'Erro de integração': 'bg-red-50 text-red-600',
};

const INITIAL_FILTROS: Filtros = {
  nome: '',
  codigo: '',
  cpfCnpj: '',
  protocolo: '',
  status: '',
  dataInicio: '',
  dataFim: '',
  enviadoCrm: '',
};

// --- Helpers ---

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '—';
  }
}

function isValidCpfCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 || digits.length === 14;
}

function isValidPeriod(dataInicio: string, dataFim: string): { valid: boolean; error?: string } {
  if (!dataInicio && !dataFim) return { valid: true };
  if ((dataInicio && !dataFim) || (!dataInicio && dataFim)) {
    return { valid: false, error: 'Informe ambas as datas do período' };
  }

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return { valid: false, error: 'Formato de data inválido' };
  }

  if (fim < inicio) {
    return { valid: false, error: 'A data final deve ser posterior à data inicial' };
  }

  const diffMs = fim.getTime() - inicio.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 180) {
    return { valid: false, error: 'O intervalo máximo é de 180 dias' };
  }

  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  if (inicio < oneYearAgo) {
    return { valid: false, error: 'A data inicial deve estar dentro dos últimos 365 dias' };
  }

  return { valid: true };
}

// --- Filter Panel Component ---

interface FilterPanelProps {
  filtros: Filtros;
  errors: FiltroErrors;
  onFiltrosChange: (filtros: Filtros) => void;
  onSubmit: (e: FormEvent) => void;
  onClear: () => void;
}

function FilterPanel({ filtros, errors, onFiltrosChange, onSubmit, onClear }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Object.values(filtros).some((v) => v !== '');

  function handleChange(field: keyof Filtros, value: string) {
    onFiltrosChange({ ...filtros, [field]: value });
  }

  return (
    <section className="rounded-xl border border-warm-200 bg-white shadow-sm" aria-label="Filtros de solicitações">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-warm-50 transition-colors rounded-xl"
        aria-expanded={isExpanded}
        aria-controls="filter-panel-content"
      >
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-primary-900">Filtros</span>
          {hasActiveFilters && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
              {Object.values(filtros).filter((v) => v !== '').length}
            </span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-warm-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <form
          id="filter-panel-content"
          onSubmit={onSubmit}
          className="border-t border-warm-100 px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {/* Nome */}
            <div>
              <label htmlFor="filter-nome" className="block text-xs font-medium text-warm-600 mb-1">
                Nome do beneficiário
              </label>
              <input
                id="filter-nome"
                type="text"
                value={filtros.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors"
              />
            </div>

            {/* Código */}
            <div>
              <label htmlFor="filter-codigo" className="block text-xs font-medium text-warm-600 mb-1">
                Código do beneficiário
              </label>
              <input
                id="filter-codigo"
                type="text"
                value={filtros.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Código..."
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors"
              />
            </div>

            {/* CPF/CNPJ */}
            <div>
              <label htmlFor="filter-cpf" className="block text-xs font-medium text-warm-600 mb-1">
                CPF/CNPJ
              </label>
              <input
                id="filter-cpf"
                type="text"
                value={filtros.cpfCnpj}
                onChange={(e) => handleChange('cpfCnpj', e.target.value)}
                placeholder="000.000.000-00"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:outline-none transition-colors ${errors.cpfCnpj
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-warm-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                  }`}
                aria-invalid={!!errors.cpfCnpj}
                aria-describedby={errors.cpfCnpj ? 'filter-cpf-error' : undefined}
              />
              {errors.cpfCnpj && (
                <p id="filter-cpf-error" className="mt-1 text-xs text-red-600" role="alert">
                  {errors.cpfCnpj}
                </p>
              )}
            </div>

            {/* Protocolo */}
            <div>
              <label htmlFor="filter-protocolo" className="block text-xs font-medium text-warm-600 mb-1">
                Protocolo
              </label>
              <input
                id="filter-protocolo"
                type="text"
                value={filtros.protocolo}
                onChange={(e) => handleChange('protocolo', e.target.value)}
                placeholder="AMC-..."
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="filter-status" className="block text-xs font-medium text-warm-600 mb-1">
                Status
              </label>
              <select
                id="filter-status"
                value={filtros.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors"
              >
                <option value="">Todos</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Envio CRM */}
            <div>
              <label htmlFor="filter-envio-crm" className="block text-xs font-medium text-warm-600 mb-1">
                Envio CRM
              </label>
              <select
                id="filter-envio-crm"
                value={filtros.enviadoCrm}
                onChange={(e) => handleChange('enviadoCrm', e.target.value)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors"
              >
                <option value="">Todos</option>
                <option value="sim">Enviado</option>
                <option value="nao">Não enviado</option>
              </select>
            </div>

            {/* Data Início */}
            <div>
              <label htmlFor="filter-data-inicio" className="block text-xs font-medium text-warm-600 mb-1">
                Data início
              </label>
              <input
                id="filter-data-inicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => handleChange('dataInicio', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-warm-800 focus:outline-none transition-colors ${errors.periodo
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-warm-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                  }`}
                aria-invalid={!!errors.periodo}
                aria-describedby={errors.periodo ? 'filter-periodo-error' : undefined}
              />
            </div>

            {/* Data Fim */}
            <div>
              <label htmlFor="filter-data-fim" className="block text-xs font-medium text-warm-600 mb-1">
                Data fim
              </label>
              <input
                id="filter-data-fim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => handleChange('dataFim', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-warm-800 focus:outline-none transition-colors ${errors.periodo
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-warm-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                  }`}
                aria-invalid={!!errors.periodo}
              />
              {errors.periodo && (
                <p id="filter-periodo-error" className="mt-1 text-xs text-red-600" role="alert">
                  {errors.periodo}
                </p>
              )}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-colors"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50 focus:outline-none focus:ring-4 focus:ring-warm-100 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

// --- Status Badge ---

function StatusBadge({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status] || 'bg-warm-100 text-warm-700';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}

// --- Table Skeleton ---

function TableSkeleton() {
  return (
    <div className="animate-pulse" role="status" aria-label="Carregando solicitações">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3">
            <div className="h-4 w-12 rounded bg-warm-200" />
            <div className="h-4 w-32 rounded bg-warm-200" />
            <div className="h-4 w-40 rounded bg-warm-200 flex-1" />
            <div className="h-4 w-20 rounded bg-warm-200" />
            <div className="h-4 w-24 rounded bg-warm-200" />
            <div className="h-4 w-16 rounded bg-warm-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---

export default function AdminSolicitacoes() {
  const { session } = useAdminAuth();
  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtros, setFiltros] = useState<Filtros>(INITIAL_FILTROS);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>(INITIAL_FILTROS);
  const [filtroErrors, setFiltroErrors] = useState<FiltroErrors>({});

  const fetchSolicitacoes = useCallback(async (pagina: number, filtrosToApply: Filtros) => {
    if (!session?.token) return;

    setFetchState('loading');

    try {
      const params = new URLSearchParams();
      params.set('pagina', String(pagina));
      params.set('limite', String(ITENS_POR_PAGINA));

      if (filtrosToApply.nome) params.set('nome', filtrosToApply.nome);
      if (filtrosToApply.codigo) params.set('codigo', filtrosToApply.codigo);
      if (filtrosToApply.cpfCnpj) params.set('cpfCnpj', filtrosToApply.cpfCnpj);
      if (filtrosToApply.protocolo) params.set('protocolo', filtrosToApply.protocolo);
      if (filtrosToApply.status) params.set('status', filtrosToApply.status);
      if (filtrosToApply.dataInicio) params.set('dataInicio', filtrosToApply.dataInicio);
      if (filtrosToApply.dataFim) params.set('dataFim', filtrosToApply.dataFim);
      if (filtrosToApply.enviadoCrm) params.set('enviadoCrm', filtrosToApply.enviadoCrm);

      const response = await fetch(`${API_BASE_URL}/solicitacoes?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: PaginatedResponse = await response.json();
      setSolicitacoes(data.dados);
      setPaginaAtual(data.paginaAtual);
      setTotalPaginas(data.totalPaginas);
      setTotalRegistros(data.totalRegistros);
      setFetchState('success');
    } catch {
      setFetchState('error');
    }
  }, [session?.token]);

  useEffect(() => {
    fetchSolicitacoes(1, INITIAL_FILTROS);
  }, [fetchSolicitacoes]);

  function validateFiltros(): boolean {
    const newErrors: FiltroErrors = {};

    if (filtros.cpfCnpj && !isValidCpfCnpj(filtros.cpfCnpj)) {
      newErrors.cpfCnpj = 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
    }

    const periodValidation = isValidPeriod(filtros.dataInicio, filtros.dataFim);
    if (!periodValidation.valid) {
      newErrors.periodo = periodValidation.error;
    }

    setFiltroErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFilterSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateFiltros()) return;
    setFiltrosAplicados({ ...filtros });
    setPaginaAtual(1);
    fetchSolicitacoes(1, filtros);
  }

  function handleFilterClear() {
    setFiltros(INITIAL_FILTROS);
    setFiltrosAplicados(INITIAL_FILTROS);
    setFiltroErrors({});
    setPaginaAtual(1);
    fetchSolicitacoes(1, INITIAL_FILTROS);
  }

  function handlePageChange(newPage: number) {
    setPaginaAtual(newPage);
    fetchSolicitacoes(newPage, filtrosAplicados);
  }

  const hasActiveFilters = Object.values(filtrosAplicados).some((v) => v !== '');
  const isEmptyWithNoFilters = fetchState === 'success' && solicitacoes.length === 0 && !hasActiveFilters;
  const isEmptyWithFilters = fetchState === 'success' && solicitacoes.length === 0 && hasActiveFilters;

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="mx-auto max-w-7xl px-4 py-8 tablet:px-8">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-heading-md tablet:text-heading-lg text-primary-900">
            Solicitações
          </h1>
          <p className="mt-2 text-body text-warm-600">
            Gerencie as solicitações de autorização de exames
          </p>
        </header>

        {/* Filter Panel */}
        <div className="mb-6">
          <FilterPanel
            filtros={filtros}
            errors={filtroErrors}
            onFiltrosChange={setFiltros}
            onSubmit={handleFilterSubmit}
            onClear={handleFilterClear}
          />
        </div>

        {/* Loading State */}
        {fetchState === 'loading' && (
          <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-sm">
            <TableSkeleton />
          </div>
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
              Não foi possível carregar as solicitações
            </h2>
            <p className="mt-2 text-sm text-red-600">
              Ocorreu um erro ao buscar os dados. Verifique sua conexão e tente novamente.
            </p>
            <button
              onClick={() => fetchSolicitacoes(paginaAtual, filtrosAplicados)}
              className="mt-6 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
            >
              Tentar novamente
            </button>
          </section>
        )}

        {/* Empty State - No solicitations at all */}
        {isEmptyWithNoFilters && (
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
              Nenhuma solicitação registrada
            </h2>
            <p className="mt-2 text-sm text-warm-500">
              Quando solicitações forem criadas, elas aparecerão aqui.
            </p>
          </section>
        )}

        {/* Empty State - No results for filters */}
        {isEmptyWithFilters && (
          <section
            className="rounded-xl border border-warm-200 bg-white p-12 text-center"
            aria-label="Sem resultados"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-semibold text-warm-700">
              Nenhum resultado encontrado
            </h2>
            <p className="mt-2 text-sm text-warm-500">
              Não foram encontradas solicitações para os filtros aplicados. Tente ajustar os critérios de busca.
            </p>
            <button
              onClick={handleFilterClear}
              className="mt-6 inline-flex items-center rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50 focus:outline-none focus:ring-4 focus:ring-warm-100 transition-colors"
            >
              Limpar filtros
            </button>
          </section>
        )}

        {/* Success State with Data */}
        {fetchState === 'success' && solicitacoes.length > 0 && (
          <>
            {/* Results count */}
            <div className="mb-3 text-sm text-warm-600">
              {totalRegistros} solicitação{totalRegistros !== 1 ? 'ões' : ''} encontrada{totalRegistros !== 1 ? 's' : ''}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-warm-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-warm-100 bg-warm-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Nº</th>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Nome</th>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Carteirinha</th>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Exame</th>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Data</th>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Status</th>
                      <th scope="col" className="px-4 py-3 font-medium text-warm-700 whitespace-nowrap">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100">
                    {solicitacoes.map((sol) => (
                      <tr key={sol.id} className="hover:bg-warm-50 transition-colors">
                        <td className="px-4 py-3 text-warm-800 font-medium">{sol.numeroInterno}</td>
                        <td className="px-4 py-3 text-warm-800 max-w-[180px] truncate" title={sol.nomeBeneficiario}>
                          {sol.nomeBeneficiario}
                        </td>
                        <td className="px-4 py-3 text-warm-700">{sol.codigoBeneficiario}</td>
                        <td className="px-4 py-3 text-warm-700 max-w-[150px] truncate" title={`${sol.tipoExame} — ${sol.nomeExame}`}>
                          {sol.nomeExame || sol.tipoExame}
                        </td>
                        <td className="px-4 py-3 text-warm-700 whitespace-nowrap">{formatDate(sol.criadoEm)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={sol.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/admin/solicitacoes/${sol.id}`}
                            className="inline-flex items-center rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors"
                          >
                            Detalhar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPaginas > 1 && (
              <nav className="mt-6 flex items-center justify-between" aria-label="Navegação de páginas">
                <button
                  onClick={() => handlePageChange(paginaAtual - 1)}
                  disabled={paginaAtual <= 1}
                  className="inline-flex items-center rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50 focus:outline-none focus:ring-4 focus:ring-warm-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  aria-label="Página anterior"
                >
                  <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <span className="text-sm text-warm-600">
                  Página <span className="font-medium text-primary-900">{paginaAtual}</span> de{' '}
                  <span className="font-medium text-primary-900">{totalPaginas}</span>
                </span>

                <button
                  onClick={() => handlePageChange(paginaAtual + 1)}
                  disabled={paginaAtual >= totalPaginas}
                  className="inline-flex items-center rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50 focus:outline-none focus:ring-4 focus:ring-warm-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  aria-label="Próxima página"
                >
                  Próximo
                  <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
