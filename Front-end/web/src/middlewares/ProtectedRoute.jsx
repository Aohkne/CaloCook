import { Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

import { ROUTES } from '@/constants/routes';

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, userRole } = useAuth();

  // CHECK LOGIN
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // CHECK ROLE
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}

export default ProtectedRoute;
