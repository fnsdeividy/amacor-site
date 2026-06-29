import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface BeneficiaryRouteProps {
  children?: React.ReactNode;
}

/**
 * Guard de rota para páginas do beneficiário.
 * - Se beneficiário NÃO autenticado: redireciona para /login com state.from (para retorno)
 * - Se admin autenticado tentando acessar rota beneficiário: redireciona para /admin/dashboard
 * - Se beneficiário autenticado: renderiza children ou Outlet
 */
export function BeneficiaryRoute({ children }: BeneficiaryRouteProps) {
  const { session } = useAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();

  const isBeneficiaryAuthenticated = session?.isAuthenticated ?? false;

  // Admin trying to access beneficiary route → redirect to admin dashboard
  if (isAdminAuthenticated && !isBeneficiaryAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Beneficiary not authenticated → redirect to login, preservando a URL de destino
  if (!isBeneficiaryAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Beneficiary authenticated → render children or Outlet
  return <>{children ?? <Outlet />}</>;
}
