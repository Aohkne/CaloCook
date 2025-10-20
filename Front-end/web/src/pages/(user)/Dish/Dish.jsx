import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';
import classNames from 'classnames/bind';
import styles from './Dish.module.scss';
import { getDishes } from '@/api/dish';
import { getFavorites, addToFavorites, removeFromFavorites } from '@/api/favorite';
import { useNavigate, useLocation } from 'react-router-dom';
import { getWebImagePath } from '@/utils/imageHelper';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [difficulty, setDifficulty] = useState([]);
  const [cookingTimeRange, setCookingTimeRange] = useState({ min: 5, max: 60 });
  const [calorieRange, setCalorieRange] = useState({ min: 5, max: 2000 });

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = (dishId) => {
    navigate(`/dish/${dishId}`);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getUserId = () => {
    let userId = getCookie('user_id') || localStorage.getItem('user_id');

    if (!userId) {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        try {
          const base64Url = accessToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          userId = decoded.userId || decoded.id || decoded.sub;
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      }
    }

    return userId;
  };

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
        const favoriteSet = new Set(favorites.map((fav) => fav.dishId));
        setFavoriteIds(favoriteSet);
      } else {
        setFavoriteIds(new Set());
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteIds(new Set());
    }
  };

  const fetchDishes = async (page = 1, name = searchQuery) => {
    setLoading(true);
    try {
      // Normalize difficulty: if multiple selected, send as comma-separated string
      let difficultyParam = '';
      if (Array.isArray(difficulty) && difficulty.length > 0) {
        difficultyParam = difficulty.join(',');
      } else if (difficulty) {
        difficultyParam = difficulty;
      }

      const response = await getDishes({
        page: page,
        limit: 8,
        isActive: true,
        name: name,
        minCookingTime: cookingTimeRange.min,
        maxCookingTime: cookingTimeRange.max,
        minCalorie: calorieRange.min,
        maxCalorie: calorieRange.max,
        difficulty: difficultyParam
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

  useEffect(() => {
    // Nếu có state từ navigation (ví dụ: { refresh: true })
    if (location.state?.refresh) {
      fetchDishes(currentPage);
      // Clear state để tránh refresh nhiều lần
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
          setFavoriteIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(dishId);
            return newSet;
          });
        }
      } else {
        const response = await addToFavorites(userId, dishId);

        if (response && response.code === 201) {
          setFavoriteIds((prev) => {
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    fetchDishes(1, e.target.value);
  };

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  // Handle Change Difficulty
  const handleDifficultyChange = (e) => {
    const { value, checked } = e.target;

    setDifficulty((prev) => {
      if (checked) {
        // Add difficulty if checked
        return [...prev, value];
      } else {
        // Remove if unchecked
        return prev.filter((item) => item !== value);
      }
    });
  };

  const handleCookingTimeRangeChange = (type) => (e) => {
    const value = parseInt(e.target.value);
    setCookingTimeRange((prev) => {
      if (type === 'min') {
        return { ...prev, min: Math.min(value, prev.max) };
      } else {
        return { ...prev, max: Math.max(value, prev.min) };
      }
    });
  };

  const handleCalorieRangeChange = (type) => (e) => {
    const value = parseInt(e.target.value);
    setCalorieRange((prev) => {
      if (type === 'min') {
        return { ...prev, min: Math.min(value, prev.max) };
      } else {
        return { ...prev, max: Math.max(value, prev.min) };
      }
    });
  };

  // Handle Apply Filter
  const handleApplyFilter = () => {
    setCurrentPage(1);
    fetchDishes(1);
    setOpenFilterModal(false);
  };

  return (
    <div className={cx('wrapper')}>
      <Navbar />

      <div className={cx('content')}>
        <div className={cx('search-filter-section')}>
          <div className={cx('search-bar')}>
            <Icon icon='ph:magnifying-glass' className={cx('search-icon')} />
            <input
              type='text'
              placeholder='Search dishes...'
              className={cx('search-input')}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className={cx('filter-button')} onClick={handleOpenFilterModal}>
            <Icon icon='ph:funnel' />
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
                    src={dish.imageUrl && dish.imageUrl.trim() !== '' ? getWebImagePath(dish.imageUrl) : defaultImage}
                    alt={dish.name}
                    onError={handleImageError}
                  />
                  <div
                    className={cx('favorite-btn', {
                      active: favoriteIds.has(dish._id)
                    })}
                    onClick={(e) => toggleFavorite(dish._id, e)}
                    title={favoriteIds.has(dish._id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Icon icon={favoriteIds.has(dish._id) ? 'ph:heart-fill' : 'ph:heart'} />
                  </div>
                </div>

                <div className={cx('card-content')}>
                  <h3 className={cx('dish-name')}>{dish.name}</h3>

                  <div className={cx('dish-stats')}>
                    <span className={cx('stat-item')}>
                      <Icon icon='ph:clock' />
                      {dish.cookingTime} Min
                    </span>
                    <span className={cx('stat-item')}>
                      <Icon icon='ph:fire' />
                      {dish.calorie} Kcal
                    </span>
                    <span className={cx('stat-item', 'difficulty')}>
                      <Icon icon='ph:chef-hat' />
                      {dish.difficulty?.charAt(0).toUpperCase() + dish.difficulty?.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <p className={cx('ingredients')}>
                    {dish.description.length > 50 ? dish.description.substring(0, 50) + '...' : dish.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && dishes.length === 0 && <div className={cx('no-data')}>No dishes found</div>}

        <div className={cx('pagination')}>
          <button
            className={cx('pagination-btn', 'prev')}
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={!pagination.hasPrevPage || loading}
          >
            <Icon icon='ph:caret-left-bold' width='20' height='20' />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={cx('pagination-btn', 'page-btn', { active: currentPage === page })}
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
            <Icon icon='ph:caret-right-bold' width='20' height='20' />
          </button>
        </div>
      </div>

      <div className={cx('chat-icon')} onClick={toggleChat}>
        <Icon icon='line-md:chat-round-filled' />
      </div>
      {isChatOpen && <ChatBox isChatOpen={isChatOpen} toggleChat={toggleChat} />}

      {openFilterModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <button
              type='button'
              className={cx('modal-close-button')}
              onClick={handleCloseFilterModal}
              aria-label='Close modal'
            >
              <Icon icon='material-symbols-light:close' width='24' height='24' />
            </button>
            <div className={cx('modal-form')}>
              {/* Difficulty */}
              <div className={cx('form-group', 'difficulty-group')}>
                <span className={cx('modal-input-label')}>Difficulty</span>
                <div className={cx('difficulty-blocks')}>
                  <label className={cx('difficulty-block')}>
                    <input
                      onChange={handleDifficultyChange}
                      checked={difficulty.includes('easy')}
                      type='checkbox'
                      name='difficulty'
                      value='easy'
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Easy</span>
                  </label>
                  <label className={cx('difficulty-block')}>
                    <input
                      onChange={handleDifficultyChange}
                      checked={difficulty.includes('medium')}
                      type='checkbox'
                      name='difficulty'
                      value='medium'
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Medium</span>
                  </label>
                  <label className={cx('difficulty-block')}>
                    <input
                      onChange={handleDifficultyChange}
                      checked={difficulty.includes('hard')}
                      type='checkbox'
                      name='difficulty'
                      value='hard'
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Hard</span>
                  </label>
                </div>
              </div>
              <div className={cx('cooking-time-calories-container')}>
                <div className={cx('form-group')}>
                  <label htmlFor='search' className={cx('modal-input-label')}>
                    Cooking Time (Minutes)
                  </label>
                  <p className={cx('min-max-text')}>
                    {cookingTimeRange.min} - {cookingTimeRange.max}
                  </p>
                  <div className={cx('range-slider-container')}>
                    <input
                      type='range'
                      min={5}
                      max={60}
                      aria-label='Minimum value'
                      value={cookingTimeRange.min}
                      onChange={handleCookingTimeRangeChange('min')}
                      className={cx('range-slider')}
                    />
                    <input
                      type='range'
                      min={5}
                      max={60}
                      value={cookingTimeRange.max}
                      onChange={handleCookingTimeRangeChange('max')}
                      className={cx('range-slider')}
                    />
                  </div>
                </div>
                <div className={cx('form-group')}>
                  <label htmlFor='search' className={cx('modal-input-label')}>
                    Calories (Kcal)
                  </label>
                  <p className={cx('min-max-text')}>
                    {calorieRange.min} - {calorieRange.max}
                  </p>
                  <div className={cx('range-slider-container')}>
                    <input
                      type='range'
                      min={5}
                      max={60}
                      aria-label='Minimum value'
                      value={calorieRange.min}
                      onChange={handleCalorieRangeChange('min')}
                      className={cx('range-slider')}
                    />
                    <input
                      type='range'
                      min={5}
                      max={2000}
                      value={calorieRange.max}
                      onChange={handleCalorieRangeChange('max')}
                      className={cx('range-slider')}
                    />
                  </div>
                </div>
              </div>
              <button onClick={handleApplyFilter} className={cx('confirm-filter-button')}>
                Filter Dishes <Icon icon='material-symbols-light:chevron-right' width='32' height='32' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dish;
