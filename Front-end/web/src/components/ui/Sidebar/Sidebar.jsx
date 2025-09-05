'use client';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Icon } from '@iconify/react';

import { useTheme } from '@/hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Sidebar() {
  const [isLocked, setIsLocked] = useState(localStorage.getItem('sidebarLock'));
  const [isVisible, setIsVisible] = useState(localStorage.getItem('sidebarLock'));
  let timeoutId = null;

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const sidebarLock = localStorage.getItem('sidebarLock');
    if (sidebarLock !== null) {
      setIsLocked(sidebarLock === 'true');
    } else {
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    if (isLocked !== null) {
      localStorage.setItem('sidebarLock', isLocked.toString());
    }
  }, [isLocked]);

  const hideSidebar = () => {
    if (!isLocked) {
      setIsVisible(false);
    }
  };

  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (!isLocked) {
      timeoutId = setTimeout(hideSidebar, 2000);
    }
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, isLocked]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX < 50) {
        setIsVisible(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div
      className={cx('wrapper', { hide: !isVisible })}
      onMouseEnter={() => setIsVisible(true)}
      onMouseMove={resetTimeout}
    >
      <div className={cx('content')}>
        <img src='/img/logo_word.png' alt='logo' />

        {/* List */}
        <div className={cx('title')}>Menu</div>

        <div className={cx('list', 'flex-1')}>
          <div className={cx('item')}>
            <Link to={ROUTES.DASHBOARD}>
              <Icon icon='ic:round-dashboard' width='20' height='20' />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className={cx('item')}>
            <Link to={ROUTES.USER_MANAGEMENT}>
              <Icon icon='mdi:user-group' width='20' height='20' />
              <span>User</span>
            </Link>
          </div>

          <div className={cx('item')}>
            <Link to={ROUTES.DISH_MANAGEMENT}>
              <Icon icon='bxs:dish' width='20' height='20' />
              <span>Dish</span>
            </Link>
          </div>
        </div>

        {/* Setting */}
        <div className={cx('title')}>Setting</div>
        <div className={cx('setting-bg')}>
          <div className={cx('item')}>
            Lock
            <label className={cx('toggle-switch')}>
              <input type='checkbox' checked={isLocked || false} onChange={() => setIsLocked((prev) => !prev)} />
              <span className={cx('slider')}></span>
            </label>
          </div>

          <div className={cx('item')}>
            Theme
            <label className={cx('toggle-switch')}>
              <input type='checkbox' checked={theme === 'dark'} onChange={toggleTheme} />
              <span className={cx('slider')}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={cx('action')}>
        <button className={cx('logout-btn')} onClick={handleLogout}>
          {/* <LogOut /> */}
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
