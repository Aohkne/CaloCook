import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './DishDetail.module.scss';
import { getDishById } from '@/api/dish';
import { Icon } from '@iconify/react';

const cx = classNames.bind(styles);

function DishDetail() {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchDish = async () => {
      try {
        setLoading(true);
        const response = await getDishById(id);
        if (!mounted) return;
        setDish(response.data || null);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dish');
        setDish(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDish();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className={cx('wrapper')}>Loading...</div>;
  if (error) return <div className={cx('wrapper', 'error')}>{error}</div>;
  if (!dish) return <div className={cx('wrapper')}>No dish found</div>;
  console.log(dish.imageUrl);

  return (
    <div className={cx('wrapper')}>
      {/* Back Button */}
      <div className={cx('back-button')}>
        <Link to={'/dish-management'} className={cx('back-link')}>
          <Icon icon='formkit:left' width='7' height='16' /> Back to list
        </Link>
      </div>
      {/* Main Container */}
      <div className={cx('container')}>
        {/* Dish Image */}
        <div className={cx('dish-image-container')}>
          <img className={cx('dish-image')} src={'/img/hawaiian-chicken-salad.png'} alt={dish.name} />
        </div>
        <div className={cx('dish-infomation')}>
          {/* Dish Name */}
          <h1 className={cx('dish-name')}>{dish.name}</h1>
          {/* Dish Description */}
          <p className={cx('dish-description')}>{dish.description}</p>
          {/* Time, Calories, Difficulty Level Cards */}
          <div className={cx('time-colories-difficulty-container')}>
            <div className={cx('card')}>
              <Icon icon='basil:clock-outline' width='24' height='24' className={cx('card-icon')} />
              <div className={cx('card-text-container')}>
                <p className={cx('card-title')}>Cooking Time</p>
                <p className={cx('card-value')}>{dish.cookingTime} Minutes</p>
              </div>
            </div>
            <div className={cx('card')}>
              <Icon icon='basil:fire-outline' width='24' height='24' className={cx('card-icon')} />
              <div className={cx('card-text-container')}>
                <p className={cx('card-title')}>Calories</p>
                <p className={cx('card-value')}>{dish.calorie} Kcal</p>
              </div>
            </div>
            <div className={cx('card', 'span-2')}>
              <Icon icon='lucide-lab:hat-chef' width='24' height='24' className={cx('card-icon')} />
              <div className={cx('card-text-container')}>
                <p className={cx('card-title')}>Difficulty Level</p>
                <p className={cx('card-value')}>{dish.difficulty}</p>
              </div>
            </div>
            {/* Edit Button */}
            <button className={cx('edit-button', 'span-2')}>
              <Icon icon='lucide:pen' width='24' height='24' />
              Edit Dish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
