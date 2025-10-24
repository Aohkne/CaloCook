import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import { useTheme } from '@hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '@/hooks/useAuth';

const cx = classNames.bind(styles);

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      {/* Overlay */}
      {isDropdownOpen && <div className={cx('overlay')} onClick={closeDropdown}></div>}

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
              CaloBot
            </Link>
            <Link to={ROUTES.LEADERBOARD} className={cx('nav-item')}>
              
              Leaderboard
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
            <div className={cx('user-profile-container')} ref={dropdownRef}>
              <a href="#" className={cx('user-profile')} onClick={toggleDropdown}>
                <Icon icon='qlementine-icons:user-16' width='35' height='35' />
              </a>

              {isDropdownOpen && (
                <div className={cx('dropdown-menu')}>
                  <Link to={ROUTES.PROFILE_USER} className={cx('dropdown-item')} onClick={closeDropdown}>
                    <Icon icon='mingcute:user-3-fill' width='20' height='20' />
                    <span>Profile</span>
                  </Link>

                  <Link to={ROUTES.CHANGE_PASSWORD} className={cx('dropdown-item')} onClick={closeDropdown}>
                    <Icon icon='mingcute:safe-shield-fill' width='20' height='20' />
                    <span>Security</span>
                  </Link>

                  <div className={cx('dropdown-item')}>
                    <Icon icon='mingcute:history-fill' width='20' height='20' />
                    <span>History</span>
                  </div>

                  <div className={cx('dropdown-divider')}></div>

                  <Link className={cx('dropdown-item', 'logout')} onClick={handleLogout}>
                    <Icon icon='mingcute:exit-fill' width='20' height='20' />
                    <span>Logout</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;