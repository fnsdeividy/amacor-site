import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Aplica máscara de matrícula no formato XXX.XXXXXX-XX
 */
function formatMatricula(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 9)}-${digits.slice(9, 11)}`;
}

/** Validates matrícula: formato XXX.XXXXXX-XX */
export function validateMatricula(value: string): string | null {
  if (!value.trim()) {
    return 'Matrícula é obrigatória';
  }
  if (!/^\d{3}\.\d{6}-\d{2}$/.test(value.trim())) {
    return 'Formato inválido. Use XXX.XXXXXX-XX';
  }
  return null;
}

/** Validates senha: 6-20 characters */
export function validateSenha(value: string): string | null {
  if (!value) {
    return 'Senha é obrigatória';
  }
  if (value.length < 6) {
    return 'Senha deve ter no mínimo 6 caracteres';
  }
  if (value.length > 20) {
    return 'Senha deve ter no máximo 20 caracteres';
  }
  return null;
}

export default function Register() {
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ codigo?: string; senha?: string }>({});
  const { createLogin, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  function handleCodigoChange(e: ChangeEvent<HTMLInputElement>) {
    setCodigo(formatMatricula(e.target.value));
    if (fieldErrors.codigo) {
      setFieldErrors((prev) => ({ ...prev, codigo: undefined }));
    }
    if (error) clearError();
  }

  function handleSenhaChange(e: ChangeEvent<HTMLInputElement>) {
    setSenha(e.target.value);
    if (fieldErrors.senha) {
      setFieldErrors((prev) => ({ ...prev, senha: undefined }));
    }
    if (error) clearError();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();

    // Inline validation
    const codigoError = validateMatricula(codigo);
    const senhaError = validateSenha(senha);

    if (codigoError || senhaError) {
      setFieldErrors({ codigo: codigoError || undefined, senha: senhaError || undefined });
      return;
    }

    setFieldErrors({});

    try {
      await createLogin({ tipo: 'USR', codigo, senha });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      // Error is handled by AuthContext and displayed via the `error` state
    }
  }

  if (success) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <svg className="w-16 h-16 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-primary-600 mb-2">Login criado com sucesso!</h2>
            <p className="text-gray-600">
              Você será redirecionado para a página de login em instantes.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 text-center mb-8">
          Criar Login
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6" noValidate>
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula do Beneficiário
            </label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={handleCodigoChange}
              maxLength={13}
              placeholder="Ex: 020.019572-00"
              aria-describedby="codigo-register-help codigo-register-error"
              aria-invalid={!!fieldErrors.codigo}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${fieldErrors.codigo ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            <p id="codigo-register-help" className="mt-1 text-xs text-gray-500">
              Máximo 20 caracteres alfanuméricos
            </p>
            {fieldErrors.codigo && (
              <p id="codigo-register-error" role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.codigo}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={handleSenhaChange}
              maxLength={20}
              aria-describedby="senha-register-help senha-register-error"
              aria-invalid={!!fieldErrors.senha}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${fieldErrors.senha ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            <p id="senha-register-help" className="mt-1 text-xs text-gray-500">
              Entre 6 e 20 caracteres
            </p>
            {fieldErrors.senha && (
              <p id="senha-register-error" role="alert" className="mt-1 text-xs text-red-600">
                {fieldErrors.senha}
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Criando...
              </>
            ) : (
              'Criar Login'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Já tem login?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
