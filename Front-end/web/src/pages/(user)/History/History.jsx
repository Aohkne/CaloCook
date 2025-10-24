import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTES } from '@/constants/routes';
import { getUserProfile } from '@/api/user';
import { getUserHistory, deleteHistory } from '@/api/history';
import styles from './History.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function History() {
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState([]);
    const [error, setError] = useState('');
    const [setRefreshing] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError('');

            const profileData = await getUserProfile();
            const userId = profileData._id || profileData.id;

            if (!userId) {
                setError('User not found');
                return;
            }

            // Use getUserHistory instead of searchHistoryByUserId
            const response = await getUserHistory(userId);

            if (response.statusCode === 200) {
                console.log('History data:', response.data); // Debug log
                setHistoryData(response.data || []);
            } else {
                setError('Failed to load history');
            }
        } catch (err) {
            console.error('Failed to load history:', err);
            setError('Failed to load history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const handleDelete = async (historyId) => {
        if (!window.confirm('Are you sure you want to delete this history item?')) {
            return;
        }

        try {
            await deleteHistory(historyId);
            setHistoryData(prev => prev.filter(item => item._id !== historyId));
        } catch (err) {
            console.error('Failed to delete history:', err);
            alert('Failed to delete history item');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            return 'Today';
        } else if (date.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'easy';
            case 'medium':
                return 'medium';
            case 'hard':
                return 'hard';
            default:
                return '';
        }
    };

    const groupHistoryByDate = (history) => {
        const grouped = {};

        history.forEach(item => {
            const date = new Date(item.consumedAt || item.createdAt);
            const dateKey = date.toDateString();

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }

            grouped[dateKey].push(item);
        });

        const sortedDates = Object.keys(grouped).sort((a, b) =>
            new Date(b) - new Date(a)
        );

        return sortedDates.map(date => ({
            date,
            items: grouped[date].sort((a, b) =>
                new Date(b.consumedAt || b.createdAt) - new Date(a.consumedAt || a.createdAt)
            )
        }));
    };

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('loading-spinner')}>
                        <Icon icon='heroicons:arrow-path' width='32' height='32' />
                        <p>Loading history...</p>
                    </div>
                </div>
            </div>
        );
    }

    const groupedHistory = groupHistoryByDate(historyData);
    const totalDishes = historyData.length;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Link to={ROUTES.DISH} className={cx('back-btn')}>
                    <Icon icon='bi:chevron-left' width='18' height='18' />
                    Back
                </Link>

                <div className={cx('header-section')}>
                    <div className={cx('nav-tabs')}>
                        <Link to={ROUTES.PROFILE_USER} className={cx('nav-tab')}>
                            <Icon icon='heroicons:user-solid' width='24' height='24' />
                            <span>My Profile</span>
                        </Link>
                        <Link to={ROUTES.CHANGE_PASSWORD} className={cx('nav-tab')}>
                            <Icon icon='heroicons:shield-check-solid' width='24' height='24' />
                            <span>Security</span>
                        </Link>
                        <div className={cx('nav-tab', 'active')}>
                            <Icon icon='mdi:history' width='24' height='24' />
                            <span>History</span>
                        </div>
                    </div>
                </div>

                <div className={cx('main-content')}>
                    <div className={cx('content-header')}>
                        <h2 className={cx('section-title')}>Eating History</h2>
                    </div>

                    {error && (
                        <div className={cx('error-message')}>
                            <p>{error}</p>
                            <button className={cx('retry-btn')} onClick={handleRefresh}>
                                Retry
                            </button>
                        </div>
                    )}

                    {!error && groupedHistory.length === 0 ? (
                        <div className={cx('empty-state')}>
                            <Icon icon='heroicons:clock' width='64' height='64' />
                            <h3>No History Yet</h3>
                            <p>Your eating history will appear here</p>
                        </div>
                    ) : (
                        <div className={cx('history-content')}>
                            <div className={cx('summary-card')}>
                                <p className={cx('summary-label')}>Total Dishes Cooked</p>
                                <p className={cx('summary-value')}>{totalDishes}</p>
                            </div>

                            {groupedHistory.map((dateGroup) => (
                                <div key={dateGroup.date} className={cx('date-section')}>
                                    <div className={cx('date-header')}>
                                        <Icon icon='heroicons:calendar-days' width='18' height='18' />
                                        <span className={cx('date-title')}>{formatDate(dateGroup.date)}</span>
                                        <span className={cx('date-count')}>
                                            {dateGroup.items.length} dish{dateGroup.items.length > 1 ? 'es' : ''}
                                        </span>
                                    </div>

                                    <div className={cx('date-items')}>
                                        {dateGroup.items.map((item) => (
                                            <div key={item._id} className={cx('history-item')}>
                                                <div className={cx('item-left')}>
                                                    <div className={cx('dish-icon')}>
                                                        <Icon icon='ph:fork-knife-bold' width='20' height='20' />
                                                    </div>
                                                    <div className={cx('dish-info')}>
                                                        <h4 className={cx('dish-name')}>{item.dish?.name || 'Unknown Dish'}</h4>
                                                        <div className={cx('dish-meta')}>
                                                            <span className={cx('meta-item')}>
                                                                <Icon icon='heroicons:clock' width='16' height='16' />
                                                                {item.dish?.cookingTime || 0} min
                                                            </span>
                                                            <span className={cx('difficulty', getDifficultyColor(item.dish?.difficulty))}>
                                                                {item.dish?.difficulty || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={cx('item-right')}>
                                                    <div className={cx('calories')}>
                                                        <span className={cx('calories-value')}>{item.dish?.calorie || 0}</span>
                                                        <span className={cx('calories-unit')}>kcal</span>
                                                    </div>
                                                    <span className={cx('time')}>{formatTime(item.consumedAt || item.createdAt)}</span>
                                                    <button
                                                        className={cx('delete-btn')}
                                                        onClick={() => handleDelete(item._id)}
                                                        title="Delete history"
                                                    >
                                                        <Icon icon='heroicons:trash' width='16' height='16' />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={cx('date-summary')}>
                                        <span>
                                            Total: {dateGroup.items.reduce((sum, item) => sum + (item.dish?.calorie || 0), 0)} kcal
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default History;