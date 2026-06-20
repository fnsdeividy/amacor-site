import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDadosBeneficiario } from '../../services/api';

/** Formata datas YYYY-MM-DD → DD/MM/AAAA */
function formatDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [ano, mes, dia] = value.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  return value;
}

/** Formata sexo */
function formatSexo(value: string): string {
  if (value === 'M' || value === 'm') return 'Masculino';
  if (value === 'F' || value === 'f') return 'Feminino';
  return value;
}

/** Formata situação */
function formatSituacao(value: string): string {
  if (value === 'A' || value === 'a') return 'ATIVO';
  if (value === 'I' || value === 'i') return 'INATIVO';
  if (value === 'S' || value === 's') return 'SUSPENSO';
  return value.toUpperCase();
}

export default function BeneficiaryDados() {
  const { session, handleParseExpired } = useAuth();
  const [dados, setDados] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDados = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDadosBeneficiario({
        parse: session.parse,
        codigo: session.codigo,
      });
      setDados(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar dados.';
      if (message.toLowerCase().includes('parse') || message.toLowerCase().includes('expirad')) {
        handleParseExpired();
        return;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [session, handleParseExpired]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8 text-center">Carteirinha Digital</h1>
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8 text-center">Carteirinha Digital</h1>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={fetchDados}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  const nome = dados?.NomeUSR || dados?.Nome || session?.nome || '';
  const cpf = dados?.Cpf || dados?.CpfCnpj || session?.cpfCnpj || '';
  const nascimento = dados?.dnasc || '';
  const matricula = session?.codigo || dados?.Codigo || '';
  const plano = dados?.PlanoDescricao || dados?.Plano || '';
  const situacao = dados?.Situacao || '';
  const sexo = dados?.Sexo || '';
  const dataAdesao = dados?.DataAdesao || dados?.Matricula || '';

  const situacaoFormatada = formatSituacao(situacao);
  const isAtivo = situacaoFormatada === 'ATIVO';

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 mb-8 text-center">Carteirinha Digital</h1>

        {/* Carteirinha */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          {/* Background decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          {/* Header da carteirinha */}
          <div className="relative px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/20">
            <div className="flex items-center gap-3">
              <img
                src="/img/logo.png"
                alt="Amacor"
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Plano de Saúde</p>
                <p className="text-white font-bold text-sm">{plano || 'AMACOR'}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isAtivo ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'}`}>
              {situacaoFormatada || '—'}
            </div>
          </div>

          {/* Corpo da carteirinha */}
          <div className="relative px-6 py-5 space-y-4">
            {/* Número da carteirinha (matrícula) - destaque */}
            <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Nº da Carteirinha</p>
              <p className="text-white text-2xl font-bold tracking-widest font-mono">{matricula || '—'}</p>
            </div>

            {/* Nome */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Beneficiário(a)</p>
              <p className="text-white text-lg font-semibold">{nome || '—'}</p>
            </div>

            {/* Dados em grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">CPF</p>
                <p className="text-white text-sm font-medium">{cpf || '—'}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Nascimento</p>
                <p className="text-white text-sm font-medium">{nascimento ? formatDate(nascimento) : '—'}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Sexo</p>
                <p className="text-white text-sm font-medium">{sexo ? formatSexo(sexo) : '—'}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Adesão</p>
                <p className="text-white text-sm font-medium">{dataAdesao ? formatDate(dataAdesao) : '—'}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-6 py-3 bg-black/20 flex items-center justify-between">
            <p className="text-white/50 text-xs">amacor.cloud</p>
            <p className="text-white/50 text-xs">Carteirinha Digital</p>
          </div>
        </div>

        {/* Info extra fora da carteirinha */}
        {dados && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Complementares</h2>
            <dl className="space-y-3">
              {dados.NomeMae && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-1/3">Nome da Mãe</dt>
                  <dd className="text-sm text-gray-900">{dados.NomeMae}</dd>
                </div>
              )}
              {dados.Email && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-1/3">E-mail</dt>
                  <dd className="text-sm text-gray-900">{dados.Email}</dd>
                </div>
              )}
              {dados.Telefone && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-1/3">Telefone</dt>
                  <dd className="text-sm text-gray-900">{dados.Telefone}</dd>
                </div>
              )}
              {dados.Celular && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-1/3">Celular</dt>
                  <dd className="text-sm text-gray-900">{dados.Celular}</dd>
                </div>
              )}
              {(dados.Endereco || dados.Bairro || dados.Cidade) && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-1/3">Endereço</dt>
                  <dd className="text-sm text-gray-900">
                    {[dados.Endereco, dados.Bairro, dados.Cidade, dados.UF].filter(Boolean).join(', ')}
                    {dados.Cep && ` - CEP: ${dados.Cep}`}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
