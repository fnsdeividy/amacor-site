import { useState, useMemo } from 'react';
import { getAllExams, findProvidersByExam, type CredentialedProvider } from '../data/redeCredenciada';

export default function ExamSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [results, setResults] = useState<CredentialedProvider[]>([]);

  const allExams = useMemo(() => getAllExams(), []);

  const filteredExams = useMemo(() => {
    if (!searchTerm.trim()) return allExams;
    const term = searchTerm.toLowerCase();
    return allExams.filter(exam => exam.toLowerCase().includes(term));
  }, [searchTerm, allExams]);

  function handleSelectExam(exam: string) {
    setSelectedExam(exam);
    setSearchTerm(exam);
    const providers = findProvidersByExam(exam);
    setResults(providers);
  }

  function handleClearSearch() {
    setSearchTerm('');
    setSelectedExam(null);
    setResults([]);
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary-600 mb-3">
            Buscar Exames
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encontre onde realizar seu exame na rede credenciada AMACOR.
            Selecione o exame desejado para ver os locais disponíveis.
          </p>
        </div>

        {/* Campo de busca */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <label htmlFor="exam-search" className="sr-only">
              Buscar exame
            </label>
            <div className="flex items-center">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="exam-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedExam) {
                      setSelectedExam(null);
                      setResults([]);
                    }
                  }}
                  placeholder="Digite o nome do exame..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-base"
                  autoComplete="off"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="ml-3 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Limpar busca"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Lista de sugestões */}
          {searchTerm && !selectedExam && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {filteredExams.length > 0 ? (
                <ul role="listbox" aria-label="Exames disponíveis">
                  {filteredExams.slice(0, 20).map((exam) => (
                    <li key={exam}>
                      <button
                        type="button"
                        onClick={() => handleSelectExam(exam)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0"
                        role="option"
                        aria-selected={false}
                      >
                        <span className="text-gray-800">{exam}</span>
                      </button>
                    </li>
                  ))}
                  {filteredExams.length > 20 && (
                    <li className="px-4 py-2 text-sm text-gray-500 text-center">
                      Mostrando 20 de {filteredExams.length} resultados. Refine sua busca.
                    </li>
                  )}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  Nenhum exame encontrado para "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lista de exames por categoria (quando não há busca) */}
        {!searchTerm && !selectedExam && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Exames mais procurados
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Ultrassonografia', 'Ecocardiograma', 'Eletrocardiograma',
                'Mamografia Digital', 'Densitometria Óssea', 'Holter 24h',
                'Mapa 24h', 'Teste Ergométrico', 'Endoscopia Digestiva',
                'Colonoscopia', 'Fisioterapia', 'Raio X', 'Análises Clínicas',
                'Ressonância Magnética', 'Tomografia Computadorizada'
              ].map(exam => (
                <button
                  key={exam}
                  onClick={() => handleSelectExam(exam)}
                  className="px-4 py-2 bg-green-50 text-primary-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultados */}
        {selectedExam && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Locais para: <span className="text-primary-600">{selectedExam}</span>
              </h2>
              <span className="text-sm text-gray-500">
                {results.length} {results.length === 1 ? 'local encontrado' : 'locais encontrados'}
              </span>
            </div>

            {results.length > 0 ? (
              <div className="grid gap-4">
                {results.map((provider) => (
                  <ProviderResultCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">Nenhum local encontrado para este exame.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ProviderResultCard({ provider }: { provider: CredentialedProvider }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {provider.address}
            </p>
          </div>

          {/* Contatos */}
          <div className="flex flex-col gap-1 sm:items-end">
            {provider.phones.length > 0 && (
              <a
                href={`tel:${provider.phones[0].replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {provider.phones[0]}
              </a>
            )}
            {provider.whatsapp && (
              <a
                href={`https://wa.me/55${provider.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-green-600 font-medium hover:underline"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Horário */}
        {provider.hours && (
          <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {provider.hours}
          </p>
        )}

        {/* Botão expandir */}
        {(provider.exams.length > 0 || provider.phones.length > 1) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm text-primary-600 hover:underline flex items-center gap-1"
          >
            {expanded ? 'Ver menos' : 'Ver todos os exames e contatos'}
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Conteúdo expandido */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {provider.phones.length > 1 && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">Telefones:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {provider.phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone.replace(/\D/g, '')}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {provider.exams.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Exames disponíveis:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {provider.exams.map((exam) => (
                    <span
                      key={exam}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
