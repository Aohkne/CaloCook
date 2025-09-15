import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';

import { useTheme } from '@hooks/useTheme';

import { REGEX } from '@/constants/regex';
import { ROUTES } from '@/constants/routes';

import { forgotPassword } from '@/api/auth';

import styles from './ForgetPassword.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ForgetPassword() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');

  const handleForgetPass = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please fill in email field');
      return;
    }

    if (!REGEX.EMAIL.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await forgotPassword(email);

      setSuccess('Your OTP has been sent!');

      setTimeout(() => {
        navigate(ROUTES.RESET_PASSWORD, { state: { email } });
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
          <Icon icon='mdi:password-reset' width='50' height='50' />
        </div>
        <div className={cx('title')}>RESET PASSWORD</div>
        <div className={cx('description')}>Enter your email to reset your pasword</div>

        <div className={cx('input-form')}>
          <input
            type='email'
            value={email}
            placeholder='Email'
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
              setSuccess('');
            }}
          />
        </div>

        <button className={cx('btn-form')} onClick={handleForgetPass} disabled={isLoading}>
          {isLoading ? 'CONTINUING...' : 'CONTINUE'}
        </button>

        <div className={cx('navigate')}>
          Don’t have access anymore? <Link to={ROUTES.REGISTER}>Try another method</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
