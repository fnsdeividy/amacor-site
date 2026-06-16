import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface BeneficiaryRouteProps {
  children?: React.ReactNode;
}

/**
 * Guard de rota para páginas do beneficiário.
 * - Se beneficiário NÃO autenticado: redireciona para /login
 * - Se admin autenticado tentando acessar rota beneficiário: redireciona para /admin/dashboard
 * - Se beneficiário autenticado: renderiza children ou Outlet
 */
export function BeneficiaryRoute({ children }: BeneficiaryRouteProps) {
  const { session } = useAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  const isBeneficiaryAuthenticated = session?.isAuthenticated ?? false;

  // Admin trying to access beneficiary route → redirect to admin dashboard
  if (isAdminAuthenticated && !isBeneficiaryAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Beneficiary not authenticated → redirect to login
  if (!isBeneficiaryAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Beneficiary authenticated → render children or Outlet
  return <>{children ?? <Outlet />}</>;
}
