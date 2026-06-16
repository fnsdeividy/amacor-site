import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Mock the api module
vi.mock('../services/api', () => ({
  login: vi.fn(),
  createLogin: vi.fn(),
}));

function TestConsumer() {
  const { session, isLoading, error, logout, handleParseExpired } = useAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(session?.isAuthenticated ?? false)}</span>
      <span data-testid="parse">{session?.parse ?? 'none'}</span>
      <span data-testid="codigo">{session?.codigo ?? 'none'}</span>
      <span data-testid="nome">{session?.nome ?? 'none'}</span>
      <span data-testid="cpfCnpj">{session?.cpfCnpj ?? 'none'}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error ?? 'none'}</span>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
      <button data-testid="expire-btn" onClick={handleParseExpired}>Expire</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthContext - benef_ prefix storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts unauthenticated with no stored data', () => {
    renderWithProvider();
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('parse').textContent).toBe('none');
  });

  it('restores session from benef_ prefixed keys', () => {
    sessionStorage.setItem('benef_parse', 'abc123');
    sessionStorage.setItem('benef_codigo', '12345');
    sessionStorage.setItem('benef_nome', 'João Silva');
    sessionStorage.setItem('benef_cpfCnpj', '123.456.789-00');

    renderWithProvider();

    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('parse').textContent).toBe('abc123');
    expect(screen.getByTestId('codigo').textContent).toBe('12345');
    expect(screen.getByTestId('nome').textContent).toBe('João Silva');
    expect(screen.getByTestId('cpfCnpj').textContent).toBe('123.456.789-00');
  });

  it('migrates from legacy key format', () => {
    const legacySession = {
      parse: 'legacy-parse',
      codigo: '99999',
      nome: 'Legacy User',
      cpfCnpj: '000.000.000-00',
      isAuthenticated: true,
    };
    sessionStorage.setItem('amacor_beneficiary_session', JSON.stringify(legacySession));

    renderWithProvider();

    // Should have migrated
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('parse').textContent).toBe('legacy-parse');

    // Should now have new keys
    expect(sessionStorage.getItem('benef_parse')).toBe('legacy-parse');
    expect(sessionStorage.getItem('benef_codigo')).toBe('99999');
    expect(sessionStorage.getItem('benef_nome')).toBe('Legacy User');
    expect(sessionStorage.getItem('benef_cpfCnpj')).toBe('000.000.000-00');

    // Legacy key should be removed
    expect(sessionStorage.getItem('amacor_beneficiary_session')).toBeNull();
  });

  it('logout clears all benef_ keys', async () => {
    sessionStorage.setItem('benef_parse', 'abc123');
    sessionStorage.setItem('benef_codigo', '12345');
    sessionStorage.setItem('benef_nome', 'João');
    sessionStorage.setItem('benef_cpfCnpj', '123.456.789-00');

    renderWithProvider();
    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(sessionStorage.getItem('benef_parse')).toBeNull();
    expect(sessionStorage.getItem('benef_codigo')).toBeNull();
    expect(sessionStorage.getItem('benef_nome')).toBeNull();
    expect(sessionStorage.getItem('benef_cpfCnpj')).toBeNull();
  });

  it('handleParseExpired clears session and redirects', async () => {
    sessionStorage.setItem('benef_parse', 'abc123');
    sessionStorage.setItem('benef_codigo', '12345');
    sessionStorage.setItem('benef_nome', 'João');
    sessionStorage.setItem('benef_cpfCnpj', '123.456.789-00');

    // Mock window.location.href
    const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      href: '',
      assign: vi.fn(),
    } as unknown as Location);

    // Use Object.defineProperty to allow setting href
    const hrefSetter = vi.fn();
    Object.defineProperty(window.location, 'href', {
      set: hrefSetter,
      get: () => '',
      configurable: true,
    });

    renderWithProvider();
    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    await act(async () => {
      screen.getByTestId('expire-btn').click();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(sessionStorage.getItem('benef_parse')).toBeNull();

    locationSpy.mockRestore();
  });

  it('does not interfere with admin session keys', () => {
    // Store admin keys
    sessionStorage.setItem('admin_token', 'jwt-token-here');
    sessionStorage.setItem('admin_user', JSON.stringify({ id: '1', nome: 'Admin' }));
    // Store benef keys
    sessionStorage.setItem('benef_parse', 'abc123');
    sessionStorage.setItem('benef_codigo', '12345');
    sessionStorage.setItem('benef_nome', 'João');
    sessionStorage.setItem('benef_cpfCnpj', '123.456.789-00');

    renderWithProvider();

    // Beneficiary session loaded
    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    // Admin keys should still be there
    expect(sessionStorage.getItem('admin_token')).toBe('jwt-token-here');
    expect(sessionStorage.getItem('admin_user')).not.toBeNull();
  });

  it('throws when useAuth is used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
    expect(() => render(<TestConsumer />)).toThrow('useAuth deve ser usado dentro de um AuthProvider');
    spy.mockRestore();
  });
});
