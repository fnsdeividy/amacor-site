import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BeneficiaryRoute } from './BeneficiaryRoute';

// Mock the auth contexts
const mockUseAdminAuth = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../../contexts/AdminAuthContext', () => ({
  useAdminAuth: () => mockUseAdminAuth(),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

function renderWithRouter(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/beneficiario/boletos"
          element={
            <BeneficiaryRoute>
              <div data-testid="beneficiary-content">Boletos Page</div>
            </BeneficiaryRoute>
          }
        />
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        <Route path="/admin/dashboard" element={<div data-testid="admin-dashboard">Admin Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BeneficiaryRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when beneficiary is authenticated', () => {
    mockUseAuth.mockReturnValue({ session: { isAuthenticated: true } });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter('/beneficiario/boletos');

    expect(screen.getByTestId('beneficiary-content')).toBeInTheDocument();
  });

  it('redirects to /login when beneficiary is not authenticated', () => {
    mockUseAuth.mockReturnValue({ session: null });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter('/beneficiario/boletos');

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('beneficiary-content')).not.toBeInTheDocument();
  });

  it('redirects to /login when session exists but isAuthenticated is false', () => {
    mockUseAuth.mockReturnValue({ session: { isAuthenticated: false } });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter('/beneficiario/boletos');

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('redirects admin to /admin/dashboard when trying to access beneficiary route', () => {
    mockUseAuth.mockReturnValue({ session: null });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter('/beneficiario/boletos');

    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('beneficiary-content')).not.toBeInTheDocument();
  });

  it('allows beneficiary access even if admin session also exists', () => {
    mockUseAuth.mockReturnValue({ session: { isAuthenticated: true } });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter('/beneficiario/boletos');

    expect(screen.getByTestId('beneficiary-content')).toBeInTheDocument();
  });

  it('renders Outlet when no children are provided', () => {
    mockUseAuth.mockReturnValue({ session: { isAuthenticated: true } });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/beneficiario/boletos']}>
        <Routes>
          <Route path="/beneficiario" element={<BeneficiaryRoute />}>
            <Route path="boletos" element={<div data-testid="outlet-content">Outlet Boletos</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('redirects to /login when session is undefined', () => {
    mockUseAuth.mockReturnValue({ session: undefined });
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter('/beneficiario/boletos');

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
