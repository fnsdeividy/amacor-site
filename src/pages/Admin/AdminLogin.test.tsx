import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AdminAuthContext', () => ({
  useAdminAuth: () => ({
    login: mockLogin,
    isLoading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderAdminLogin(initialEntries = ['/admin/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    renderAdminLogin();

    expect(screen.getByRole('heading', { name: 'Painel Administrativo' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('email field has correct attributes', () => {
    renderAdminLogin();

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('maxLength', '254');
  });

  it('password field has correct attributes', () => {
    renderAdminLogin();

    const senhaInput = screen.getByLabelText('Senha');
    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(senhaInput).toHaveAttribute('required');
    expect(senhaInput).toHaveAttribute('minLength', '8');
    expect(senhaInput).toHaveAttribute('maxLength', '128');
  });

  it('calls login with email and password on submit', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderAdminLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhasegura123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@amacor.com.br', 'senhasegura123');
    });
  });

  it('navigates to /admin/dashboard on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderAdminLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhasegura123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
    });
  });

  it('displays error message on invalid credentials (401)', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Credenciais inválidas' });
    renderAdminLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhaerrada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas');
    });
  });

  it('displays rate limit error on 429', async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    });
    renderAdminLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhaerrada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Muitas tentativas. Tente novamente em 15 minutos.'
      );
    });
  });

  it('displays network error message', async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: 'Erro de conexão. Verifique sua rede e tente novamente.',
    });
    renderAdminLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhasegura123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Erro de conexão. Verifique sua rede e tente novamente.'
      );
    });
  });

  it('maintains email value on failed login attempt', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Credenciais inválidas' });
    renderAdminLogin();

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhaerrada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(emailInput).toHaveValue('admin@amacor.com.br');
  });

  it('clears previous error when submitting again', async () => {
    mockLogin
      .mockResolvedValueOnce({ success: false, error: 'Credenciais inválidas' })
      .mockResolvedValueOnce({ success: true });
    renderAdminLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@amacor.com.br' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhaerrada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
