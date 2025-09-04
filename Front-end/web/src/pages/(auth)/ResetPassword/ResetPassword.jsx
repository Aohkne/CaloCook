import { Icon } from '@iconify/react';

import { useTheme } from '@hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import styles from './ResetPassword.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ResetPassword() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cx('wrapper')}>
      {/* Header */}
      <div className={cx('header')}>
        <div className={cx('theme')}>
          <button className={cx('btn')} onClick={toggleTheme}>
            {theme === 'light' ? (
              <Icon icon='mdi:weather-night' width='20' height='20' color='#62a5f7' />
            ) : (
              <Icon icon='mdi:weather-sunny' width='20' height='20' color='#f5c658ff' />
            )}
          </button>
        </div>

        <div className={cx('logo-container')}>
          <Link to={ROUTES.HOME}>
            <img src='/img/logo_word.png' alt='logo' />
          </Link>
        </div>

        {/* Container */}

        <div className='modal'></div>
      </div>
    </div>
  );
}

export default ResetPassword;
