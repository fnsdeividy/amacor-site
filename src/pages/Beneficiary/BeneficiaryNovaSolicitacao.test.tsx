import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeneficiaryNovaSolicitacao, { validateFile } from './BeneficiaryNovaSolicitacao';
import * as AuthContext from '../../contexts/AuthContext';

declare const global: { fetch: typeof fetch };

// Mock useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function createMockFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

describe('validateFile', () => {
  it('accepts a valid PDF file', () => {
    const file = createMockFile('pedido.pdf', 1024, 'application/pdf');
    expect(validateFile(file)).toBeNull();
  });

  it('accepts a valid JPEG file', () => {
    const file = createMockFile('pedido.jpg', 1024, 'image/jpeg');
    expect(validateFile(file)).toBeNull();
  });

  it('accepts a valid PNG file', () => {
    const file = createMockFile('pedido.png', 1024, 'image/png');
    expect(validateFile(file)).toBeNull();
  });

  it('accepts a file exactly at 10MB', () => {
    const file = createMockFile('pedido.pdf', 10 * 1024 * 1024, 'application/pdf');
    expect(validateFile(file)).toBeNull();
  });

  it('rejects a file larger than 10MB', () => {
    const file = createMockFile('pedido.pdf', 10 * 1024 * 1024 + 1, 'application/pdf');
    const result = validateFile(file);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('size');
  });

  it('rejects invalid file types', () => {
    const file = createMockFile('pedido.doc', 1024, 'application/msword');
    const result = validateFile(file);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('format');
  });

  it('rejects a GIF file', () => {
    const file = createMockFile('pedido.gif', 1024, 'image/gif');
    const result = validateFile(file);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('format');
  });
});

describe('BeneficiaryNovaSolicitacao', () => {
  const mockSession = {
    parse: 'abc123',
    codigo: 'BEN001',
    nome: 'João Silva',
    cpfCnpj: '123.456.789-00',
    isAuthenticated: true,
  };

  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      session: mockSession,
      isLoading: false,
      error: null,
      login: vi.fn(),
      createLogin: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      handleParseExpired: vi.fn(),
    });
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <BeneficiaryNovaSolicitacao />
      </MemoryRouter>
    );
  }

  it('renders the form with all fields', () => {
    renderComponent();
    expect(screen.getByText('Nova Solicitação de Exame')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de exame\/procedimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prestador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pedido médico/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar Solicitação/i })).toBeInTheDocument();
  });

  it('shows file error when invalid file type is selected', () => {
    renderComponent();
    const fileInput = screen.getByLabelText(/Pedido médico/i);
    const invalidFile = createMockFile('doc.gif', 1024, 'image/gif');

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent('Formato inválido');
  });

  it('shows file error when file exceeds 10MB', () => {
    renderComponent();
    const fileInput = screen.getByLabelText(/Pedido médico/i);
    const largeFile = createMockFile('large.pdf', 11 * 1024 * 1024, 'application/pdf');

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent('tamanho máximo');
  });

  it('shows success message after valid file selection', () => {
    renderComponent();
    const fileInput = screen.getByLabelText(/Pedido médico/i);
    const validFile = createMockFile('pedido.pdf', 1024, 'application/pdf');

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByText(/Arquivo selecionado/i)).toBeInTheDocument();
  });

  it('shows error when submitting without file', async () => {
    renderComponent();

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Tipo de exame\/procedimento/i), {
      target: { value: 'Consulta' },
    });
    fireEvent.change(screen.getByLabelText(/Prestador/i), {
      target: { value: 'Hospital Municipal Rocha Faria' },
    });

    // Submit without file
    fireEvent.click(screen.getByRole('button', { name: /Enviar Solicitação/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('obrigatório anexar');
  });

  it('submits form with valid data and shows confirmation', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ numeroInterno: 42 }),
    });

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Tipo de exame\/procedimento/i), {
      target: { value: 'Consulta' },
    });
    fireEvent.change(screen.getByLabelText(/Prestador/i), {
      target: { value: 'Hospital Municipal Rocha Faria' },
    });

    const fileInput = screen.getByLabelText(/Pedido médico/i);
    const validFile = createMockFile('pedido.pdf', 1024, 'application/pdf');
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Enviar Solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Solicitação Registrada')).toBeInTheDocument();
      expect(screen.getByText(/Número interno: 42/)).toBeInTheDocument();
      expect(screen.getByText(/10 dias úteis/)).toBeInTheDocument();
    });
  });

  it('shows error on submission failure and preserves form data', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ erro: 'Erro de servidor' }),
    });

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Tipo de exame\/procedimento/i), {
      target: { value: 'Consulta' },
    });
    fireEvent.change(screen.getByLabelText(/Prestador/i), {
      target: { value: 'Hospital Municipal Rocha Faria' },
    });

    const fileInput = screen.getByLabelText(/Pedido médico/i);
    const validFile = createMockFile('pedido.pdf', 1024, 'application/pdf');
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Enviar Solicitação/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Erro de servidor');
    });

    // Form data is preserved
    expect(screen.getByLabelText(/Tipo de exame\/procedimento/i)).toHaveValue('Consulta');
    expect(screen.getByLabelText(/Prestador/i)).toHaveValue('Hospital Municipal Rocha Faria');
  });

  it('redirects to login if not authenticated', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      session: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      createLogin: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      handleParseExpired: vi.fn(),
    });

    renderComponent();
    // Navigate component doesn't render visible content
    expect(screen.queryByText('Nova Solicitação de Exame')).not.toBeInTheDocument();
  });
});
