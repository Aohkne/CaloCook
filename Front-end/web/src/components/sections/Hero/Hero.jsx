import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import styles from './Hero.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '@/hooks/useAuth';

const cx = classNames.bind(styles);

function Hero() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <div className={cx('wrapper')}>
      <div className={cx('content')}>
        <div className={cx('title')}>Hungry? Swipe left!</div>
        <div className={cx('description')}>Eat what you love, track what you need</div>

        {!isAuthenticated() ? (
          <Link to={ROUTES.REGISTER} className={cx('action')}>
            Create account
          </Link>
        ) : (
          <Link to={userRole === 'user' ? ROUTES.DISH : ROUTES.DASHBOARD} className={cx('action')}>
            Explore
          </Link>
        )}
      </div>
    </div>
  );
}

export default Hero;
