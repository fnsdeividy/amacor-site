import { useState, type FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { alterarSenha } from '../../services/api';

export default function BeneficiaryAlterarSenha() {
  const { session } = useAuth();
  const [senhaVelha, setSenhaVelha] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!senhaVelha.trim()) {
      setError('Informe a senha atual.');
      return;
    }
    if (senhaNova.length < 6 || senhaNova.length > 20) {
      setError('A nova senha deve ter entre 6 e 20 caracteres.');
      return;
    }
    if (senhaNova !== confirmarSenha) {
      setError('A nova senha e a confirmação não conferem.');
      return;
    }
    if (!session) return;

    setIsLoading(true);
    try {
      await alterarSenha({
        tipo: 'USR',
        codigo: session.codigo,
        senhaVelha,
        senhaNova,
      });
      setSuccess(true);
      setSenhaVelha('');
      setSenhaNova('');
      setConfirmarSenha('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao alterar senha.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-primary-600 text-center mb-8">Alterar Senha</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6" noValidate>
          <div>
            <label htmlFor="senhaVelha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha atual
            </label>
            <input
              id="senhaVelha"
              type="password"
              value={senhaVelha}
              onChange={(e) => setSenhaVelha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="senhaNova" className="block text-sm font-medium text-gray-700 mb-1">
              Nova senha
            </label>
            <input
              id="senhaNova"
              type="password"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Entre 6 e 20 caracteres</p>
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nova senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div role="alert" className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Senha alterada com sucesso!
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </section>
  );
}
