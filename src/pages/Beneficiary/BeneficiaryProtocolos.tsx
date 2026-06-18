import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getListaCRMs, getCRMData } from '../../services/api';
import type { CRMData } from '../../types/beneficiary';

export default function BeneficiaryProtocolos() {
  const { session, handleParseExpired } = useAuth();
  const [protocolos, setProtocolos] = useState<Record<string, string>[]>([]);
  const [detalhe, setDetalhe] = useState<CRMData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetalhe, setIsLoadingDetalhe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataIni, setDataIni] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  });
  const [buscou, setBuscou] = useState(false);

  const fetchProtocolos = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    setDetalhe(null);

    try {
      const data = await getListaCRMs({
        parse: session.parse,
        codigo: session.codigo,
        dataIni,
      });
      setProtocolos(data);
      setBuscou(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar protocolos.';
      if (message.toLowerCase().includes('parse') || message.toLowerCase().includes('expirad')) {
        handleParseExpired();
        return;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [session, dataIni, handleParseExpired]);

  const fetchDetalhe = useCallback(async (protocolo: string) => {
    if (!session) return;
    setIsLoadingDetalhe(true);
    setError(null);

    try {
      const data = await getCRMData({
        parse: session.parse,
        codigo: session.codigo,
        tipo: 'USR',
        protocolo,
      });
      setDetalhe(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar detalhes.';
      setError(message);
    } finally {
      setIsLoadingDetalhe(false);
    }
  }, [session]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 mb-8">Meus Protocolos</h1>

        {/* Search form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="dataIni" className="block text-sm font-medium text-gray-700 mb-1">
                Data inicial
              </label>
              <input
                id="dataIni"
                type="date"
                value={dataIni}
                onChange={(e) => setDataIni(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={fetchProtocolos}
              disabled={isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Detalhe modal */}
        {detalhe && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-primary-600">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-primary-600">
                Detalhes — Protocolo {detalhe.protocolo}
              </h2>
              <button
                onClick={() => setDetalhe(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
                aria-label="Fechar detalhes"
              >
                ✕
              </button>
            </div>
            <dl className="divide-y divide-gray-100">
              {Object.entries(detalhe).map(([key, value]) => (
                <div key={key} className="py-3 flex flex-col sm:flex-row sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500 sm:w-1/3">{key}</dt>
                  <dd className="text-sm text-gray-900 sm:w-2/3">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {isLoadingDetalhe && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />)}
            </div>
          </div>
        )}

        {/* Results list */}
        {buscou && protocolos.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Nenhum protocolo encontrado para o período.</p>
          </div>
        )}

        {protocolos.length > 0 && (
          <div className="space-y-4">
            {protocolos.map((item, index) => {
              const protocolo = item['Protocolo'] || item['protocolo'] || `#${index + 1}`;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">Protocolo: {protocolo}</p>
                      {Object.entries(item)
                        .filter(([key]) => key.toLowerCase() !== 'protocolo')
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <p key={key} className="text-sm text-gray-600">
                            <span className="font-medium">{key}:</span> {value}
                          </p>
                        ))}
                    </div>
                    <button
                      onClick={() => fetchDetalhe(protocolo)}
                      disabled={isLoadingDetalhe}
                      className="px-4 py-2 text-sm bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
