import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { BeneficiarySession, LoginCredentials, CreateLoginRequest } from '../types/beneficiary';
import { login as apiLogin, createLogin as apiCreateLogin } from '../services/api';

interface AuthContextData {
  session: BeneficiarySession | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  createLogin: (data: CreateLoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  handleParseExpired: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

// SessionStorage keys with benef_ prefix to avoid collision with admin keys
const BENEF_PARSE_KEY = 'benef_parse';
const BENEF_CODIGO_KEY = 'benef_codigo';
const BENEF_NOME_KEY = 'benef_nome';
const BENEF_CPFCNPJ_KEY = 'benef_cpfCnpj';

// Legacy key for migration (removed after first read)
const LEGACY_SESSION_KEY = 'amacor_beneficiary_session';

/**
 * Recupera a sessão do beneficiário a partir das chaves individuais no sessionStorage.
 * Também faz migração da chave legada, se existente.
 */
function getStoredSession(): BeneficiarySession | null {
  try {
    // Check for new individual keys first
    const parse = sessionStorage.getItem(BENEF_PARSE_KEY);
    const codigo = sessionStorage.getItem(BENEF_CODIGO_KEY);

    if (parse && codigo) {
      return {
        parse,
        codigo,
        nome: sessionStorage.getItem(BENEF_NOME_KEY) || '',
        cpfCnpj: sessionStorage.getItem(BENEF_CPFCNPJ_KEY) || '',
        isAuthenticated: true,
      };
    }

    // Migrate from legacy key if exists
    const legacy = sessionStorage.getItem(LEGACY_SESSION_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as BeneficiarySession;
      if (parsed.parse && parsed.codigo) {
        // Store in new format
        storeSession(parsed);
        // Remove legacy key
        sessionStorage.removeItem(LEGACY_SESSION_KEY);
        return parsed;
      }
    }
  } catch {
    // Ignora erro de parse
  }
  return null;
}

/**
 * Persiste a sessão do beneficiário usando chaves individuais com prefixo benef_.
 */
function storeSession(session: BeneficiarySession | null): void {
  if (session) {
    sessionStorage.setItem(BENEF_PARSE_KEY, session.parse);
    sessionStorage.setItem(BENEF_CODIGO_KEY, session.codigo);
    sessionStorage.setItem(BENEF_NOME_KEY, session.nome);
    sessionStorage.setItem(BENEF_CPFCNPJ_KEY, session.cpfCnpj);
  } else {
    sessionStorage.removeItem(BENEF_PARSE_KEY);
    sessionStorage.removeItem(BENEF_CODIGO_KEY);
    sessionStorage.removeItem(BENEF_NOME_KEY);
    sessionStorage.removeItem(BENEF_CPFCNPJ_KEY);
    // Also remove legacy key if still present
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BeneficiarySession | null>(getStoredSession);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storeSession(session);
  }, [session]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiLogin(credentials);
      const newSession: BeneficiarySession = {
        parse: response.parse,
        codigo: response.codigo,
        nome: response.nome,
        cpfCnpj: response.cpfCnpj,
        isAuthenticated: true,
      };
      setSession(newSession);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLogin = useCallback(async (data: CreateLoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCreateLogin(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Chamado quando uma requisição ao CRM falha indicando token Parse expirado.
   * Limpa a sessão e redireciona para /login.
   */
  const handleParseExpired = useCallback(() => {
    setSession(null);
    setError(null);
    // Redirection is handled by BeneficiaryRoute guard or calling component
    // using window.location for immediate redirect when outside router context
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, error, login, createLogin, logout, clearError, handleParseExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
