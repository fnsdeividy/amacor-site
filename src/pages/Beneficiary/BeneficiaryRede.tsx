import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRedeDoUsuario } from '../../services/api';

export default function BeneficiaryRede() {
  const { session, handleParseExpired } = useAuth();
  const [prestadores, setPrestadores] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRede = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getRedeDoUsuario({
        parse: session.parse,
        codigo: session.codigo,
      });
      setPrestadores(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar rede.';
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
    fetchRede();
  }, [fetchRede]);

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Minha Rede de Atendimento</h1>
          <div className="space-y-4" aria-label="Carregando rede">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Minha Rede de Atendimento</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={fetchRede}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (prestadores.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Minha Rede de Atendimento</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Nenhum prestador encontrado para o seu plano.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 mb-8">Minha Rede de Atendimento</h1>
        <p className="text-gray-600 mb-6">
          {prestadores.length} prestador{prestadores.length !== 1 ? 'es' : ''} disponíve{prestadores.length !== 1 ? 'is' : 'l'} para o seu plano.
        </p>
        <div className="space-y-4">
          {prestadores.map((prestador, index) => {
            const nome = prestador['Nome'] || prestador['nome'] || prestador['NomePrestador'] || `Prestador ${index + 1}`;
            const entries = Object.entries(prestador).filter(
              ([key]) => !['Nome', 'nome', 'NomePrestador'].includes(key)
            );
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{nome}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entries.map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">{key}:</span> {value || '—'}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
