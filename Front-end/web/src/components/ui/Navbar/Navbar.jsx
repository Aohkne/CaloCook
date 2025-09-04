import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { useTheme } from '@hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cx('wrapper')}>
      <div className={cx('logo-container')}>
        <Link to={ROUTES.HOME}>
          <img src='/img/logo_word.png' alt='logo' />
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

        <Link to={ROUTES.LOGIN} className={cx('btn-login')}>
          Login
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
