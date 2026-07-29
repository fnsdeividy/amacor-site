import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import providersData from '../../data/providers.json';

// --- Constants ---

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const TIPO_EXAME_OPTIONS = [
  'Exame laboratorial',
  'Exame de imagem',
  'Fisioterapia',
  'Terapia ocupacional',
  'Fonoaudiologia',
  'Psicologia',
  'Reembolso',
  'Outros',
];

// --- Types ---

interface FileValidationError {
  type: 'format' | 'size';
  message: string;
}

// --- Helpers ---

function validateFile(file: File): FileValidationError | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      type: 'format',
      message: 'Formato inválido. Apenas PDF, JPG e PNG são aceitos.',
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: 'size',
      message: 'Arquivo excede o tamanho máximo de 10 MB.',
    };
  }
  return null;
}

// --- Component ---

export default function AdminNovaSolicitacao() {
  const { session } = useAdminAuth();
  const navigate = useNavigate();

  // Form fields
  const [codigoBeneficiario, setCodigoBeneficiario] = useState('');
  const [nomeBeneficiario, setNomeBeneficiario] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [plano, setPlano] = useState('');
  const [tipoExame, setTipoExame] = useState('');
  const [nomeExame, setNomeExame] = useState('');
  const [prestador, setPrestador] = useState('');
  const [prestadorEndereco, setPrestadorEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ protocolo: string; numeroInterno: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setFileError(validationError.message);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!session?.token) {
      setSubmitError('Sessão expirada. Faça login novamente.');
      return;
    }

    // Validate file if provided
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setFileError(validationError.message);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('codigoBeneficiario', codigoBeneficiario.trim());
      formData.append('nomeBeneficiario', nomeBeneficiario.trim());
      formData.append('cpfCnpj', cpfCnpj.trim());
      formData.append('plano', plano.trim());
      formData.append('tipoExame', tipoExame);
      formData.append('nomeExame', nomeExame.trim());
      formData.append('prestadorNome', prestador);
      if (prestadorEndereco.trim()) {
        formData.append('prestadorEndereco', prestadorEndereco.trim());
      }
      if (observacoes.trim()) {
        formData.append('observacoes', observacoes.trim());
      }
      if (file) {
        formData.append('pedidoMedico', file);
      }

      const response = await fetch(`${API_BASE_URL}/solicitacoes/admin`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.erro || errorData?.message || 'Não foi possível registrar a solicitação. Tente novamente.'
        );
      }

      const data = await response.json();
      setSuccessData({ protocolo: data.protocolo, numeroInterno: data.numeroInterno });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível registrar a solicitação. Tente novamente.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success state
  if (successData) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Solicitação Registrada (Balcão)
            </h1>
            <p className="text-gray-600 mb-4">
              A solicitação foi criada com sucesso pelo administrador.
            </p>
            <p className="text-lg font-semibold text-primary-600 mb-1">
              Protocolo: {successData.protocolo}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Número interno: {successData.numeroInterno}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/admin/solicitacoes"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Ver solicitações
              </Link>
              <button
                onClick={() => {
                  setSuccessData(null);
                  setCodigoBeneficiario('');
                  setNomeBeneficiario('');
                  setCpfCnpj('');
                  setPlano('');
                  setTipoExame('');
                  setNomeExame('');
                  setPrestador('');
                  setPrestadorEndereco('');
                  setObservacoes('');
                  setFile(null);
                  setFileError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Nova solicitação
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/solicitacoes')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Voltar para solicitações"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-600">
              Nova Solicitação (Balcão)
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Registre uma solicitação de exame feita presencialmente no balcão.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Seção: Dados do Beneficiário */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Dados do Beneficiário
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código do Beneficiário */}
              <div>
                <label htmlFor="codigoBeneficiario" className="block text-sm font-medium text-gray-700 mb-1">
                  Código do beneficiário <span className="text-red-500">*</span>
                </label>
                <input
                  id="codigoBeneficiario"
                  type="text"
                  value={codigoBeneficiario}
                  onChange={(e) => setCodigoBeneficiario(e.target.value)}
                  required
                  maxLength={20}
                  placeholder="Ex: 12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Nome do Beneficiário */}
              <div>
                <label htmlFor="nomeBeneficiario" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do beneficiário <span className="text-red-500">*</span>
                </label>
                <input
                  id="nomeBeneficiario"
                  type="text"
                  value={nomeBeneficiario}
                  onChange={(e) => setNomeBeneficiario(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* CPF/CNPJ */}
              <div>
                <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF/CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  id="cpfCnpj"
                  type="text"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  required
                  maxLength={18}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Plano */}
              <div>
                <label htmlFor="plano" className="block text-sm font-medium text-gray-700 mb-1">
                  Plano
                </label>
                <input
                  id="plano"
                  type="text"
                  value={plano}
                  onChange={(e) => setPlano(e.target.value)}
                  maxLength={100}
                  placeholder="Ex: Exclusivo I"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </fieldset>

          {/* Seção: Dados do Exame */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Dados do Exame
            </legend>
            <div className="space-y-4">
              {/* Tipo de exame */}
              <div>
                <label htmlFor="tipoExame" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de exame/procedimento <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoExame"
                  value={tipoExame}
                  onChange={(e) => setTipoExame(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Selecione o tipo</option>
                  {TIPO_EXAME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nome do exame */}
              <div>
                <label htmlFor="nomeExame" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do exame/procedimento
                </label>
                <input
                  id="nomeExame"
                  type="text"
                  value={nomeExame}
                  onChange={(e) => setNomeExame(e.target.value)}
                  maxLength={200}
                  placeholder="Ex: Ressonância magnética do joelho"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Prestador */}
              <div>
                <label htmlFor="prestador" className="block text-sm font-medium text-gray-700 mb-1">
                  Prestador (rede credenciada) <span className="text-red-500">*</span>
                </label>
                <select
                  id="prestador"
                  value={prestador}
                  onChange={(e) => setPrestador(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Selecione o prestador</option>
                  {providersData.map((provider) => (
                    <option key={provider.id} value={provider.name}>
                      {provider.name} — {provider.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Endereço do prestador */}
              <div>
                <label htmlFor="prestadorEndereco" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço do prestador
                </label>
                <input
                  id="prestadorEndereco"
                  type="text"
                  value={prestadorEndereco}
                  onChange={(e) => setPrestadorEndereco(e.target.value)}
                  maxLength={500}
                  placeholder="Endereço completo (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </fieldset>

          {/* Seção: Documentos e Observações */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Documentos e Observações
            </legend>
            <div className="space-y-4">
              {/* Pedido médico (upload opcional) */}
              <div>
                <label htmlFor="pedidoMedico" className="block text-sm font-medium text-gray-700 mb-1">
                  Pedido médico
                  <span className="text-gray-400 font-normal ml-1">(opcional para balcão)</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 10 MB.
                </p>
                <input
                  ref={fileInputRef}
                  id="pedidoMedico"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer"
                />
                {fileError && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {fileError}
                  </p>
                )}
                {file && !fileError && (
                  <p className="mt-1 text-sm text-green-600">
                    Arquivo selecionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  placeholder="Observações adicionais sobre a solicitação (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y"
                />
              </div>
            </div>
          </fieldset>

          {/* Submit error */}
          {submitError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Link
              to="/admin/solicitacoes"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
