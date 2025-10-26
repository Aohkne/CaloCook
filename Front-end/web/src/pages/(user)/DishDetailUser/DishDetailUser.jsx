import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames/bind';
import styles from './DishDetailUser.module.scss';
import { ROUTES } from '@/constants/routes';
import { getDishById, getIngredientsByDishId, getStepsByDishId } from '@/api/dish';
import { addToHistory, getTotalCalories } from '@/api/history';
import { createRating, getRatingsByDishId, getAverageRating } from '@/api/rating';
import { createReport } from '@/api/report';
import { getFavorites, addToFavorites, removeFromFavorites } from '@/api/favorite';
import { getWebImagePath } from '@/utils/imageHelper';
import CookingStepsModal from '@/components/ui/CookingStepsModal/CookingStepsModal';
import { addAchievementPoints } from '@/api/achievement';
import MedalAchievementModal from '@/components/ui/MedalAchievementModal/MedalAchievementModal';
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
  const [success, setSuccess] = useState('');
  const [errorSubmitReport, setErrorSubmitReport] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showMedalModal, setShowMedalModal] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [newPoints, setNewPoints] = useState(0);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingDescription, setRatingDescription] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewDetailModalVisible, setIsReviewDetailModalVisible] = useState(false);

  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userOwnRating, setUserOwnRating] = useState(null);
  const [otherReviews, setOtherReviews] = useState([]);


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


  // Fetch ratings
  const fetchRatings = async () => {
    if (!id) return;

    try {
      // Get ratings list
      const ratingsResponse = await getRatingsByDishId(id, {
        sortBy: 'createdAt',
        order: 'desc'
      });

      if (ratingsResponse.code === 200) {
        const ratingsData = ratingsResponse.data || [];

        // Transform data to match UI format
        const formattedReviews = ratingsData.map((rating) => ({
          id: rating._id,
          userName: rating.fullName,
          rating: rating.star,
          comment: rating.description,
          date: new Date(rating.createdAt).toISOString().split('T')[0],
          userId: typeof rating.userId === 'object' ? rating.userId._id : rating.userId,
          rawUserId: rating.userId
        }));
        // Separate user's own rating and others
        if (userId) {
          const ownRating = formattedReviews.find(r => r.userId === userId);
          const others = formattedReviews.filter(r => r.userId !== userId);

          setUserOwnRating(ownRating || null);
          setOtherReviews(others);
        } else {
          setUserOwnRating(null);
          setOtherReviews(formattedReviews);
        }
      }

      // Get average rating
      const avgResponse = await getAverageRating(id);
      if (avgResponse.code === 200) {
        setAverageRating(avgResponse.data.averageRating || 0);
        setTotalRatings(avgResponse.data.totalRatings || 0);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };
  useEffect(() => {
    const fetchDishDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const dishResponse = await getDishById(id);
        console.log('Dish response:', dishResponse);

        if (dishResponse.code === 200) {
          setDish(dishResponse.data);
        } else {
          setError('Dish not found');
          setLoading(false);
          return;
        }

        try {
          const ingredientResponse = await getIngredientsByDishId(id);
          console.log('Ingredients response:', ingredientResponse);

          if (ingredientResponse.code === 200) {
            const activeIngredients = (ingredientResponse.data || []).filter(ing => ing.isActive === true);
            setIngredients(activeIngredients);
          } else {
            setIngredients([]);
          }
        } catch (ingredientErr) {
          console.warn('Failed to load ingredients:', ingredientErr);
          setIngredients([]);
        }

        try {
          const stepResponse = await getStepsByDishId(id);
          console.log('Steps response:', stepResponse);

          if (stepResponse.code === 200) {
            const activeSteps = (stepResponse.data || []).filter(step => step.isActive === true);
            setSteps(activeSteps);
          } else {
            setSteps([]);
          }
        } catch (stepErr) {
          console.warn('Failed to load steps:', stepErr);
          setSteps([]);
        }

        // Check favorite status after loading dish
        await checkFavoriteStatus();

        // Fetch ratings
        await fetchRatings();
      } catch (err) {
        console.error('Error fetching dish:', err);
        setError('Failed to load dish details');
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [id]);

  // Fetch favorite status
  const checkFavoriteStatus = async () => {
    if (!userId || !id) return;

    try {
      const response = await getFavorites(userId, {
        page: 1,
        limit: 100
      });

      if (response && response.code === 200 && response.data) {
        const favorites = Array.isArray(response.data) ? response.data : [];
        const isFav = favorites.some((fav) => fav.dishId === id || fav.dish?._id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  useEffect(() => {
    const fetchDishDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const dishResponse = await getDishById(id);
        console.log('Dish response:', dishResponse);

        if (dishResponse.code === 200) {
          setDish(dishResponse.data);
        } else {
          setError('Dish not found');
          setLoading(false);
          return;
        }

        try {
          const ingredientResponse = await getIngredientsByDishId(id);
          console.log('Ingredients response:', ingredientResponse);

          if (ingredientResponse.code === 200) {
            const activeIngredients = (ingredientResponse.data || []).filter(ing => ing.isActive === true);
            setIngredients(activeIngredients);
          } else {
            setIngredients([]);
          }
        } catch (ingredientErr) {
          console.warn('Failed to load ingredients:', ingredientErr);
          setIngredients([]);
        }

        try {
          const stepResponse = await getStepsByDishId(id);
          console.log('Steps response:', stepResponse);

          if (stepResponse.code === 200) {
            const activeSteps = (stepResponse.data || []).filter(step => step.isActive === true);
            setSteps(activeSteps);
          } else {
            setSteps([]);
          }
        } catch (stepErr) {
          console.warn('Failed to load steps:', stepErr);
          setSteps([]);
        }

        // Check favorite status after loading dish
        await checkFavoriteStatus();
      } catch (err) {
        console.error('Error fetching dish:', err);
        setError('Failed to load dish details');
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [id]);

  const handleStarClick = (rating) => {
    setUserRating(rating);
    setIsRatingModalVisible(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalVisible(false);
    setRatingDescription('');
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!ratingDescription.trim() || ratingDescription.trim().length < 10) {
      setError('Please enter a description (at least 10 characters)');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (!userId) {
      setError('Please login to submit rating');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      const response = await createRating({
        userId,
        dishId: id,
        star: userRating,
        description: ratingDescription.trim()
      });

      if (response.code === 201) {
        setSuccess('Rating submitted successfully!');
        handleCloseRatingModal();
        setUserRating(0); // Reset stars
        setRatingDescription(''); // Reset description

        // Refresh ratings
        await fetchRatings();

        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Failed to submit rating:', err);
      setError('Failed to submit rating. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleReviewCardClick = (review) => {
    setSelectedReview(review);
    setIsReviewDetailModalVisible(true);
  };

  const handleCloseReviewDetailModal = () => {
    setIsReviewDetailModalVisible(false);
    setSelectedReview(null);
  };

  const toggleFavorite = async () => {
    if (!userId) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        const response = await removeFromFavorites(userId, id);

        if (response && response.code === 200) {
          setIsFavorite(false);
        }
      } else {
        const response = await addToFavorites(userId, id);

        if (response && response.code === 201) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Error updating favorite. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

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

      let achievementResult = null;
      let pointsEarned = 0;

      try {
        achievementResult = await addAchievementPoints(userId, dish.difficulty);

        const achievementData = achievementResult?.data?.data;

        if (achievementData) {
          pointsEarned = achievementData.points || 0;

          // ✅ Check level up
          const isLevelUp = achievementData.levelUp === true;
          const hasValidNewLevel = achievementData.newLevel && achievementData.newLevel !== 'none';

          if (isLevelUp && hasValidNewLevel) {
            // ✅ Show medal modal
            setNewLevel(achievementData.newLevel);
            setNewPoints(achievementData.totalPoints || 0);

            setTimeout(() => {
              setShowMedalModal(true);
            }, 300);

            return; // Không show alert thông thường
          }
        }
      } catch (achievementError) {
        console.error('Achievement error:', achievementError);
      }

      // ✅ Alert thông thường (khi không level up)
      setTimeout(() => {
        let message = `Added "${dish.name}" (${dish.calorie || dish.calories || 0} Kcal) to your eating history!`;

        if (pointsEarned > 0) {
          const difficultyLevel = dish.difficulty
            ? dish.difficulty.charAt(0).toUpperCase() + dish.difficulty.slice(1).toLowerCase()
            : '';
          const emoji = dish.difficulty?.toLowerCase() === 'easy' ? '😊' :
            dish.difficulty?.toLowerCase() === 'medium' ? '🔥' : '⚡';
          message += `\n\n${emoji} +${pointsEarned} Points Earned!\n(${difficultyLevel} Difficulty)`;
        }

        message += '\n\nView your profile?';

        const goToProfile = window.confirm(message);
        if (goToProfile) {
          window.location.href = ROUTES.PROFILE_USER;
        }
      }, 300);

    } catch (err) {
      console.error('Failed to add to history:', err);
      setIsModalVisible(false);
      alert('Failed to add to history. Please try again.');
    }
  };

  const handleOpenReportModal = () => {
    setIsReportModalVisible(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalVisible(false);
    setReportReason('');
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!reportReason.trim() || reportReason.trim().length < 10) {
      setErrorSubmitReport('Please enter a reason for reporting (at least 10 characters)');
      setTimeout(() => setErrorSubmitReport(''), 5000);
      handleCloseReportModal();
      return;
    }

    try {
      await createReport({ dishId: id, description: reportReason.trim() });
      setSuccess('Report submitted successfully! Thank you for your feedback.');
      handleCloseReportModal();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError('Failed to submit report.');
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
            interactive: isInteractive
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

  if (error && !dish)
    return (
      <div className={cx('wrapper')}>
        <Link to={ROUTES.DISH} className={cx('back-btn')}>
          <Icon icon='bi:chevron-left' width='18' height='18' />
          Back
        </Link>
        <div className={cx('error')}>{error}</div>
      </div>
    );

  return (
    <div className={cx('wrapper')}>
      <Link to={ROUTES.DISH} className={cx('back-btn')}>
        <Icon icon='bi:chevron-left' width='18' height='18' />
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
            <div className={cx('dish-image-container')} onClick={handleOpenReportModal}>
              <img
                src={dish.imageUrl && dish.imageUrl.trim() !== '' ? getWebImagePath(dish.imageUrl) : defaultImage}
                alt={dish.name}
                className={cx('dish-image')}
                onError={handleImageError}
              />
              <div className={cx('image-overlay')}>
                <Icon icon='weui:report-problem-filled' className={cx('overlay-icon')} />
                <span className={cx('overlay-text')}>Report</span>
              </div>
            </div>
          </div>

          <div className={cx('right-side')}>
            <h1 className={cx('dish-name')}>{dish.name}</h1>
            <div className={cx('section')}>
              <p>{dish.description || 'No description available'}</p>
            </div>

            <div className={cx('dish-stats')}>
              <div className={cx('stat-card')}>
                <div className={cx('icon-wrapper')}>
                  <Icon icon='ph:clock' />
                </div>
                <div className={cx('stat-content')}>
                  <span className={cx('stat-label')}>Cooking Time</span>
                  <span className={cx('stat-value')}>{dish.cookingTime || 0} Min</span>
                </div>
              </div>
              <div className={cx('stat-card')}>
                <div className={cx('icon-wrapper')}>
                  <Icon icon='ph:fire' />
                </div>
                <div className={cx('stat-content')}>
                  <span className={cx('stat-label')}>Calories</span>
                  <span className={cx('stat-value')}>{dish.calorie || dish.calories || 0} Kcal</span>
                </div>
              </div>
              <div className={cx('stat-card')}>
                <div className={cx('icon-wrapper')}>
                  <Icon icon='ph:chef-hat' />
                </div>
                <div className={cx('stat-content')}>
                  <span className={cx('stat-label')}>Difficulty Level</span>
                  <span className={cx('stat-value')}>
                    {dish.difficulty
                      ? dish.difficulty.charAt(0).toUpperCase() + dish.difficulty.slice(1).toLowerCase()
                      : 'N/A'}
                  </span>
                </div>
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
            <button className={cx('tab-btn', { active: activeTab === 'steps' })} onClick={() => setActiveTab('steps')}>
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
                  <p className={cx('empty-message')}>No ingredients found for this dish.</p>
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
                  <p className={cx('empty-message')}>No cooking steps found for this dish.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={cx('rating-section')}>
          <h2 className={cx('rating-title')}>Rating</h2>
          <div className={cx('rating-top')}>
            <div className={cx('average-rating')}>
              <span className={cx('rating-number')}>
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </span>
            </div>
            <div className={cx('stars-info')}>
              <div className={cx('stars-display')}>
                {renderStars(averageRating)}
              </div>
              <div className={cx('rating-count')}>
                {totalRatings} {totalRatings === 1 ? 'Rating' : 'Ratings'}
              </div>
            </div>
          </div>

          <div className={cx('user-rating')}>{renderStars(userRating, true)}</div>
        </div>
        {/* Review Cards */}
        <div className={cx('reviews-list')}>
          {/* User's own rating - always first if exists */}
          {userOwnRating && (
            <div
              key={userOwnRating.id}
              className={cx('review-card', 'own-review')}
              onClick={() => handleReviewCardClick(userOwnRating)}
            >
              <div className={cx('review-header')}>
                <div className={cx('review-info')}>
                  <div className={cx('review-name')}>
                    {userOwnRating.userName}
                  </div>
                  <div className={cx('review-stars')}>{renderStars(userOwnRating.rating)}</div>
                </div>
                <div className={cx('review-date')}>{userOwnRating.date}</div>
              </div>
              <div className={cx('review-comment')}>
                {userOwnRating.comment.length > 30
                  ? `${userOwnRating.comment.substring(0, 30)}...`
                  : userOwnRating.comment}
              </div>
            </div>
          )}

          {/* Other reviews - show 4 most recent */}
          {otherReviews.length > 0 ? (
            otherReviews.slice(0, 4).map((review) => (
              <div
                key={review.id}
                className={cx('review-card')}
                onClick={() => handleReviewCardClick(review)}
              >
                <div className={cx('review-header')}>
                  <div className={cx('review-info')}>
                    <div className={cx('review-name')}>{review.userName}</div>
                    <div className={cx('review-stars')}>{renderStars(review.rating)}</div>
                  </div>
                  <div className={cx('review-date')}>{review.date}</div>
                </div>
                <div className={cx('review-comment')}>
                  {review.comment.length > 30
                    ? `${review.comment.substring(0, 30)}...`
                    : review.comment}
                </div>
              </div>
            ))
          ) : !userOwnRating ? (
            <div className={cx('empty-reviews')}>No reviews yet. Be the first to rate this dish!</div>
          ) : null}
        </div>

        <button className={cx('cook-btn')} onClick={handleCook}>
          Let's Cook
        </button>
      </div>

      {/* Rating Modal */}
      {isRatingModalVisible && (
        <div className={cx('modal-overlay')} onClick={handleCloseRatingModal}>
          <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2 className={cx('modal-title')}>RATE THIS DISH</h2>
              <button className={cx('modal-close-btn')} onClick={handleCloseRatingModal}>
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitRating}>
              <div className={cx('form-group')}>
                <label htmlFor='ratingDescription' className={cx('form-label')}>
                  Tell us about your experience with this dish
                </label>
                <textarea
                  id='ratingDescription'
                  className={cx('form-textarea')}
                  rows='5'
                  placeholder='Share your thoughts about the taste, preparation, or anything else...'
                  value={ratingDescription}
                  onChange={(e) => setRatingDescription(e.target.value)}
                  required
                />
              </div>
              <div className={cx('rating-modal-actions')}>
                <button type='submit' className={cx('btn-submit')}>
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Detail Modal */}
      {isReviewDetailModalVisible && selectedReview && (
        <div className={cx('modal-overlay')} onClick={handleCloseReviewDetailModal}>
          <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2 className={cx('modal-title')}>REVIEW DETAILS</h2>
              <button className={cx('modal-close-btn')} onClick={handleCloseReviewDetailModal}>
                &times;
              </button>
            </div>
            <div className={cx('review-detail-content')}>
              <div className={cx('review-detail-header')}>
                <div className={cx('review-detail-name')}>{selectedReview.userName}</div>
                <div className={cx('review-detail-date')}>{selectedReview.date}</div>
              </div>
              <div className={cx('review-detail-stars')}>
                {renderStars(selectedReview.rating)}
              </div>
              <div className={cx('review-detail-comment')}>
                {selectedReview.comment}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cooking Steps Modal */}
      <CookingStepsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        steps={steps}
        dishData={dish}
        onComplete={handleCookingComplete}
      />
      <MedalAchievementModal
        visible={showMedalModal}
        onClose={() => {
          setShowMedalModal(false);
        }}
        level={newLevel}
        points={newPoints}
      />
      {success && <div className={cx('success-message')}>{success}</div>}
      {error && <div className={cx('error-message')}>{error}</div>}
      {errorSubmitReport && <div className={cx('error-message')}>{errorSubmitReport}</div>}
      {/* Report Modal */}
      {isReportModalVisible && (
        <div className={cx('modal-overlay')} onClick={handleCloseReportModal}>
          <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2 className={cx('modal-title')}>REPORT DISH</h2>
              <button className={cx('modal-close-btn')} onClick={handleCloseReportModal}>
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitReport}>
              <div className={cx('form-group')}>
                <label htmlFor='reportReason' className={cx('form-label')}>
                  This report will be reviewed by our team. Please provide a reason for reporting
                </label>
                <textarea
                  id='reportReason'
                  className={cx('form-textarea')}
                  rows='5'
                  placeholder='Please describe the issue with this dish...'
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                />
              </div>
              <div className={cx('modal-actions')}>
                <button type='button' className={cx('btn-cancel')} onClick={handleCloseReportModal}>
                  Cancel
                </button>
                <button type='submit' className={cx('btn-submit')}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DishDetailUser;