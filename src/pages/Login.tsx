import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ codigo?: string; senha?: string }>({});
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  function validateFields(): boolean {
    const errors: { codigo?: string; senha?: string } = {};

    if (!codigo.trim()) {
      errors.codigo = 'Matrícula é obrigatória';
    }
    if (!senha.trim()) {
      errors.senha = 'Senha é obrigatória';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    if (!validateFields()) {
      return;
    }

    try {
      await login({ tipo: 'USR', codigo: codigo.trim(), senha });
      navigate('/beneficiario');
    } catch {
      // Error is handled by AuthContext and displayed via the error state
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-primary-green text-center mb-8">
          Área do Beneficiário
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6" noValidate>
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value);
                if (fieldErrors.codigo) {
                  setFieldErrors((prev) => ({ ...prev, codigo: undefined }));
                }
              }}
              placeholder="Ex: 020.019572-00"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none ${fieldErrors.codigo ? 'border-red-500' : 'border-gray-300'
                }`}
              aria-describedby={fieldErrors.codigo ? 'codigo-error' : 'codigo-help'}
              aria-invalid={!!fieldErrors.codigo}
            />
            {fieldErrors.codigo ? (
              <p id="codigo-error" className="mt-1 text-xs text-red-600" role="alert">
                {fieldErrors.codigo}
              </p>
            ) : (
              <p id="codigo-help" className="mt-1 text-xs text-gray-500">
                Digite sua matrícula no formato XXX.XXXXXX-XX
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
              onChange={(e) => {
                setSenha(e.target.value);
                if (fieldErrors.senha) {
                  setFieldErrors((prev) => ({ ...prev, senha: undefined }));
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none ${fieldErrors.senha ? 'border-red-500' : 'border-gray-300'
                }`}
              aria-describedby={fieldErrors.senha ? 'senha-error' : undefined}
              aria-invalid={!!fieldErrors.senha}
            />
            {fieldErrors.senha && (
              <p id="senha-error" className="mt-1 text-xs text-red-600" role="alert">
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
            className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Entrando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Não tem login?{' '}
            <Link to="/cadastro" className="text-primary-green font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
