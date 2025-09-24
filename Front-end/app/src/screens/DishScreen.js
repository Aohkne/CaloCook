import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';
import classNames from 'classnames/bind';
import styles from './Dish.module.scss';
import { getDishes } from '@/api/dish';
import testImage from '@/assets/testImage.png';

const cx = classNames.bind(styles);

function Dish() {
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

  // Function to handle image URL - similar to React Native approach
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return testImage;
    }

    // If imageUrl starts with @assets, convert to server path
    if (imageUrl.startsWith('@assets/')) {
      // Convert @assets/img/banh-mi.png to /api/assets/img/banh-mi.png
      const serverPath = imageUrl.replace('@assets/', '/assets/');
      const fullUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${serverPath}`;
      console.log('Generated image URL:', fullUrl); // Debug log
      return fullUrl;
    }

    // If it's already a full HTTP URL
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a relative path from server
    if (imageUrl.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${imageUrl}`;
    }

    // Default: prepend API base URL
    return `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/${imageUrl}`;
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

      console.log('API Response:', response);

      if (response.code === 200) {
        console.log('Dishes data:', response.data);
        // Log first dish imageUrl for debugging
        if (response.data && response.data[0]) {
          console.log('First dish imageUrl:', response.data[0].imageUrl);
          console.log('Processed URL:', getImageUrl(response.data[0].imageUrl));
        }
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
                    src={getImageUrl(dish.imageUrl)}
                    alt={dish.name || 'Dish image'}
                    onError={(e) => {
                      console.log('Image load error for:', dish.imageUrl);
                      console.log('Failed URL:', getImageUrl(dish.imageUrl));
                      e.target.src = testImage;
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', e.target.src);
                    }}
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

export default Dish;