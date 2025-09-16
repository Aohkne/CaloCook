import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

import { ROLE } from '@/constants/role';
import { ROUTES } from '@/constants/routes';

import styles from './Unauthorized.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Unauthorized() {
  const { userRole } = useAuth();

  const getHomeRoute = () => {
    return userRole === ROLE.ADMIN ? ROUTES.DASHBOARD : ROUTES.DISH;
  };

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('error-code')}>403</h1>
      <h2 className={cx('error-title')}>Access Denied</h2>
      <p className={cx('error-description')}>You don't have permission to access this page.</p>
      <Link to={getHomeRoute()} className={cx('back-link')}>
        Go Back to Home
      </Link>
    </div>
  );
}

export default Unauthorized;
