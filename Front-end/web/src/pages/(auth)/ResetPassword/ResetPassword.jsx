import { Icon } from '@iconify/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import { useTheme } from '@hooks/useTheme';
import { ROUTES } from '@/constants/routes';

import { forgotPassword } from '@/api/auth';

import styles from './ResetPassword.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ResetPassword() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  // State OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Effect count down resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  //HANDLE INPUT OTP
  const handleInputChange = (index, value) => {
    // NUMBER / ONLY 1 CHAR
    if (!/^\d*$/.test(value) || value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // AUTO NEXT
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (error) setError('');
  };

  // HANDLE INPUT
  const handleKeyDown = (index, e) => {
    // HANDLE DELETE
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    // HANDLE PASTE
    if (e.key === 'v' && e.ctrlKey) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedNumbers = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < 6; i++) {
          newOtp[i] = pastedNumbers[i] || '';
        }
        setOtp(newOtp);

        // Focus vào ô cuối cùng có giá trị
        const lastFilledIndex = Math.min(pastedNumbers.length - 1, 5);
        if (lastFilledIndex >= 0) {
          inputRefs.current[lastFilledIndex]?.focus();
        }
      });
    }
  };

  // HANDLE SEND OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    setSuccess('Navigate to add new Password!');

    setTimeout(() => {
      navigate(ROUTES.NEW_PASSWORD, { state: { email, otp } });
    }, 2000);
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const response = await forgotPassword(email);

      if (response) {
        setSuccess('New OTP has been resent!');
        setCountdown(60); // COUNT: 60 giây
        setOtp(['', '', '', '', '', '']); // RESET OTP
        inputRefs.current[0]?.focus();

        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Can not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLE CANCEL
  const handleCancel = () => {
    navigate(ROUTES.FORGET_PASSWORD);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
        {/* Messages */}
        {error && <div className={cx('error-message')}>{error}</div>}
        {success && <div className={cx('success-message')}>{success}</div>}

        <div className={cx('icon-container')}>
          <Icon icon='fluent:password-reset-48-filled' width='50' height='50' />
        </div>

        <div className={cx('title')}>VERIFICATION CODE</div>

        <div className={cx('description')}>
          We've sent a code to <span>{email}</span>
        </div>

        <div className={cx('input-container')}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              inputMode='numeric'
              maxLength='1'
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              disabled={isLoading}
              style={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            />
          ))}
        </div>

        <div className={cx('navigate')}>
          Didn't get a code?{' '}
          {countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <Link onClick={handleResendOTP} style={{ cursor: 'pointer' }}>
              Click to resend
            </Link>
          )}
        </div>

        <div className={cx('action')}>
          <button className={cx('btn-form', 'cancle')} onClick={handleCancel} disabled={isLoading}>
            CANCEL
          </button>
          <button
            className={cx('btn-form', 'verify')}
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? 'VERIFYING...' : 'VERIFY'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
