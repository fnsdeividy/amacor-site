import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getBoletosEmAberto, getBoleto2aVia } from '../../services/api';
import { generateBoletoPdf } from '../../utils/boletoPdf';
import type { Boleto } from '../../types/beneficiary';

/**
 * Página de segunda via de boletos do beneficiário.
 * Consulta o CRM com token Parse e código, exibe lista de boletos
 * com vencimento, valor, status e botão de download PDF.
 *
 * Requisitos: 14.1, 14.2, 14.3, 14.4, 14.5
 */
export default function BeneficiaryBoletos() {
  const { session, handleParseExpired } = useAuth();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoletos = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBoletosEmAberto({
        parse: session.parse,
        codigo: session.codigo,
      });
      setBoletos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível consultar os boletos. Tente novamente.';
      // Detect expired Parse token
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
    fetchBoletos();
  }, [fetchBoletos]);

  /**
   * Formata valor monetário no formato R$ X.XXX,XX
   */
  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  /**
   * Gera a 2ª via do boleto usando CodigoREC
   */
  const [downloadingRec, setDownloadingRec] = useState<string | null>(null);

  async function handleDownload(boleto: Boleto) {
    if (!session || !boleto.codigoRec) return;

    setDownloadingRec(boleto.codigoRec);
    try {
      const dados = await getBoleto2aVia({
        parse: session.parse,
        codigo: session.codigo,
        codigoRec: boleto.codigoRec,
      });

      // Gerar PDF do boleto com os dados retornados
      await generateBoletoPdf(dados as any);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar 2ª via.';
      if (message.toLowerCase().includes('parse') || message.toLowerCase().includes('expirad')) {
        handleParseExpired();
        return;
      }
      setError(message);
    } finally {
      setDownloadingRec(null);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Segunda Via de Boletos</h1>
          <div className="space-y-4" aria-label="Carregando boletos">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-5 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-12 bg-gray-200 rounded w-12" />
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
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Segunda Via de Boletos</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-6" role="alert">{error}</p>
            <button
              onClick={fetchBoletos}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors min-w-[48px] min-h-[48px]"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (boletos.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-600 mb-8">Segunda Via de Boletos</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600">Nenhum boleto disponível</p>
          </div>
        </div>
      </section>
    );
  }

  // Success state with boletos list
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 mb-8">Segunda Via de Boletos</h1>
        <div className="space-y-4">
          {boletos.map((boleto, index) => (
            <div
              key={`${boleto.vencimento}-${index}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Vencimento</p>
                  <p className="text-lg font-medium text-gray-800">{boleto.vencimento}</p>
                  {boleto.parcela && (
                    <p className="text-xs text-gray-400">Parcela {boleto.parcela}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="text-lg font-semibold text-gray-800">{formatCurrency(boleto.valor)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${boleto.status === 'vencido'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {boleto.status === 'vencido' ? 'Vencido' : 'A vencer'}
                  </span>

                  <button
                    onClick={() => handleDownload(boleto)}
                    disabled={!boleto.codigoRec || downloadingRec === boleto.codigoRec}
                    aria-label={`Download boleto vencimento ${boleto.vencimento}`}
                    title="2ª via do boleto"
                    className="flex items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingRec === boleto.codigoRec ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
