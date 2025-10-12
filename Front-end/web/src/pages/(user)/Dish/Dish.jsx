import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';
import classNames from 'classnames/bind';
import styles from './Dish.module.scss';
import { getDishes } from '@/api/dish';
import { getFavorites, addToFavorites, removeFromFavorites } from '@/api/favorite';
import { getWebImagePath } from '@/utils/imageHelper';
import { useNavigate } from 'react-router-dom';
const defaultImage = '/images/default-img.png';

const cx = classNames.bind(styles);

function Dish() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
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

  // Optimized getUserId - more concise
  const getUserId = () => {
    // Try different sources in order of preference
    let userId = getCookie('user_id') ||
      localStorage.getItem('user_id');

    // Last resort: decode from JWT token
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

  // Fetch user's favorite dishes
  const fetchFavorites = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await getFavorites(userId, {
        page: 1,
        limit: 100
      });

      if (response && response.code === 200 && response.data) {
        const favorites = Array.isArray(response.data) ? response.data : [];
        const favoriteSet = new Set(favorites.map(fav => fav.dishId));
        setFavoriteIds(favoriteSet);
      } else {
        setFavoriteIds(new Set());
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteIds(new Set());
    }
  };

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

  // Load dishes when component mount or page changes
  useEffect(() => {
    fetchDishes(currentPage);
  }, [currentPage]);

  // Load favorites after component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (dishId, e) => {
    e.stopPropagation();
    const userId = getUserId();

    if (!userId) {
      alert('Please login to add favorites');
      return;
    }

    try {
      const isFavorite = favoriteIds.has(dishId);

      if (isFavorite) {
        const response = await removeFromFavorites(userId, dishId);

        if (response && response.code === 200) {
          setFavoriteIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(dishId);
            return newSet;
          });
        }
      } else {
        const response = await addToFavorites(userId, dishId);

        if (response && response.code === 201) {
          setFavoriteIds(prev => {
            const newSet = new Set([...prev, dishId]);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error updating favorite. Please try again.');
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
                    className={cx('favorite-btn', {
                      'active': favoriteIds.has(dish._id)
                    })}
                    onClick={(e) => toggleFavorite(dish._id, e)}
                    title={favoriteIds.has(dish._id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Icon icon={favoriteIds.has(dish._id) ? "ph:heart-fill" : "ph:heart"} />
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
            <Icon icon="ph:caret-left-bold" width="20" height="20" />
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
            <Icon icon="ph:caret-right-bold" width="20" height="20" />
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

export default Dish;