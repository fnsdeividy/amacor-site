import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/admin/dashboard';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const result = await login(email, senha);

    if (result.success) {
      navigate(from, { replace: true });
    } else if (result.error) {
      setError(result.error);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-background-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-heading-md font-bold text-primary-800">
            Painel Administrativo
          </h1>
          <p className="mt-2 text-sm text-warm-500">
            Acesse sua conta para gerenciar solicitações
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-card shadow-card p-8 space-y-6"
          noValidate
        >
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-warm-700 mb-1">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@amacor.com.br"
              required
              maxLength={254}
              autoComplete="email"
              aria-describedby={error ? 'admin-login-error' : undefined}
              aria-invalid={error ? 'true' : undefined}
              className="w-full px-4 py-2 border border-warm-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="admin-senha" className="block text-sm font-medium text-warm-700 mb-1">
              Senha
            </label>
            <input
              id="admin-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              autoComplete="current-password"
              aria-describedby={error ? 'admin-login-error' : undefined}
              aria-invalid={error ? 'true' : undefined}
              className="w-full px-4 py-2 border border-warm-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          {error && (
            <div
              id="admin-login-error"
              role="alert"
              aria-live="assertive"
              className="p-3 bg-error-light border border-red-200 rounded-lg text-error text-sm"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-touch"
          >
            {isLoading && (
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
            )}
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
}
