import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { ROLE } from '@/constants/role';

function PublicRoute({ children, restricted = false }) {
  const { isAuthenticated, userRole } = useAuth();

  // Hạn chế -> bật false, (restricted = true) và USER LOGGED
  if (restricted && isAuthenticated()) {
    // NAVIGATE FOLLOW ROLE
    if (userRole === ROLE.ADMIN) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.DISH} replace />;
    }
  }

  return children;
}

export default PublicRoute;
