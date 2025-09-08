import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { useTheme } from '@hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

import { ROUTES } from '@/constants/routes';

import styles from './Header.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, userRole } = useAuth();

  console.log(userRole);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo-container')}>
        <Link to={ROUTES.HOME}>
          <img src='/images/logo_word.png' alt='logo' />
        </Link>

        <div className={cx('nav-list')}>
          <Link to={ROUTES.HOME} className={cx('nav-item')}>
            Home
          </Link>

          <Link to={ROUTES.SUPPORT} className={cx('nav-item')}>
            Support
          </Link>

          <Link to={ROUTES.DOWNLOAD} className={cx('nav-item')}>
            Download
          </Link>
        </div>
      </div>

      <div className={cx('action')}>
        <button className={cx('btn')} onClick={toggleTheme}>
          {theme === 'light' ? (
            <Icon icon='mdi:weather-night' width='20' height='20' color='#62a5f7' />
          ) : (
            <Icon icon='mdi:weather-sunny' width='20' height='20' color='#f5c658ff' />
          )}
        </button>
        {!isAuthenticated() ? (
          <Link to={ROUTES.LOGIN} className={cx('btn-login')}>
            Login
          </Link>
        ) : (
          <Link to={userRole === 'user' ? ROUTES.DISH : ROUTES.DASHBOARD} className={cx('btn-login')}>
            Explore
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
