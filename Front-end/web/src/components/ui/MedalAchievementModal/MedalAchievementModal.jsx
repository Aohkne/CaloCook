import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom'; // ✅ THÊM
import { ROUTES } from '@/constants/routes'; // ✅ THÊM
import styles from './MedalAchievementModal.module.scss';

const cx = classNames.bind(styles);

function MedalAchievementModal({ visible, onClose, level, points }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate(); // ✅ THÊM

  const getMedalImage = (level) => {
    const medals = {
      bronze: '/images/level/bronze.png',
      silver: '/images/level/silver.png',
      gold: '/images/level/golden.png'
    };
    return medals[level] || medals.bronze;
  };

  const getLevelColor = (level) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700'
    };
    return colors[level] || '#FFD700';
  };

  const getLevelTitle = (level) => {
    const titles = {
      bronze: 'Bronze Chef',
      silver: 'Silver Chef',
      gold: 'Gold Chef'
    };
    return titles[level] || 'Chef';
  };

  const getLevelDescription = (level) => {
    const descriptions = {
      bronze: 'You have mastered the basics of cooking!',
      silver: 'You are becoming an expert chef!',
      gold: 'You have reached the pinnacle of culinary excellence!'
    };
    return descriptions[level] || 'Keep cooking to reach new heights!';
  };

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={cx('modal-overlay', { show: isAnimating })}>
      <div className={cx('modal-backdrop')} onClick={onClose}></div>
      
      <div className={cx('modal-content', { show: isAnimating })}>
        {/* Close Button */}
        <button className={cx('close-button')} onClick={onClose} aria-label="Close">
          <Icon icon="ph:x" width="24" height="24" />
        </button>

        {/* Left Side - Medal Display */}
        <div className={cx('medal-section')}>
          <div className={cx('medal-container')}>
            {/* Background Glow Layers */}
            <div 
              className={cx('glow-layer', 'glow-layer-1')}
              style={{ backgroundColor: getLevelColor(level) }}
            ></div>
            <div 
              className={cx('glow-layer', 'glow-layer-2')}
              style={{ backgroundColor: getLevelColor(level) }}
            ></div>
            <div 
              className={cx('glow-layer', 'glow-layer-3')}
              style={{ backgroundColor: getLevelColor(level) }}
            ></div>

            {/* Sparkles */}
            <div className={cx('sparkle-container')}>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={cx('sparkle')}
                  style={{
                    transform: `rotate(${i * 30}deg) translateX(180px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  <Icon 
                    icon="ph:sparkle-fill" 
                    width="24" 
                    height="24"
                    color={getLevelColor(level)}
                  />
                </div>
              ))}
            </div>

            {/* Medal Image */}
            <img
              src={getMedalImage(level)}
              alt={`${level} medal`}
              className={cx('medal-image')}
            />
          </div>
        </div>

        {/* Right Side - Information */}
        <div className={cx('info-section')}>
          {/* Congratulations Header */}
          <div className={cx('header')}>
            <div className={cx('trophy-icon')}>
              <Icon 
                icon="ph:trophy-fill" 
                width="48" 
                height="48"
                color={getLevelColor(level)}
              />
            </div>
            <h1 className={cx('congrats-text')}>Congratulations!</h1>
            <p className={cx('achievement-text')}>Achievement Unlocked</p>
          </div>

          {/* Level Info */}
          <div className={cx('level-info')}>
            <div 
              className={cx('level-badge')}
              style={{ 
                backgroundColor: `${getLevelColor(level)}20`,
                borderColor: getLevelColor(level)
              }}
            >
              <h2 
                className={cx('level-title')}
                style={{ color: getLevelColor(level) }}
              >
                {getLevelTitle(level)}
              </h2>
            </div>
            <p className={cx('level-description')}>
              {getLevelDescription(level)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className={cx('stats-grid')}>
            <div className={cx('stat-card')}>
              <div className={cx('stat-icon')}>
                <Icon 
                  icon="ph:star-fill" 
                  width="32" 
                  height="32"
                  color={getLevelColor(level)}
                />
              </div>
              <div className={cx('stat-info')}>
                <p className={cx('stat-label')}>Total Points</p>
                <p 
                  className={cx('stat-value')}
                  style={{ color: getLevelColor(level) }}
                >
                  {points || 0}
                </p>
              </div>
            </div>

            <div className={cx('stat-card')}>
              <div className={cx('stat-icon')}>
                <Icon 
                  icon="ph:medal-fill" 
                  width="32" 
                  height="32"
                  color={getLevelColor(level)}
                />
              </div>
              <div className={cx('stat-info')}>
                <p className={cx('stat-label')}>New Level</p>
                <p 
                  className={cx('stat-value', 'level-stat')}
                  style={{ color: getLevelColor(level) }}
                >
                  {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={cx('actions')}>
            <button
              className={cx('primary-button')}
              style={{ 
                backgroundColor: getLevelColor(level),
                boxShadow: `0 4px 12px ${getLevelColor(level)}40`
              }}
              onClick={onClose}
            >
              <Icon icon="ph:check-circle-fill" width="20" height="20" />
              Continue Cooking
            </button>
            <button
              className={cx('secondary-button')}
              onClick={() => {
                onClose();
                navigate(ROUTES.PROFILE_USER); // ✅ SỬA: Dùng navigate thay vì window.location
              }}
            >
              <Icon icon="ph:user-fill" width="20" height="20" />
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedalAchievementModal;