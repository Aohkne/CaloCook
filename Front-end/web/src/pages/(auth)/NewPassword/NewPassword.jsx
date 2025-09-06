import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '@hooks/useTheme';

import { ROUTES } from '@/constants/routes';

import styles from './NewPassword.module.scss';
import classNames from 'classnames/bind';
import { resetPassword } from '@/api/auth';

const cx = classNames.bind(styles);

function NewPassword() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // HANDLE CANCEL
  const handleCancel = () => {
    navigate(ROUTES.RESET_PASSWORD);
  };

  // HANDLE RESET PASS
  const handleResetPass = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password does not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(otp.join(''), email, password);

      setSuccess('Password changed!');

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Reset password failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx('wrapper')}>
      {/* Header */}
      <div className={cx('header')}>
        <div className={cx('logo-container')}>
          <Link to={ROUTES.HOME}>
            <img src='/images/logo_word.png' alt='logo' />
          </Link>
        </div>

        <div className={cx('theme')}>
          <button className={cx('btn')} onClick={toggleTheme}>
            {theme === 'light' ? (
              <Icon icon='mdi:weather-night' width='20' height='20' color='#62a5f7' />
            ) : (
              <Icon icon='mdi:weather-sunny' width='20' height='20' color='#f5c658ff' />
            )}
          </button>
        </div>
      </div>

      {/* Modal */}
      <div className={cx('modal')}>
        {/* MSG */}
        {error && <div className={cx('error-message')}>{error}</div>}
        {success && <div className={cx('success-message')}>{success}</div>}

        <div className={cx('icon-container')}>
          <Icon icon='sidekickicons:password-solid' width='50' height='50' />
        </div>
        <div className={cx('title')}>NEW PASSWORD</div>
        <div className={cx('description')}>Set the new password for your account</div>

        {/* Password */}
        <div className={cx('input-form')}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => {
              setShowPassword(!showPassword);
              setError('');
              setSuccess('');
            }}
          >
            <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} width='20' height='20' />
          </span>
        </div>

        {/* Confirm Password */}
        <div className={cx('input-form')}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
              setSuccess('');
            }}
          />

          <div className={cx('action-show')}>
            {confirmPassword &&
              (confirmPassword === password ? (
                <Icon icon='line-md:check-all' width='20' height='20' color='#006955' />
              ) : (
                <Icon icon='line-md:close' width='20' height='20' color='#dc2e60' />
              ))}

            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} width='20' height='20' />
            </span>
          </div>
        </div>

        <div className={cx('action')}>
          <button className={cx('btn-form', 'cancle')} onClick={handleCancel} disabled={isLoading}>
            CANCEL
          </button>
          <button className={cx('btn-form')} onClick={handleResetPass} disabled={isLoading}>
            {isLoading ? 'PROGRESSING...' : 'RESET PASSWORD'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
