import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * Guard de rota para páginas administrativas.
 * - Se admin NÃO autenticado: redireciona para /admin/login com state { from: pathname }
 * - Se beneficiário autenticado tentando acessar rota admin: redireciona para /beneficiario
 * - Se admin autenticado: renderiza children ou Outlet
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const { session } = useAuth();
  const location = useLocation();

  const isBeneficiaryAuthenticated = session?.isAuthenticated ?? false;

  // Beneficiary trying to access admin route → redirect to beneficiary area
  if (isBeneficiaryAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/beneficiario" replace />;
  }

  // Admin not authenticated → redirect to admin login, saving original route
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Admin authenticated → render children or Outlet
  return <>{children ?? <Outlet />}</>;
}
