import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { useTheme } from '@hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '@/hooks/useAuth';

const cx = classNames.bind(styles);

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo-container')}>
        <Link to={ROUTES.HOME}>
          <img src='/images/logo_word.png' alt='logo' />
        </Link>

        <div className={cx('nav-list')}>
          <Link to={ROUTES.DISH} className={cx('nav-item')}>
            Dish
          </Link>

          <Link to={ROUTES.FAVORITE} className={cx('nav-item')}>
            Favorite
          </Link>

          <Link to={ROUTES.CHAT_AI} className={cx('nav-item')}>
            AI
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
          <Link to={'/'} className={cx('user-profile')}>
            <Icon icon='qlementine-icons:user-16' width='35' height='35' />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
