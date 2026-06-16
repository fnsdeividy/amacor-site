import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminSolicitacoes from './AdminSolicitacoes';

declare const global: { fetch: typeof fetch };

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

function renderComponent() {
  return render(
    <MemoryRouter>
      <AdminSolicitacoes />
    </MemoryRouter>
  );
}

const mockSolicitacoes = [
  {
    id: 'uuid-1',
    numeroInterno: 1,
    protocolo: 'AMC-20250115-00001',
    nomeBeneficiario: 'João da Silva',
    codigoBeneficiario: '12345',
    cpfCnpj: '123.456.789-00',
    tipoExame: 'Consulta',
    nomeExame: 'Hemograma Completo',
    criadoEm: '2025-01-15T10:30:00Z',
    status: 'Pendente de análise',
    enviadoCrm: false,
  },
  {
    id: 'uuid-2',
    numeroInterno: 2,
    protocolo: 'AMC-20250115-00002',
    nomeBeneficiario: 'Maria Oliveira',
    codigoBeneficiario: '67890',
    cpfCnpj: '987.654.321-00',
    tipoExame: 'Exame',
    nomeExame: 'Ressonância Magnética',
    criadoEm: '2025-01-14T09:00:00Z',
    status: 'Autorizada',
    enviadoCrm: true,
  },
];

function createPaginatedResponse(dados = mockSolicitacoes, paginaAtual = 1, totalPaginas = 1, totalRegistros = 2) {
  return { dados, paginaAtual, totalPaginas, totalRegistros };
}

describe('AdminSolicitacoes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page heading', () => {
    global.fetch = vi.fn(() => new Promise(() => { }));
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: 'Solicitações' })).toBeInTheDocument();
    expect(screen.getByText('Gerencie as solicitações de autorização de exames')).toBeInTheDocument();
  });

  it('renders loading skeleton initially', () => {
    global.fetch = vi.fn(() => new Promise(() => { }));
    renderComponent();

    expect(screen.getByRole('status', { name: 'Carregando solicitações' })).toBeInTheDocument();
  });

  it('renders table with data on successful fetch', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    expect(screen.getByText('AMC-20250115-00001')).toBeInTheDocument();
    expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Pendente de análise')).toBeInTheDocument();
    expect(screen.getByText('Autorizada')).toBeInTheDocument();
    expect(screen.getByText('15/01/2025')).toBeInTheDocument();
    expect(screen.getByText('14/01/2025')).toBeInTheDocument();
  });

  it('renders envio CRM column with Sim/Não', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Sim')).toBeInTheDocument();
    });

    expect(screen.getByText('Não')).toBeInTheDocument();
  });

  it('renders Detalhar links for each row', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      const links = screen.getAllByText('Detalhar');
      expect(links).toHaveLength(2);
      expect(links[0].closest('a')).toHaveAttribute('href', '/admin/solicitacoes/uuid-1');
      expect(links[1].closest('a')).toHaveAttribute('href', '/admin/solicitacoes/uuid-2');
    });
  });

  it('renders error state with retry button on fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Não foi possível carregar as solicitações')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('retries fetching on retry button click', async () => {
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse()),
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });
  });

  it('renders empty state when no solicitations exist', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse([], 1, 0, 0)),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Nenhuma solicitação registrada')).toBeInTheDocument();
    });
  });

  it('renders no results state when filters yield no results', async () => {
    // First fetch: returns data
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse()),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse([], 1, 0, 0)),
      });

    renderComponent();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    // Expand filter panel
    fireEvent.click(screen.getByText('Filtros'));

    // Fill in a filter
    const nomeInput = screen.getByLabelText('Nome do beneficiário');
    fireEvent.change(nomeInput, { target: { value: 'Inexistente' } });

    // Submit filter
    fireEvent.click(screen.getByRole('button', { name: /Buscar/ }));

    await waitFor(() => {
      expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
    });
  });

  it('sends correct query parameters with filters', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse()),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse()),
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    // Expand filter panel
    fireEvent.click(screen.getByText('Filtros'));

    // Fill in filters
    fireEvent.change(screen.getByLabelText('Nome do beneficiário'), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Autorizada' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Buscar/ }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      const lastCallUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[1][0];
      expect(lastCallUrl).toContain('nome=Jo%C3%A3o');
      expect(lastCallUrl).toContain('status=Autorizada');
      expect(lastCallUrl).toContain('pagina=1');
    });
  });

  it('sends Authorization header with JWT token', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-jwt-token' },
        }),
      );
    });
  });

  it('renders pagination controls when multiple pages', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse(mockSolicitacoes, 1, 5, 100)),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText('Navegação de páginas')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Página anterior')).toBeDisabled();
    expect(screen.getByLabelText('Próxima página')).not.toBeDisabled();
    // Text is split across elements, so use a function matcher
    const nav = screen.getByLabelText('Navegação de páginas');
    expect(nav).toHaveTextContent('Página 1 de 5');
  });

  it('navigates to next page when clicking Próximo', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse(mockSolicitacoes, 1, 3, 60)),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse(mockSolicitacoes, 2, 3, 60)),
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText('Próxima página')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Próxima página'));

    await waitFor(() => {
      const lastCallUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[1][0];
      expect(lastCallUrl).toContain('pagina=2');
    });
  });

  it('shows CPF validation error for invalid CPF', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    // Expand filter panel
    fireEvent.click(screen.getByText('Filtros'));

    // Enter invalid CPF
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '123' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Buscar/ }));

    expect(screen.getByText('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos')).toBeInTheDocument();
  });

  it('shows period validation error when end date is before start date', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    // Expand filter panel
    fireEvent.click(screen.getByText('Filtros'));

    // Enter invalid period
    fireEvent.change(screen.getByLabelText('Data início'), { target: { value: '2025-01-15' } });
    fireEvent.change(screen.getByLabelText('Data fim'), { target: { value: '2025-01-10' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Buscar/ }));

    expect(screen.getByText('A data final deve ser posterior à data inicial')).toBeInTheDocument();
  });

  it('clears filters and reloads data', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse()),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createPaginatedResponse()),
      });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    // Expand filter panel
    fireEvent.click(screen.getByText('Filtros'));

    // Fill in a filter
    fireEvent.change(screen.getByLabelText('Nome do beneficiário'), { target: { value: 'test' } });

    // Clear
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    // Verify the input was cleared
    expect(screen.getByLabelText('Nome do beneficiário')).toHaveValue('');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('renders filter panel as collapsible', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createPaginatedResponse()),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
    });

    // Filter panel should be collapsed by default
    expect(screen.queryByLabelText('Nome do beneficiário')).not.toBeInTheDocument();

    // Expand
    fireEvent.click(screen.getByText('Filtros'));

    // Now filter fields should be visible
    expect(screen.getByLabelText('Nome do beneficiário')).toBeInTheDocument();
    expect(screen.getByLabelText('CPF/CNPJ')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });
});
