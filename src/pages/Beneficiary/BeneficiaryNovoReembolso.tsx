import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const TIPO_PROCEDIMENTO_OPTIONS = [
  'Consulta médica',
  'Exame laboratorial',
  'Exame de imagem',
  'Procedimento cirúrgico',
  'Internação',
  'Fisioterapia',
  'Terapia ocupacional',
  'Fonoaudiologia',
  'Psicologia',
  'Medicamentos',
  'Outros',
];

interface FileValidationError {
  type: 'format' | 'size';
  message: string;
}

/**
 * Valida o arquivo de comprovante.
 * Aceita PDF, JPG e PNG com tamanho máximo de 10MB.
 */
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

/**
 * Formata valor como moeda BRL ao digitar.
 */
function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const numericValue = parseInt(digits, 10) / 100;
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Página de solicitação de reembolso do beneficiário.
 * Permite solicitar reembolso de procedimentos realizados fora da rede credenciada.
 */
export default function BeneficiaryNovoReembolso() {
  const { session } = useAuth();

  const [tipoProcedimento, setTipoProcedimento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prestadorNome, setPrestadorNome] = useState('');
  const [valor, setValor] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState('');
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFile(selectedFile);
  }

  function handleValorChange(e: ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrency(e.target.value);
    setValor(formatted);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    // Validate file presence
    if (!file) {
      setFileError('É obrigatório anexar o comprovante (nota fiscal ou recibo).');
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
      formData.append('tipoExame', `Reembolso - ${tipoProcedimento}`);
      formData.append('nomeExame', descricao);
      formData.append('prestadorNome', prestadorNome);
      formData.append('codigoBeneficiario', session!.codigo);
      formData.append('nomeBeneficiario', session!.nome);
      formData.append('cpfCnpj', session!.cpfCnpj);
      formData.append('observacoes', `Valor: R$ ${valor} | Data do atendimento: ${dataAtendimento}`);
      formData.append('pedidoMedico', file);

      const response = await fetch(`${API_BASE_URL}/solicitacoes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.erro || 'Não foi possível registrar a solicitação de reembolso. Tente novamente.'
        );
      }

      const data = await response.json();
      setSuccessData({ numeroInterno: data.numeroInterno });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível registrar a solicitação de reembolso. Tente novamente.';
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
              Solicitação de Reembolso Registrada
            </h1>
            <p className="text-gray-600 mb-4">
              Sua solicitação de reembolso foi registrada com sucesso.
            </p>
            <p className="text-lg font-semibold text-primary-600 mb-2">
              Número interno: {successData.numeroInterno}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              O reembolso será analisado e processado em até 30 dias úteis após o recebimento da documentação completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/beneficiario/solicitacoes"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Ver minhas solicitações
              </Link>
              <button
                onClick={() => {
                  setSuccessData(null);
                  setTipoProcedimento('');
                  setDescricao('');
                  setPrestadorNome('');
                  setValor('');
                  setDataAtendimento('');
                  setFile(null);
                  setFileError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Novo reembolso
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
          <h1 className="text-3xl font-bold text-primary-600">
            Solicitar Reembolso
          </h1>
          <p className="text-gray-600 mt-1">
            Preencha os dados abaixo para solicitar reembolso de um procedimento realizado fora da rede credenciada.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informações importantes:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>O reembolso é limitado aos valores da tabela da operadora</li>
                <li>Prazo de processamento: até 30 dias após documentação completa</li>
                <li>É necessário anexar nota fiscal ou recibo do prestador</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Tipo de procedimento */}
          <div>
            <label htmlFor="tipoProcedimento" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de procedimento <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoProcedimento"
              value={tipoProcedimento}
              onChange={(e) => setTipoProcedimento(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Selecione o tipo</option>
              {TIPO_PROCEDIMENTO_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição do procedimento */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição do procedimento <span className="text-red-500">*</span>
            </label>
            <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              maxLength={200}
              placeholder="Ex: Consulta com cardiologista, Ressonância magnética..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Nome do prestador */}
          <div>
            <label htmlFor="prestadorNome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do prestador / clínica <span className="text-red-500">*</span>
            </label>
            <input
              id="prestadorNome"
              type="text"
              value={prestadorNome}
              onChange={(e) => setPrestadorNome(e.target.value)}
              required
              maxLength={200}
              placeholder="Nome do médico, clínica ou hospital"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Valor e Data do atendimento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Valor */}
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
                Valor pago (R$) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                <input
                  id="valor"
                  type="text"
                  inputMode="numeric"
                  value={valor}
                  onChange={handleValorChange}
                  required
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Data do atendimento */}
            <div>
              <label htmlFor="dataAtendimento" className="block text-sm font-medium text-gray-700 mb-1">
                Data do atendimento <span className="text-red-500">*</span>
              </label>
              <input
                id="dataAtendimento"
                type="date"
                value={dataAtendimento}
                onChange={(e) => setDataAtendimento(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Comprovante (upload) */}
          <div>
            <label htmlFor="comprovante" className="block text-sm font-medium text-gray-700 mb-1">
              Nota fiscal ou recibo <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Anexe a nota fiscal ou recibo do procedimento. Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 10 MB.
            </p>
            <input
              ref={fileInputRef}
              id="comprovante"
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

          {/* Submit error */}
          {submitError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/beneficiario/solicitacoes"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Voltar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Reembolso'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
