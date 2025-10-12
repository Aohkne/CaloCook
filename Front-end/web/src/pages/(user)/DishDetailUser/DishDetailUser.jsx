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
                }

                // Fetch ingredients
                const ingredientResponse = await getIngredientsByDishId(id, {
                    sortBy: 'createdAt',
                    order: 'asc'
                });

                if (ingredientResponse.code === 200) {
                    setIngredients(ingredientResponse.data || []);
                }

                // Fetch steps
                const stepResponse = await getStepsByDishId(id, {
                    sortBy: 'stepNumber',
                    order: 'asc'
                });

                if (stepResponse.code === 200) {
                    setSteps(stepResponse.data || []);
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
                    </div>
                </div>

                {(ingredients.length > 0 || steps.length > 0) && (
                    <div className={cx('tabs-section')}>
                        <div className={cx('tabs-header')}>
                            {ingredients.length > 0 && (
                                <button
                                    className={cx('tab-btn', { active: activeTab === 'ingredients' })}
                                    onClick={() => setActiveTab('ingredients')}
                                >
                                    Ingredients
                                </button>
                            )}
                            {steps.length > 0 && (
                                <button
                                    className={cx('tab-btn', { active: activeTab === 'steps' })}
                                    onClick={() => setActiveTab('steps')}
                                >
                                    Steps
                                </button>
                            )}
                        </div>

                        <div className={cx('tabs-content')}>
                            {activeTab === 'ingredients' && ingredients.length > 0 && (
                                <div className={cx('tab-panel')}>
                                    <ol>
                                        {ingredients.map((ingredient) => (
                                            <li key={ingredient._id}>
                                                {ingredient.name}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {activeTab === 'steps' && steps.length > 0 && (
                                <div className={cx('tab-panel')}>
                                    <ol>
                                        {steps.map((step) => (
                                            <li key={step._id}>
                                                {step.description}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                )}

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