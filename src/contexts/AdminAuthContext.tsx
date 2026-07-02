import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

// --- Types ---

interface AdminUser {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'operador';
}

interface AdminSession {
  token: string;
  usuario: AdminUser;
  isAuthenticated: boolean;
}

interface AdminAuthContextType {
  session: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// --- Constants ---

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';
const TOKEN_CHECK_INTERVAL_MS = 60_000; // 60 seconds
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// --- Helpers ---

/**
 * Decodifica o payload de um JWT sem verificar assinatura (client-side).
 * Retorna null se o token estiver malformado.
 */
function decodeJwtPayload(token: string): { exp?: number; iat?: number;[key: string]: unknown } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Verifica se um token JWT expirou com base no campo `exp`.
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return nowInSeconds >= payload.exp;
}

/**
 * Recupera a sessão admin armazenada no sessionStorage.
 */
function getStoredAdminSession(): AdminSession | null {
  try {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const userStr = sessionStorage.getItem(ADMIN_USER_KEY);
    if (!token || !userStr) return null;

    if (isTokenExpired(token)) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);
      return null;
    }

    const usuario: AdminUser = JSON.parse(userStr);
    return { token, usuario, isAuthenticated: true };
  } catch {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
}

/**
 * Persiste a sessão admin no sessionStorage.
 */
function storeAdminSession(session: AdminSession | null): void {
  if (session) {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, session.token);
    sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session.usuario));
  } else {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
  }
}

// --- Context ---

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(getStoredAdminSession);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync session to sessionStorage
  useEffect(() => {
    storeAdminSession(session);
  }, [session]);

  // Periodic token expiration check (every 60s)
  useEffect(() => {
    function checkExpiration() {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      if (token && isTokenExpired(token)) {
        setSession(null);
      }
    }

    intervalRef.current = setInterval(checkExpiration, TOKEN_CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const login = useCallback(async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.status === 429) {
        return { success: false, error: 'Muitas tentativas. Tente novamente em 15 minutos.' };
      }

      if (response.status === 401) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      if (!response.ok) {
        return { success: false, error: 'Erro ao realizar login. Tente novamente.' };
      }

      const data = await response.json();
      const newSession: AdminSession = {
        token: data.token,
        usuario: data.usuario,
        isAuthenticated: true,
      };

      setSession(newSession);
      return { success: true };
    } catch {
      return { success: false, error: 'Erro de conexão. Verifique sua rede e tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const isAuthenticated = session?.isAuthenticated ?? false;

  return (
    <AdminAuthContext.Provider value={{ session, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }
  return context;
}
