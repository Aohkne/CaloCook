import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';
import classNames from 'classnames/bind';
import styles from './Favorite.module.scss';
import { getDishes } from '@/api/dish';
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

    // Fetch dishes from API
    const fetchDishes = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getDishes({
                page: page,
                limit: 8,
                isActive: true
            });

            if (response.code === 200) {
                setDishes(response.data || []);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching dishes:', error);
            setDishes([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch dishes when component mounts or page changes
    useEffect(() => {
        fetchDishes(currentPage);
    }, [currentPage]);

    const toggleFavorite = (id) => {
        setDishes(prevDishes =>
            prevDishes.map(dish =>
                dish._id === id ? { ...dish, isFavorite: !dish.isFavorite } : dish
            )
        );
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
        setCurrentPage(page);
    };

    // Handle image error - fallback to default image
    const handleImageError = (e) => {
        e.target.src = defaultImage;
    };

    return (
        <div className={cx('wrapper')}>
            <Navbar />

            <div className={cx('content')}>
                <div className={cx('search-filter-section')}>
                    <div className={cx('search-bar')}>
                        <Icon icon="ph:magnifying-glass" className={cx('search-icon')} />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            className={cx('search-input')}
                        />
                    </div>

                    <div className={cx('filter-button')}>
                        <Icon icon="ph:funnel" />
                    </div>
                </div>

                <div className={cx('dishes-grid')}>
                    {loading ? (
                        <div className={cx('loading')}>Loading...</div>
                    ) : (
                        dishes.map((dish) => (
                            <div key={dish._id} className={cx('dish-card')}>
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
                                        onClick={() => toggleFavorite(dish._id)}
                                    >
                                        <Icon icon={dish.isFavorite ? "ph:heart-fill" : "ph:heart"} />
                                    </div>
                                </div>

                                <div className={cx('card-content')}>
                                    <h3 className={cx('dish-name')}>{dish.name}</h3>

                                    <div className={cx('dish-stats')}>
                                        <span className={cx('stat-item')}>
                                            <Icon icon="ph:clock" />
                                            {dish.cookingTime} min
                                        </span>
                                        <span className={cx('stat-item')}>
                                            <Icon icon="ph:fire" />
                                            {dish.calorie} kcal
                                        </span>
                                        <span className={cx('stat-item', 'difficulty')}>
                                            <Icon icon="ph:chef-hat" />
                                            {dish.difficulty}
                                        </span>
                                    </div>

                                    <p className={cx('ingredients')}>{dish.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && dishes.length === 0 && (
                    <div className={cx('no-data')}>No dishes found</div>
                )}

                <div className={cx('pagination')}>
                    <button
                        className={cx('pagination-btn', 'prev')}
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={!pagination.hasPrevPage || loading}
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
                        disabled={!pagination.hasNextPage || loading}
                    >
                        <Icon icon="ph:caret-right" />
                    </button>
                </div>
            </div>

            <div className={cx('chat-icon')} onClick={toggleChat}>
                <Icon icon='line-md:chat-round-filled' />
            </div>
            {isChatOpen && <ChatBox isChatOpen={isChatOpen} toggleChat={toggleChat} />}
        </div>
    );
}

export default FavoriteDish;