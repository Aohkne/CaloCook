import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames/bind';
import styles from './DishDetailUser.module.scss';
import { ROUTES } from '@/constants/routes';
import { getDishById, getIngredientsByDishId, getStepsByDishId } from '@/api/dish';
import { addToHistory, getTotalCalories } from '@/api/history';
import { getWebImagePath } from '@/utils/imageHelper';
import CookingStepsModal from '@/components/ui/CookingStepsModal/CookingStepsModal';

const cx = classNames.bind(styles);
const defaultImage = '/images/default-img.png';

function DishDetailUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [dish, setDish] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isModalVisible, setIsModalVisible] = useState(false);

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
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
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

  const userId = getUserId();

  useEffect(() => {
    const fetchDishDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch dish (bắt buộc phải có)
        const dishResponse = await getDishById(id);
        console.log('Dish response:', dishResponse);

        if (dishResponse.code === 200) {
          setDish(dishResponse.data);
        } else {
          setError('Dish not found');
          setLoading(false);
          return;
        }

        // ✅ Fetch ingredients (không bắt buộc, catch riêng)
        try {
          const ingredientResponse = await getIngredientsByDishId(id);
          console.log('Ingredients response:', ingredientResponse);

          if (ingredientResponse.code === 200) {
            // ✅ Chỉ lấy ingredients có isActive = true
            const activeIngredients = (ingredientResponse.data || []).filter(ing => ing.isActive === true);
            setIngredients(activeIngredients);
          } else {
            setIngredients([]);
          }
        } catch (ingredientErr) {
          console.warn('Failed to load ingredients:', ingredientErr);
          setIngredients([]);
        }

        // ✅ Fetch steps (không bắt buộc, catch riêng)
        try {
          const stepResponse = await getStepsByDishId(id);
          console.log('Steps response:', stepResponse);

          if (stepResponse.code === 200) {
            // ✅ Chỉ lấy steps có isActive = true
            const activeSteps = (stepResponse.data || []).filter(step => step.isActive === true);
            setSteps(activeSteps);
          } else {
            setSteps([]);
          }
        } catch (stepErr) {
          console.warn('Failed to load steps:', stepErr);
          setSteps([]);
        }

      } catch (err) {
        console.error('Error fetching dish:', err);
        setError('Failed to load dish details');
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [id]);

  const handleStarClick = (rating) => setUserRating(rating);
  const toggleFavorite = () => setIsFavorite((prev) => !prev);
  const handleImageError = (e) => (e.target.src = defaultImage);

  const handleCook = () => {
    if (!userId || !id) return alert('Please log in first!');
    setIsModalVisible(true);
  };

  const handleCookingComplete = async () => {
    try {
      await addToHistory(userId, id);
      const today = new Date().toISOString().split('T')[0];
      await getTotalCalories(userId, today);

      setIsModalVisible(false);

      setTimeout(() => {
        const message = `Added "${dish.name}" (${dish.calorie || dish.calories || 0} Kcal) to your eating history!\n\nView your profile?`;
        const goToProfile = window.confirm(message);
        if (goToProfile) navigate(ROUTES.PROFILE_USER);
      }, 300);
    } catch (err) {
      console.error('Failed to add to history:', err);
      alert('Failed to add to history.');
    }
  };

  const renderStars = (rating, isInteractive = false) =>
    Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = isInteractive
        ? hoveredStar
          ? starValue <= hoveredStar
          : starValue <= userRating
        : starValue <= Math.floor(rating);

      return (
        <span
          key={index}
          className={cx('star', {
            filled: isFilled,
            interactive: isInteractive,
          })}
          onClick={isInteractive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={isInteractive ? () => setHoveredStar(starValue) : undefined}
          onMouseLeave={isInteractive ? () => setHoveredStar(0) : undefined}
        >
          ★
        </span>
      );
    });

  if (loading)
    return (
      <div className={cx('wrapper')}>
        <div className={cx('loading')}>Loading...</div>
      </div>
    );

  if (error || !dish)
    return (
      <div className={cx('wrapper')}>
        <Link to={ROUTES.DISH} className={cx('back-btn')}>
          <Icon icon="bi:chevron-left" width="18" height="18" />
          Back
        </Link>
        <div className={cx('error')}>{error || 'Dish not found'}</div>
      </div>
    );

  return (
    <div className={cx('wrapper')}>
      <Link to={ROUTES.DISH} className={cx('back-btn')}>
        <Icon icon="bi:chevron-left" width="18" height="18" />
        Back
      </Link>

      <button
        className={cx('favorite-btn', { active: isFavorite })}
        onClick={toggleFavorite}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Icon icon={isFavorite ? 'ph:heart-fill' : 'ph:heart'} />
      </button>

      <div className={cx('container')}>
        <div className={cx('content-section')}>
          <div className={cx('left-side')}>
            <img
              src={
                dish.imageUrl && dish.imageUrl.trim() !== ''
                  ? getWebImagePath(dish.imageUrl)
                  : defaultImage
              }
              alt={dish.name}
              className={cx('dish-image')}
              onError={handleImageError}
            />
          </div>

          <div className={cx('right-side')}>
            <h1 className={cx('dish-name')}>{dish.name}</h1>
            <div className={cx('section')}>
              <h2>Description</h2>
              <p>{dish.description || 'No description available'}</p>
            </div>

            <div className={cx('dish-stats')}>
              <div className={cx('stat-card')}>
                <Icon icon="ph:clock" />
                <span>{dish.cookingTime || 0} Min</span>
              </div>
              <div className={cx('stat-card')}>
                <Icon icon="ph:fire" />
                <span>{dish.calorie || dish.calories || 0} Kcal</span>
              </div>
              <div className={cx('stat-card')}>
                <Icon icon="ph:chef-hat" />
                <span>
                  {dish.difficulty
                    ? dish.difficulty.charAt(0).toUpperCase() +
                    dish.difficulty.slice(1).toLowerCase()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('tabs-section')}>
          <div className={cx('tabs-header')}>
            <button
              className={cx('tab-btn', { active: activeTab === 'ingredients' })}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button
              className={cx('tab-btn', { active: activeTab === 'steps' })}
              onClick={() => setActiveTab('steps')}
            >
              Steps
            </button>
          </div>

          <div className={cx('tabs-content')}>
            {activeTab === 'ingredients' && (
              <div className={cx('tab-panel')}>
                {ingredients.length > 0 ? (
                  <ol>
                    {ingredients.map((i) => (
                      <li key={i._id}>{i.name}</li>
                    ))}
                  </ol>
                ) : (
                  <p className={cx('empty-message')}>
                    No ingredients found for this dish.
                  </p>
                )}
              </div>
            )}
            {activeTab === 'steps' && (
              <div className={cx('tab-panel')}>
                {steps.length > 0 ? (
                  <ol>
                    {steps.map((s) => (
                      <li key={s._id}>{s.description}</li>
                    ))}
                  </ol>
                ) : (
                  <p className={cx('empty-message')}>
                    No cooking steps found for this dish.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={cx('rating-section')}>
          <h2 className={cx('rating-title')}>Rating</h2>
          <div className={cx('rating-top')}>
            <div className={cx('average-rating')}>
              <span className={cx('rating-number')}>4.5</span>
            </div>
            <div className={cx('stars-info')}>
              <div className={cx('stars-display')}>{renderStars(4.5)}</div>
              <div className={cx('rating-count')}>170 N Ratings</div>
            </div>
          </div>

          <div className={cx('user-rating')}>
            {renderStars(userRating, true)}
          </div>
        </div>

        <button className={cx('cook-btn')} onClick={handleCook}>
          Let's Cook
        </button>
      </div>

      {/* Cooking Steps Modal */}
      <CookingStepsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        steps={steps}
        dishData={dish}
        onComplete={handleCookingComplete}
      />
    </div>
  );
}

export default DishDetailUser;