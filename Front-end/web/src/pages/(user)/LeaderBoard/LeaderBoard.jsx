import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames/bind';
import styles from './LeaderBoard.module.scss';
import { getLeaderboard } from '@/api/achievement';
import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';

const cx = classNames.bind(styles);

const getMedalIcon = (rank) => {
  if (rank === 1) return { icon: 'noto:1st-place-medal', color: '#FFD700' };
  if (rank === 2) return { icon: 'noto:2nd-place-medal', color: '#C0C0C0' };
  if (rank === 3) return { icon: 'noto:3rd-place-medal', color: '#CD7F32' };
  return { icon: 'heroicons:user-circle', color: '#6B7280' };
};

const getLevelBadge = (level) => {
  const badges = {
    gold: { image: '/images/level/golden.png', label: 'GOLD', color: '#FFD700' },
    silver: { image: '/images/level/silver.png', label: 'SILVER', color: '#C0C0C0' },
    bronze: { image: '/images/level/bronze.png', label: 'BRONZE', color: '#CD7F32' },
    none: { icon: 'heroicons:star', label: 'BEGINNER', color: '#9CA3AF' }
  };
  return badges[level] || badges.none;
};

function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard(page, 50, 'totalPoints', 'desc');

        setLeaderboard(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [page]);

  return (
    <div className={cx('wrapper')}>
      <Navbar />

      <div className={cx('content')}>
        <div className={cx('header')}>
          <Icon icon='heroicons:trophy' width='48' height='48' />
          <h1 className={cx('title')}>Leaderboard</h1>
          <p className={cx('subtitle')}>Top chefs with the highest achievement points</p>
        </div>

        {loading ? (
          <div className={cx('loading')}>Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className={cx('no-data')}>
            <Icon icon='heroicons:trophy' />
            <p>No achievements yet</p>
            <p>Start cooking dishes to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className={cx('leaderboard-list')}>
            {leaderboard.map((user, index) => {
              const rank = (page - 1) * 50 + index + 1;
              const medalInfo = getMedalIcon(rank);
              const levelBadge = getLevelBadge(user.currentLevel);

              return (
                <div key={user.userId} className={cx('leaderboard-item', `rank-${rank}`)}>
                  <div className={cx('rank')}>
                    <Icon icon={medalInfo.icon} width='32' height='32' />
                    <span className={cx('rank-number')}>#{rank}</span>
                  </div>

                  <div className={cx('user-info')}>
                    <div className={cx('avatar')}>
                      {user.userInfo.avatarUrl ? (
                        <img src={user.userInfo.avatarUrl} alt={user.userInfo.fullName} />
                      ) : (
                        <Icon icon='heroicons:user-circle' width='48' height='48' />
                      )}
                    </div>
                    <div className={cx('details')}>
                      <h3 className={cx('name')}>{user.userInfo.fullName}</h3>
                      <p className={cx('username')}>@{user.userInfo.username}</p>
                    </div>
                  </div>

                  <div className={cx('stats')}>
                    <div className={cx('stat')} title='Easy dishes'>
                      <Icon icon='heroicons:face-smile' width='20' height='20' />
                      <span className={cx('stat-number')}>{user.easyDishCount}</span>
                    </div>
                    <div className={cx('stat')} title='Medium dishes'>
                      <Icon icon='heroicons:fire' width='20' height='20' />
                      <span className={cx('stat-number')}>{user.mediumDishCount}</span>
                    </div>
                    <div className={cx('stat')} title='Hard dishes'>
                      <Icon icon='heroicons:bolt' width='20' height='20' />
                      <span className={cx('stat-number')}>{user.hardDishCount}</span>
                    </div>
                  </div>

                  <div className={cx('level-badge')} style={{ color: levelBadge.color }}>
                    {levelBadge.image ? (
                      <img
                        src={levelBadge.image}
                        alt={levelBadge.label}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                    ) : (
                      <Icon icon={levelBadge.icon} width='40' height='40' />
                    )}
                  </div>
                  <div className={cx('points')}>
                    <Icon icon='heroicons:star' width='24' height='24' />
                    <span className={cx('points-value')}>{user.totalPoints.toLocaleString()}</span>
                    <span className={cx('points-label')}>points</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && pagination && (
          <div className={cx('pagination')}>
            <button className={cx('page-btn')} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <Icon icon='ph:caret-left' width='20' height='20' />
              Previous
            </button>

            <span className={cx('page-info')}>
              Page {page} of {pagination.totalPages}
            </span>

            <button
              className={cx('page-btn')}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
            >
              Next
              <Icon icon='ph:caret-right' width='20' height='20' />
            </button>
          </div>
        )}
      </div>

      <div className={cx('chat-icon')} onClick={toggleChat}>
        <Icon icon='line-md:chat-round-filled' />
      </div>
      {isChatOpen && <ChatBox isChatOpen={isChatOpen} toggleChat={toggleChat} />}
    </div>
  );
}

export default LeaderBoard;
