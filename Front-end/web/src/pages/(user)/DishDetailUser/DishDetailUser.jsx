import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames/bind';
import styles from './DishDetailUser.module.scss';
import { ROUTES } from '@/constants/routes';
import { getDishById, getIngredientsByDishId, getStepsByDishId } from '@/api/dish';
import { getWebImagePath } from '@/utils/imageHelper';

const cx = classNames.bind(styles);
const defaultImage = '/images/default-img.png';

function DishDetailUser() {
    const { id } = useParams();
    const [userRating, setUserRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [dish, setDish] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ingredients');

    // Fetch dish details
    useEffect(() => {
        const fetchDishDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch dish basic info
                const dishResponse = await getDishById(id);

                if (dishResponse.code === 200) {
                    setDish(dishResponse.data);
                } else {
                    setError('Dish not found');
                    setLoading(false);
                    return;
                }

                // Fetch ingredients (allow to fail silently)
                try {
                    const ingredientResponse = await getIngredientsByDishId(id, {
                        sortBy: 'createdAt',
                        order: 'asc'
                    });

                    if (ingredientResponse.code === 200) {
                        setIngredients(ingredientResponse.data || []);
                    }
                } catch (err) {
                    console.warn('No ingredients found for this dish:', err);
                    setIngredients([]);
                }

                // Fetch steps (allow to fail silently)
                try {
                    const stepResponse = await getStepsByDishId(id, {
                        sortBy: 'stepNumber',
                        order: 'asc'
                    });

                    if (stepResponse.code === 200) {
                        setSteps(stepResponse.data || []);
                    }
                } catch (err) {
                    console.warn('No steps found for this dish:', err);
                    setSteps([]);
                }

            } catch (err) {
                console.error('Error fetching dish details:', err);
                setError('Failed to load dish details');
            } finally {
                setLoading(false);
            }
        };

        fetchDishDetail();
    }, [id]);

    const handleStarClick = (rating) => {
        setUserRating(rating);
    };

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
    };

    const handleImageError = (e) => {
        e.target.src = defaultImage;
    };

    const renderStars = (rating, isInteractive = false) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = isInteractive
                ? (hoveredStar ? starValue <= hoveredStar : starValue <= userRating)
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
    };

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('loading')}>Loading...</div>
            </div>
        );
    }

    if (error || !dish) {
        return (
            <div className={cx('wrapper')}>
                <Link to={ROUTES.DISH} className={cx('back-btn')}>
                    <Icon icon='bi:chevron-left' width='18' height='18' />
                    Back
                </Link>
                <div className={cx('error')}>{error || 'Dish not found'}</div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <Link to={ROUTES.DISH} className={cx('back-btn')}>
                <Icon icon='bi:chevron-left' width='18' height='18' />
                Back
            </Link>

            <button
                className={cx('favorite-btn', { 'active': isFavorite })}
                onClick={toggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <Icon icon={isFavorite ? "ph:heart-fill" : "ph:heart"} />
            </button>

            <div className={cx('container')}>
                <div className={cx('content-section')}>
                    <div className={cx('left-side')}>
                        <img
                            src={dish.imageUrl && dish.imageUrl.trim() !== ""
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

                        {/* Dish Stats Section - moved to bottom */}
                        <div className={cx('dish-stats')}>
                            <div className={cx('stat-card')}>
                                <Icon icon='ph:clock' />
                                <span>{dish.cookingTime || 0} Min</span>
                            </div>
                            <div className={cx('stat-card')}>
                                <Icon icon='ph:fire' />
                                <span>{dish.calorie || 0} Kcal</span>
                            </div>
                            <div className={cx('stat-card')}>
                                <Icon icon='ph:chef-hat' />
                                <span>{dish.difficulty ? dish.difficulty.charAt(0).toUpperCase() + dish.difficulty.slice(1).toLowerCase() : 'N/A'}</span>
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
                                        {ingredients.map((ingredient) => (
                                            <li key={ingredient._id}>
                                                {ingredient.name}
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className={cx('empty-message')}>No ingredients added to this dish yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'steps' && (
                            <div className={cx('tab-panel')}>
                                {steps.length > 0 ? (
                                    <ol>
                                        {steps.map((step) => (
                                            <li key={step._id}>
                                                {step.description}
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className={cx('empty-message')}>No cooking steps added to this dish yet.</p>
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
                            <div className={cx('stars-display')}>
                                {renderStars(4.5)}
                            </div>
                            <div className={cx('rating-count')}>170 N Ratings</div>
                        </div>
                    </div>

                    <div className={cx('user-rating')}>
                        {renderStars(userRating, true)}
                    </div>
                </div>

                <button className={cx('cook-btn')}>Let's Cook</button>
            </div>
        </div>
    );
}

export default DishDetailUser;