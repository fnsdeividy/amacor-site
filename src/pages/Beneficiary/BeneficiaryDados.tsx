import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDadosBeneficiario } from '../../services/api';

/** Mapeamento de campos da API para labels amigáveis */
const FIELD_LABELS: Record<string, string> = {
  NomeUSR: 'Nome',
  NomeMae: 'Nome da Mãe',
  Cpf: 'CPF',
  dnasc: 'Data de Nascimento',
  Matricula: 'Matrícula',
  Sexo: 'Sexo',
  Situacao: 'Situação',
  NomeSocial: 'Nome Social',
  Email: 'E-mail',
  Telefone: 'Telefone',
  Celular: 'Celular',
  Endereco: 'Endereço',
  Bairro: 'Bairro',
  Cidade: 'Cidade',
  UF: 'UF',
  Cep: 'CEP',
  Plano: 'Plano',
  PlanoDescricao: 'Descrição do Plano',
  DataAdesao: 'Data de Adesão',
  CpfCnpj: 'CPF/CNPJ',
  Nome: 'Nome',
  Codigo: 'Código',
};

/** Campos que devem ser ocultados (dados internos/sensíveis) */
const HIDDEN_FIELDS = ['Parse', 'parse', 'Senha', 'senha'];

/** Formata o valor de acordo com o tipo do campo */
function formatFieldValue(key: string, value: string): string {
  if (!value || value.trim() === '') return '—';

  const keyLower = key.toLowerCase();

  // Formatar sexo
  if (keyLower === 'sexo') {
    if (value === 'M' || value === 'm') return 'Masculino';
    if (value === 'F' || value === 'f') return 'Feminino';
    return value;
  }

  // Formatar situação
  if (keyLower === 'situacao') {
    if (value === 'A' || value === 'a') return 'Ativo';
    if (value === 'I' || value === 'i') return 'Inativo';
    if (value === 'S' || value === 's') return 'Suspenso';
    return value;
  }

  return value;
}

/** Retorna o label amigável para um campo */
function getFieldLabel(key: string): string {
  return FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Meus Dados</h1>
          <div className="bg-white rounded-lg shadow-md p-8 animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-2/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Meus Dados</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
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

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 mb-8">Meus Dados</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          {dados && Object.keys(dados).length > 0 ? (
            <dl className="divide-y divide-gray-200">
              {Object.entries(dados)
                .filter(([key]) => !HIDDEN_FIELDS.includes(key))
                .filter(([, value]) => value && value.trim() !== '')
                .map(([key, value]) => (
                  <div key={key} className="py-4 flex flex-col sm:flex-row sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 sm:w-1/3">{getFieldLabel(key)}</dt>
                    <dd className="text-sm text-gray-900 sm:w-2/3 mt-1 sm:mt-0">{formatFieldValue(key, value)}</dd>
                  </div>
                ))}
            </dl>
          ) : (
            <p className="text-gray-600 text-center">Nenhum dado disponível.</p>
          )}
        </div>
      </div>
    </section>
  );
}
