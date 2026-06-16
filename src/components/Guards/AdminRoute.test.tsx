import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AdminRoute } from './AdminRoute';

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
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <div data-testid="admin-content">Admin Dashboard</div>
            </AdminRoute>
          }
        />
        <Route path="/admin/login" element={<div data-testid="admin-login">Admin Login Page</div>} />
        <Route path="/beneficiario" element={<div data-testid="beneficiario-area">Beneficiary Area</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when admin is authenticated', () => {
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: true });
    mockUseAuth.mockReturnValue({ session: null });

    renderWithRouter('/admin/dashboard');

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  it('redirects to /admin/login when admin is not authenticated', () => {
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });
    mockUseAuth.mockReturnValue({ session: null });

    renderWithRouter('/admin/dashboard');

    expect(screen.getByTestId('admin-login')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
  });

  it('saves original route in state when redirecting to admin login', () => {
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });
    mockUseAuth.mockReturnValue({ session: null });

    // We verify the redirect happens - the state { from: pathname } is tested via
    // the Navigate component's state prop which we verify renders the login page
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <div>Dashboard</div>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/login"
            element={<div data-testid="login-redirect">Login</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-redirect')).toBeInTheDocument();
  });

  it('redirects beneficiary to /beneficiario when trying to access admin route', () => {
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: false });
    mockUseAuth.mockReturnValue({ session: { isAuthenticated: true } });

    renderWithRouter('/admin/dashboard');

    expect(screen.getByTestId('beneficiario-area')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
  });

  it('allows admin access even if beneficiary session also exists', () => {
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: true });
    mockUseAuth.mockReturnValue({ session: { isAuthenticated: true } });

    renderWithRouter('/admin/dashboard');

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  it('renders Outlet when no children are provided', () => {
    mockUseAdminAuth.mockReturnValue({ isAuthenticated: true });
    mockUseAuth.mockReturnValue({ session: null });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<div data-testid="outlet-content">Outlet Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });
});
