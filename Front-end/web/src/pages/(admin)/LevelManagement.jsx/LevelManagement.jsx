import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import Sidebar from '@/components/ui/Sidebar/Sidebar';
import { getLevelConfiguration, updateLevelConfiguration } from '@/api/achievement';

import styles from './LevelManagement.module.scss';

const cx = classNames.bind(styles);

function LevelManagement() {
  const [levels, setLevels] = useState({
    bronze: 100,
    silver: 500,
    gold: 1000
  });

  const [difficulties, setDifficulties] = useState({
    easy: 10,
    medium: 50,
    hard: 100
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLevelConfig();
  }, []);

  const fetchLevelConfig = async () => {
    try {
      setLoading(true);
      const response = await getLevelConfiguration();
      const data = response.data.data;

      setLevels({
        bronze: data.levels.bronze,
        silver: data.levels.silver,
        gold: data.levels.gold
      });

      setDifficulties({
        easy: data.difficulties.easy,
        medium: data.difficulties.medium,
        hard: data.difficulties.hard
      });
    } catch (error) {
      console.error('Failed to fetch level config:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (level, value) => {
    const numValue = parseInt(value) || 0;
    setLevels((prev) => ({ ...prev, [level]: numValue }));
  };

  const handleDifficultyChange = (difficulty, value) => {
    const numValue = parseInt(value) || 0;
    setDifficulties((prev) => ({ ...prev, [difficulty]: numValue }));
  };

  const handleSave = async () => {
    // Validation
    if (levels.bronze >= levels.silver || levels.silver >= levels.gold) {
      setMessage({
        type: 'error',
        text: 'Level thresholds must be: Bronze < Silver < Gold'
      });
      return;
    }

    if (difficulties.easy >= difficulties.medium || difficulties.medium >= difficulties.hard) {
      setMessage({
        type: 'error',
        text: 'Difficulty points must be: Easy < Medium < Hard'
      });
      return;
    }

    try {
      setSaving(true);
      await updateLevelConfiguration({
        levels,
        difficulties
      });

      setMessage({ type: 'success', text: 'Configuration updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to update config:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update configuration' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchLevelConfig();
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className={cx('wrapper')}>
        <Sidebar />
        <div className={cx('loading')}>
          <Icon icon='line-md:loading-twotone-loop' width='48' height='48' />
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      <div className={cx('container')}>
        <div className={cx('header')}>
          <Icon icon='heroicons:trophy' width='48' height='48' />
          <div>
            <h1 className={cx('title')}>Level Management</h1>
            <p className={cx('subtitle')}>Configure achievement levels and difficulty points</p>
          </div>
        </div>

        {message.text && (
          <div className={cx('message', message.type)}>
            <Icon
              icon={message.type === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'}
              width='24'
              height='24'
            />
            <span>{message.text}</span>
          </div>
        )}

        <div className={cx('content')}>
          {/* Level Thresholds Section */}
          <div className={cx('section')}>
            <div className={cx('section-header')}>
              <Icon icon='noto:medal' width='32' height='32' />
              <h2 className={cx('section-title')}>Medal Level Thresholds</h2>
            </div>
            <p className={cx('section-description')}>Set the minimum points required to achieve each medal level</p>

            <div className={cx('cards')}>
              <div className={cx('card', 'bronze')}>
                <div className={cx('card-header')}>
                  <Icon icon='noto:3rd-place-medal' width='48' height='48' />
                  <h3>Bronze Medal</h3>
                </div>
                <div className={cx('input-group')}>
                  <label>Minimum Points</label>
                  <div className={cx('input-wrapper')}>
                    <Icon icon='heroicons:star' width='20' height='20' />
                    <input
                      type='number'
                      value={levels.bronze}
                      onChange={(e) => handleLevelChange('bronze', e.target.value)}
                      min='1'
                    />
                  </div>
                </div>
                <div className={cx('card-info')}>
                  Players need <strong>{levels.bronze}</strong> points to unlock
                </div>
              </div>

              <div className={cx('card', 'silver')}>
                <div className={cx('card-header')}>
                  <Icon icon='noto:2nd-place-medal' width='48' height='48' />
                  <h3>Silver Medal</h3>
                </div>
                <div className={cx('input-group')}>
                  <label>Minimum Points</label>
                  <div className={cx('input-wrapper')}>
                    <Icon icon='heroicons:star' width='20' height='20' />
                    <input
                      type='number'
                      value={levels.silver}
                      onChange={(e) => handleLevelChange('silver', e.target.value)}
                      min={levels.bronze + 1}
                    />
                  </div>
                </div>
                <div className={cx('card-info')}>
                  Players need <strong>{levels.silver}</strong> points to unlock
                </div>
              </div>

              <div className={cx('card', 'gold')}>
                <div className={cx('card-header')}>
                  <Icon icon='noto:1st-place-medal' width='48' height='48' />
                  <h3>Gold Medal</h3>
                </div>
                <div className={cx('input-group')}>
                  <label>Minimum Points</label>
                  <div className={cx('input-wrapper')}>
                    <Icon icon='heroicons:star' width='20' height='20' />
                    <input
                      type='number'
                      value={levels.gold}
                      onChange={(e) => handleLevelChange('gold', e.target.value)}
                      min={levels.silver + 1}
                    />
                  </div>
                </div>
                <div className={cx('card-info')}>
                  Players need <strong>{levels.gold}</strong> points to unlock
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Points Section */}
          <div className={cx('section')}>
            <div className={cx('section-header')}>
              <Icon icon='heroicons:fire' width='32' height='32' />
              <h2 className={cx('section-title')}>Difficulty Points</h2>
            </div>
            <p className={cx('section-description')}>
              Set points awarded for completing dishes at each difficulty level
            </p>

            <div className={cx('cards')}>
              <div className={cx('card', 'easy')}>
                <div className={cx('card-header')}>
                  <Icon icon='heroicons:face-smile' width='48' height='48' />
                  <h3>Easy Dishes</h3>
                </div>
                <div className={cx('input-group')}>
                  <label>Points Awarded</label>
                  <div className={cx('input-wrapper')}>
                    <Icon icon='heroicons:plus-circle' width='20' height='20' />
                    <input
                      type='number'
                      value={difficulties.easy}
                      onChange={(e) => handleDifficultyChange('easy', e.target.value)}
                      min='1'
                    />
                  </div>
                </div>
                <div className={cx('card-info')}>
                  Players earn <strong>+{difficulties.easy}</strong> points
                </div>
              </div>

              <div className={cx('card', 'medium')}>
                <div className={cx('card-header')}>
                  <Icon icon='heroicons:fire' width='48' height='48' />
                  <h3>Medium Dishes</h3>
                </div>
                <div className={cx('input-group')}>
                  <label>Points Awarded</label>
                  <div className={cx('input-wrapper')}>
                    <Icon icon='heroicons:plus-circle' width='20' height='20' />
                    <input
                      type='number'
                      value={difficulties.medium}
                      onChange={(e) => handleDifficultyChange('medium', e.target.value)}
                      min={difficulties.easy + 1}
                    />
                  </div>
                </div>
                <div className={cx('card-info')}>
                  Players earn <strong>+{difficulties.medium}</strong> points
                </div>
              </div>

              <div className={cx('card', 'hard')}>
                <div className={cx('card-header')}>
                  <Icon icon='heroicons:bolt' width='48' height='48' />
                  <h3>Hard Dishes</h3>
                </div>
                <div className={cx('input-group')}>
                  <label>Points Awarded</label>
                  <div className={cx('input-wrapper')}>
                    <Icon icon='heroicons:plus-circle' width='20' height='20' />
                    <input
                      type='number'
                      value={difficulties.hard}
                      onChange={(e) => handleDifficultyChange('hard', e.target.value)}
                      min={difficulties.medium + 1}
                    />
                  </div>
                </div>
                <div className={cx('card-info')}>
                  Players earn <strong>+{difficulties.hard}</strong> points
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('actions')}>
          <button className={cx('btn', 'btn-reset')} onClick={handleReset} disabled={saving}>
            <Icon icon='heroicons:arrow-path' width='20' height='20' />
            Reset
          </button>
          <button className={cx('btn', 'btn-save')} onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Icon icon='line-md:loading-twotone-loop' width='20' height='20' />
                Saving...
              </>
            ) : (
              <>
                <Icon icon='heroicons:check' width='20' height='20' />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LevelManagement;