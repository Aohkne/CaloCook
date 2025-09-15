'use client';

import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useTheme } from '@/hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import { logout } from '@/api/auth';

import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Sidebar() {
  const [isLocked, setIsLocked] = useState(() => {
    const stored = localStorage.getItem('sidebarLock');
    return stored !== null ? stored === 'true' : true;
  });

  const [isVisible, setIsVisible] = useState(() => {
    const stored = localStorage.getItem('sidebarLock');
    return stored !== null ? stored === 'true' : true;
  });

  let timeoutId = null;

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await logout();
      console.log(response || 'Logout successfully.');

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      console.error(error.response?.data?.message || 'Logout fail. Please try again.');
    }
  };

  return (
    <div
      className={cx('wrapper', { hide: !isVisible })}
      onMouseEnter={() => setIsVisible(true)}
      onMouseMove={resetTimeout}
    >
      <div className={cx('content')}>
        <Link to={ROUTES.HOME}>
          <img src='/images/logo_word.png' alt='logo' />
        </Link>

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
              <span>Users</span>
            </Link>
          </div>

          <div className={cx('item')}>
            <Link to={ROUTES.DISH_MANAGEMENT}>
              <Icon icon='bxs:dish' width='20' height='20' />
              <span>Dishs</span>
            </Link>
          </div>

          <div className={cx('item')}>
            <Link to={ROUTES.CHAT}>
              <Icon icon='mdi:chat' width='20' height='20' />
              <span>Chat</span>
            </Link>
          </div>

          <div className={cx('item')}>
            <Link to={ROUTES.PROFILE_ADMIN}>
              <Icon icon='mingcute:user-edit-fill' width='20' height='20' />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Setting */}
        <div className={cx('title')}>Setting</div>
        <div className={cx('setting-bg')}>
          <div className={cx('item')}>
            Lock
            <label className={cx('toggle-switch')}>
              <input type='checkbox' checked={Boolean(isLocked)} onChange={() => setIsLocked((prev) => !prev)} />
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
          <Icon icon='material-symbols:logout-rounded' width='20' height='20' />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
