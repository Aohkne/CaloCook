import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { useTheme } from '@hooks/useTheme';

import { REGEX } from '@/constants/regex';
import { ROUTES } from '@/constants/routes';

import { randomMessages } from '@/data/randomMessages';

import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import { register } from '@/api/auth';

const cx = classNames.bind(styles);

function Register() {
  const { theme, toggleTheme } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [currentMessage, setCurrentMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(''); // 'user', 'bot', 'complete'

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const showRandomMessage = () => {
      if (Math.random() > 0.4) {
        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        const selectedMessage = randomMessages[randomIndex];

        setCurrentMessage(selectedMessage);
        setShowMessage(true);

        // Start with user animation
        setAnimationPhase('user');

        // After user animation ->  bot animation
        setTimeout(() => {
          setAnimationPhase('bot');
        }, 600); // User animation duration

        // Mark  complete
        setTimeout(() => {
          setAnimationPhase('complete');
        }, 4000); // User + Bot animation duration

        // Hide message after 10 seconds
        timeoutRef.current = setTimeout(() => {
          setShowMessage(false);
          setAnimationPhase('');

          // Clean up
          setTimeout(() => {
            setCurrentMessage(null);
          }, 300);
        }, 8000);
      }
    };

    // Show first message after 1 seconds
    const initialTimeout = setTimeout(showRandomMessage, 1000);

    // Then show messages every 4-6 seconds randomly
    intervalRef.current = setInterval(() => {
      showRandomMessage();
    }, Math.random() * 2000 + 4000); // 4-6 seconds

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!REGEX.EMAIL.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password does not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(username, email, password);

      setSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Register failed. Please try again.');
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
            <img src='/img/logo_word.png' alt='logo' />
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

      {/* Container */}
      <div className={cx('container')}>
        {/* MSG */}
        {error && <div className={cx('error-message')}>{error}</div>}
        {success && <div className={cx('success-message')}>{success}</div>}

        {/* Left */}
        <div className={cx('image-container')}>
          <div className={cx('title')}>Start Your Healthy Journey</div>
          <div className={cx('description')}>
            Join CaloCook today and track your meals, calories, and progress toward a healthier lifestyle.
          </div>

          {/* Message  */}
          <div className={cx('msg-container')}>
            {showMessage && currentMessage && (
              <div className={cx('random-message')}>
                <div
                  className={cx(
                    'message-bubble',
                    'user-message',
                    animationPhase === 'user' && 'animate-user',
                    (animationPhase === 'bot' || animationPhase === 'complete') && 'user-complete'
                  )}
                >
                  <div className={cx('message-content')}>{currentMessage.user}</div>
                </div>
                <div
                  className={cx(
                    'message-bubble',
                    'bot-message',
                    animationPhase === 'bot' && 'animate-bot',
                    animationPhase === 'complete' && 'bot-complete'
                  )}
                >
                  <img src='/img/icon_Bot.png' alt='bot' />
                  <div className={cx('message-content')}>{currentMessage.bot}</div>
                </div>
              </div>
            )}
          </div>

          <div className={cx('footer')}>
            Make With
            <Icon icon='line-md:heart-filled' width='20' height='20' color='#DC2E60' />
          </div>
        </div>

        {/* Right */}
        <div className={cx('form-container')}>
          <div className={cx('title')}>SIGN UP</div>
          <div className={cx('form-content')}>
            {/* Email */}
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

            {/* Username */}
            <div className={cx('input-form')}>
              <input
                type='text'
                value={username}
                placeholder='Username'
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                  setSuccess('');
                }}
              />
            </div>

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

              <div className={cx('action')}>
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

            <button className={cx('btn-form')} onClick={handleRegister} disabled={isLoading}>
              {isLoading ? 'REGISTERING...' : 'REGISTER'}
            </button>

            <div className={cx('divider')}>
              <span className={cx('divider-line')}></span>
              <span className={cx('divider-text')}>OR</span>
              <span className={cx('divider-line')}></span>
            </div>

            <button className={cx('btn-google')}>
              GOOGLE
              <Icon icon='flat-color-icons:google' width='20' height='20' />
            </button>

            <div className={cx('navigate')}>
              Already have an account? <Link to={ROUTES.LOGIN}>Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
