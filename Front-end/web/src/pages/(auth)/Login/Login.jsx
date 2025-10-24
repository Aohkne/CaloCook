import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

import { ROLE } from '@/constants/role';
import { ROUTES } from '@/constants/routes';

import { randomMessages } from '@/data/randomMessages';

import { login, googleLogin } from '@/api/auth';

import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import { GoogleLogin } from '@react-oauth/google';

const cx = classNames.bind(styles);

function Login() {
  const { theme, toggleTheme } = useTheme();
  const { login: authLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [currentMessage, setCurrentMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(''); // 'user', 'bot', 'complete'

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await login(usernameOrEmail, password);

      authLogin(response.accessToken, response.refreshToken, response.role);

      setSuccess('Login successful!');

      setTimeout(() => {
        if (response.role === ROLE.ADMIN) {
          navigate(ROUTES.DASHBOARD);
        } else {
          navigate(ROUTES.DISH);
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await googleLogin(credentialResponse.credential);
      console.log('Google login response:', response);

      authLogin(response.user.accessToken, response.user.refreshToken, response.user.role);

      setSuccess('Google login successful!');

      setTimeout(() => {
        if (response.user.role === ROLE.ADMIN) {
          navigate(ROUTES.DASHBOARD);
        } else {
          navigate(ROUTES.DISH);
        }
      }, 1500);
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.response?.data?.message || 'Google login failed. Please try again.');
      setTimeout(() => {
        setError('');
      }, 10000);
    } finally {
      setIsLoading(false);
    }
  };

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
            <img src='/images/logo_word.png' alt='logo' />
          </Link>
        </div>
      </div>

      {/* Container */}
      <div className={cx('container')}>
        {/* MSG */}
        {error && <div className={cx('error-message')}>{error}</div>}
        {success && <div className={cx('success-message')}>{success}</div>}

        {/* Left */}
        <div className={cx('form-container')}>
          <div className={cx('title')}>SIGN IN</div>

          <div className={cx('form-content')}>
            {/* Username */}
            <div className={cx('input-form')}>
              <input
                type='text'
                value={usernameOrEmail}
                placeholder='Email/Username'
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
              />
            </div>

            {/* Password */}
            <div className={cx('input-form')}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder='Password'
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} width='20' height='20' />
              </span>
            </div>

            <div className={cx('forget-container')}>
              <Link to={ROUTES.FORGET_PASSWORD}>Forget password ?</Link>
            </div>

            <button className={cx('btn-form')} onClick={handleLogin} disabled={isLoading}>
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>

            <div className={cx('divider')}>
              <span className={cx('divider-line')}></span>
              <span className={cx('divider-text')}>OR</span>
              <span className={cx('divider-line')}></span>
            </div>

            <div className={cx('google-login-wrapper')}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setError('Google login failed. Please try again.');
                }}
                useOneTap
                theme='filled_blue'
                size='large'
                text='continue_with'
                shape='rectangular'
                width='100%'
              />
            </div>

            <div className={cx('navigate')}>
              Not a member? <Link to={ROUTES.REGISTER}>Sign up now</Link>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={cx('image-container')}>
          <div className={cx('title')}>Welcome Back to CaloCook</div>
          <div className={cx('description')}>Continue your journey to better health by logging into your account.</div>

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
                  <img src='/images/icon_Bot.png' alt='bot' />
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
      </div>
    </div>
  );
}

export default Login;
