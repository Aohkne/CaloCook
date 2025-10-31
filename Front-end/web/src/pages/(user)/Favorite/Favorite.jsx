import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';
import classNames from 'classnames/bind';
import styles from './Favorite.module.scss';
import { getFavorites, removeFromFavorites } from '@/api/favorite';
import { useNavigate } from 'react-router-dom';
import { getWebImagePath } from '@/utils/imageHelper';
const defaultImage = '/images/default-img.png';

const cx = classNames.bind(styles);

function FavoriteDish() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 8,
        hasNextPage: false,
        hasPrevPage: false
    });

    const toggleChat = () => setIsChatOpen((prev) => !prev);
    const navigate = useNavigate();
    const handleCardClick = (dishId) => {
        navigate(`/dish/${dishId}`);
    };

    // Helper function to get cookie value by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    // Same optimized getUserId as Dish component
    const getUserId = () => {
        let userId = getCookie('user_id') ||
            localStorage.getItem('user_id');

        if (!userId) {
            const accessToken = getCookie('accessToken');
            if (accessToken) {
                try {
                    const base64Url = accessToken.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const decoded = JSON.parse(jsonPayload);
                    userId = decoded.userId || decoded.id || decoded.sub;
                } catch (e) {
                    console.error('Error decoding token:', e);
                }
            }
        }

        return userId;
    };

    // Fetch favorite dishes from API
    const fetchFavorites = async (page = 1) => {
        const userId = getUserId();

        if (!userId) {
            setDishes([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getFavorites(userId, {
                page: page,
                limit: 8,
                sortBy: 'createdAt',
                order: 'desc'
            });

            if (response.code === 200 && Array.isArray(response.data)) {
                const favoriteDishes = response.data.map(favorite => ({
                    _id: favorite.dish._id || favorite.dishId,
                    name: favorite.dish.name,
                    cookingTime: favorite.dish.cookingTime,
                    calorie: favorite.dish.calorie,
                    difficulty: favorite.dish.difficulty,
                    description: favorite.dish.description,
                    imageUrl: favorite.dish.imageUrl,
                    isFavorite: true,
                    favoriteId: favorite._id
                }));

                setDishes(favoriteDishes);
                setPagination(response.pagination || {
                    totalPages: Math.ceil(favoriteDishes.length / 8),
                    totalItems: favoriteDishes.length,
                    itemsPerPage: 8,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            } else {
                setDishes([]);
                setPagination({
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 8,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setDishes([]);
            setPagination({
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: 8,
                hasNextPage: false,
                hasPrevPage: false
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch favorite dishes when component mounts or page changes
    useEffect(() => {
        fetchFavorites(currentPage);
    }, [currentPage]);

    const toggleFavorite = async (dishId, e) => {
        e.stopPropagation();
        const userId = getUserId();

        if (!userId) {
            alert('Please login to manage favorites');
            return;
        }

        try {
            const response = await removeFromFavorites(userId, dishId);

            if (response.code === 200) {
                const updatedDishes = dishes.filter(dish => dish._id !== dishId);
                setDishes(updatedDishes);

                const newTotalItems = pagination.totalItems - 1;
                const newTotalPages = Math.ceil(newTotalItems / pagination.itemsPerPage);

                if (updatedDishes.length === 0 && currentPage > 1 && newTotalPages >= 1) {
                    setCurrentPage(currentPage - 1);
                } else if (updatedDishes.length === 0 && newTotalItems > 0) {
                    fetchFavorites(currentPage);
                }
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
            if (error.response?.status === 400) {
                alert('Invalid request. Please check your login status.');
            } else {
                alert('Error removing favorite. Please try again.');
            }
        }
    };

    // Generate page numbers array dynamically
    const getPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= pagination.totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle image error - fallback to default image
    const handleImageError = (e) => {
        e.target.src = defaultImage;
    };

    return (
        <div className={cx('wrapper')}>
            <Navbar />

            <div className={cx('content')}>
                <div className={cx('dishes-grid')}>
                    {loading ? (
                        <div className={cx('loading')}>Loading favorite dishes...</div>
                    ) : (
                        dishes.map((dish) => (
                            <div key={dish._id} className={cx('dish-card')} onClick={() => handleCardClick(dish._id)}>
                                <div className={cx('card-image')}>
                                    <img
                                        src={dish.imageUrl && dish.imageUrl.trim() !== ""
                                            ? getWebImagePath(dish.imageUrl)
                                            : defaultImage
                                        }
                                        alt={dish.name}
                                        onError={handleImageError}
                                    />
                                    <div
                                        className={cx('favorite-btn', { 'active': dish.isFavorite })}
                                        onClick={(e) => toggleFavorite(dish._id, e)}
                                        title="Remove from favorites"
                                    >
                                        <Icon icon={dish.isFavorite ? "ph:heart-fill" : "ph:heart"} />
                                    </div>
                                </div>

                                <div className={cx('card-content')}>
                                    <h3 className={cx('dish-name')}>{dish.name}</h3>

                                    <div className={cx('dish-stats')}>
                                        <span className={cx('stat-item')}>
                                            <Icon icon="ph:clock" />
                                            {dish.cookingTime} Min
                                        </span>
                                        <span className={cx('stat-item')}>
                                            <Icon icon="ph:fire" />
                                            {dish.calorie} Kcal
                                        </span>
                                        <span className={cx('stat-item', 'difficulty')}>
                                            <Icon icon="ph:chef-hat" />
                                            {dish.difficulty?.charAt(0).toUpperCase() + dish.difficulty?.slice(1).toLowerCase()}
                                        </span>
                                    </div>

                                    <p className={cx('ingredients')}>{dish.description.length > 50 ? dish.description.substring(0, 50) + '...' : dish.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && dishes.length === 0 && (
                    <div className={cx('no-data')}>
                        <Icon icon="ph:heart" className={cx('empty-icon')} />
                        <p>No favorite dishes found</p>
                        <p>Start adding dishes to your favorites!</p>
                    </div>
                )}

                {!loading && pagination.totalPages > 0 && (
                    <div className={cx('pagination')}>
                        <button
                            className={cx('pagination-btn', 'prev')}
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage <= 1 || loading}
                        >
                            <Icon icon="ph:caret-left" />
                        </button>

                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                className={cx('pagination-btn', 'page-btn', { 'active': currentPage === page })}
                                onClick={() => handlePageChange(page)}
                                disabled={loading}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className={cx('pagination-btn', 'next')}
                            onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
                            disabled={currentPage >= pagination.totalPages || loading}
                        >
                            <Icon icon="ph:caret-right" />
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

export default FavoriteDish;