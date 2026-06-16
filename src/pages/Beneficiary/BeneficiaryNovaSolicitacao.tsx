import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import providersData from '../../data/providers.json';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const TIPO_EXAME_OPTIONS = [
  'Consulta',
  'Exame laboratorial',
  'Exame de imagem',
  'Procedimento cirúrgico',
  'Fisioterapia',
  'Terapia ocupacional',
  'Fonoaudiologia',
  'Psicologia',
  'Outros',
];

interface FileValidationError {
  type: 'format' | 'size';
  message: string;
}

/**
 * Valida o arquivo de pedido médico.
 * Aceita PDF, JPG e PNG com tamanho máximo de 10MB.
 */
export function validateFile(file: File): FileValidationError | null {
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

export default function BeneficiaryNovaSolicitacao() {
  const { session } = useAuth();

  const [tipoExame, setTipoExame] = useState('');
  const [prestador, setPrestador] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ numeroInterno: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  if (!session || !session.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
      // Reset the input so the user can re-select
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

    // Validate file presence
    if (!file) {
      setFileError('É obrigatório anexar o pedido médico.');
      return;
    }

    // Re-validate file before submission
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('tipoExame', tipoExame);
      formData.append('prestadorNome', prestador);
      formData.append('codigoBeneficiario', session!.codigo);
      formData.append('nomeBeneficiario', session!.nome);
      formData.append('cpfCnpj', session!.cpfCnpj);
      formData.append('pedidoMedico', file);

      const response = await fetch('/api/solicitacoes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.erro || 'Não foi possível registrar a solicitação. Tente novamente.'
        );
      }

      const data = await response.json();
      setSuccessData({ numeroInterno: data.numeroInterno });
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
              Solicitação Registrada
            </h1>
            <p className="text-gray-600 mb-4">
              Sua solicitação foi registrada com sucesso.
            </p>
            <p className="text-lg font-semibold text-primary-green mb-2">
              Número interno: {successData.numeroInterno}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              A análise será concluída em até 10 dias úteis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/beneficiario/solicitacoes"
                className="px-6 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ver minhas solicitações
              </Link>
              <button
                onClick={() => {
                  setSuccessData(null);
                  setTipoExame('');
                  setPrestador('');
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-green">
            Nova Solicitação de Exame
          </h1>
          <p className="text-gray-600 mt-1">
            Preencha os dados abaixo para solicitar autorização de exame ou procedimento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Tipo de exame/procedimento */}
          <div>
            <label htmlFor="tipoExame" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de exame/procedimento <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoExame"
              value={tipoExame}
              onChange={(e) => setTipoExame(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecione o tipo</option>
              {TIPO_EXAME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecione o prestador</option>
              {providersData.map((provider) => (
                <option key={provider.id} value={provider.name}>
                  {provider.name} — {provider.type}
                </option>
              ))}
            </select>
          </div>

          {/* Pedido médico (upload) */}
          <div>
            <label htmlFor="pedidoMedico" className="block text-sm font-medium text-gray-700 mb-1">
              Pedido médico <span className="text-red-500">*</span>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-green file:text-white hover:file:bg-green-700 file:cursor-pointer"
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

          {/* Submit error */}
          {submitError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
