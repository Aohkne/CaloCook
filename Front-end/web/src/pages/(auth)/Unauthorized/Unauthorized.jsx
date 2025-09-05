import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

import { ROLE } from '@/constants/role';
import { ROUTES } from '@/constants/routes';

function Unauthorized() {
  const { userRole } = useAuth();

  const getHomeRoute = () => {
    return userRole === ROLE.ADMIN ? ROUTES.DASHBOARD : ROUTES.HOME;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1 style={{ fontSize: '4rem', color: '#dc3545', marginBottom: '1rem' }}>403</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        You don't have permission to access this page.
      </p>
      <Link
        to={getHomeRoute()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        Go Back to Home
      </Link>
    </div>
  );
}

export default Unauthorized;
