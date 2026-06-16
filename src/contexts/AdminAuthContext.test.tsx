import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';

// Helper component to access context
function TestConsumer() {
  const { session, isAuthenticated, isLoading, login, logout } = useAdminAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="user">{session?.usuario?.nome ?? 'none'}</span>
      <button data-testid="login-btn" onClick={() => login('admin@test.com', 'password123')}>Login</button>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AdminAuthProvider>
      <TestConsumer />
    </AdminAuthProvider>
  );
}

describe('AdminAuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts unauthenticated when no session stored', () => {
    renderWithProvider();
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('throws error when useAdminAuth used outside provider', () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
    expect(() => render(<TestConsumer />)).toThrow('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
    spy.mockRestore();
  });

  it('login succeeds with valid response', async () => {
    const mockResponse = {
      token: createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 }),
      usuario: { id: '1', nome: 'Admin Test', email: 'admin@test.com', perfil: 'admin' },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
      expect(screen.getByTestId('user').textContent).toBe('Admin Test');
    });

    // Verify sessionStorage
    expect(sessionStorage.getItem('admin_token')).toBe(mockResponse.token);
    expect(JSON.parse(sessionStorage.getItem('admin_user')!)).toEqual(mockResponse.usuario);
  });

  it('login returns error on 401', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ erro: 'Credenciais inválidas' }), { status: 401 })
    );

    renderWithProvider();

    await act(async () => {
      await loginViaButton();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });

  it('login returns error on 429 (rate limited)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ erro: 'Muitas tentativas' }), { status: 429 })
    );

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });
  });

  it('logout clears session and sessionStorage', async () => {
    // Pre-populate session
    const token = createFakeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('admin_user', JSON.stringify({ id: '1', nome: 'Admin', email: 'a@b.com', perfil: 'admin' }));

    renderWithProvider();

    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(sessionStorage.getItem('admin_token')).toBeNull();
    expect(sessionStorage.getItem('admin_user')).toBeNull();
  });

  it('removes expired token on initialization', () => {
    const expiredToken = createFakeJwt({ exp: Math.floor(Date.now() / 1000) - 100 });
    sessionStorage.setItem('admin_token', expiredToken);
    sessionStorage.setItem('admin_user', JSON.stringify({ id: '1', nome: 'Admin', email: 'a@b.com', perfil: 'admin' }));

    renderWithProvider();

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(sessionStorage.getItem('admin_token')).toBeNull();
  });

  it('periodic check clears expired token', async () => {
    vi.useFakeTimers();
    const now = Date.now();

    // Start with a valid token that expires in 30 seconds from "now"
    const token = createFakeJwt({ exp: Math.floor(now / 1000) + 30 });
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('admin_user', JSON.stringify({ id: '1', nome: 'Admin', email: 'a@b.com', perfil: 'admin' }));

    renderWithProvider();
    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    // Advance time past token expiration (30s) and then trigger the 60s interval
    await act(async () => {
      vi.advanceTimersByTime(61_000);
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });
});

// --- Helpers ---

function createFakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = 'fake-signature';
  return `${header}.${body}.${signature}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getContextValue() {
  // This is a trick — won't be used, we test via the rendered component
  return { login: async () => { } };
}

async function loginViaButton() {
  // The login button triggers context login internally
  screen.getByTestId('login-btn').click();
}
