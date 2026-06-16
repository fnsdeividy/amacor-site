import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminDashboard from './AdminDashboard';

declare const global: { fetch: ReturnType<typeof vi.fn> };

// Mock useAdminAuth
const mockSession = {
  token: 'test-jwt-token',
  usuario: { id: '1', nome: 'Admin', email: 'admin@test.com', perfil: 'admin' as const },
  isAuthenticated: true,
};

vi.mock('../../contexts/AdminAuthContext', () => ({
  useAdminAuth: () => ({
    session: mockSession,
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    // Mock fetch that never resolves
    global.fetch = vi.fn(() => new Promise(() => { }));

    render(<AdminDashboard />);

    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(6);
    expect(skeletons[0]).toHaveAttribute('aria-label', 'Carregando contador');
  });

  it('renders counter cards on successful fetch', async () => {
    const mockContadores = {
      total: 100,
      pendentes: 25,
      enviadasCrm: 30,
      autorizadas: 20,
      negadas: 15,
      comPendencia: 10,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockContadores),
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Enviadas ao CRM')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Autorizadas')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Negadas')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Com Pendência')).toBeInTheDocument();
  });

  it('renders error state with retry button on fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Não foi possível carregar os dados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('retries fetching on retry button click', async () => {
    const mockContadores = {
      total: 5,
      pendentes: 2,
      enviadasCrm: 1,
      autorizadas: 1,
      negadas: 1,
      comPendencia: 0,
    };

    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContadores),
      });

    render(<AdminDashboard />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Click retry
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('renders empty state when all counters are zero', async () => {
    const mockContadores = {
      total: 0,
      pendentes: 0,
      enviadasCrm: 0,
      autorizadas: 0,
      negadas: 0,
      comPendencia: 0,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockContadores),
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma solicitação cadastrada')).toBeInTheDocument();
    });
  });

  it('renders error state when response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Não foi possível carregar os dados')).toBeInTheDocument();
  });

  it('sends Authorization header with JWT token', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ total: 1, pendentes: 1, enviadasCrm: 0, autorizadas: 0, negadas: 0, comPendencia: 0 }),
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/solicitacoes/contadores',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-jwt-token' },
        }),
      );
    });
  });

  it('renders the page heading', () => {
    global.fetch = vi.fn(() => new Promise(() => { }));

    render(<AdminDashboard />);

    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Visão geral das solicitações de autorização')).toBeInTheDocument();
  });

  it('counter cards have proper ARIA labels', async () => {
    const mockContadores = {
      total: 42,
      pendentes: 10,
      enviadasCrm: 8,
      autorizadas: 12,
      negadas: 7,
      comPendencia: 5,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockContadores),
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByLabelText('Total: 42')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Pendentes: 10')).toBeInTheDocument();
    expect(screen.getByLabelText('Enviadas ao CRM: 8')).toBeInTheDocument();
    expect(screen.getByLabelText('Autorizadas: 12')).toBeInTheDocument();
    expect(screen.getByLabelText('Negadas: 7')).toBeInTheDocument();
    expect(screen.getByLabelText('Com Pendência: 5')).toBeInTheDocument();
  });
});
