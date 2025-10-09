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

  return (
    <div className={cx('wrapper')}>
      <div className={cx('back')}>
        <Link to={'/dish-management'} className={cx('back-link')}>
          <Icon icon='ic:round-arrow-back' /> Back to list
        </Link>
      </div>

      <div className={cx('card')}>
        <div className={cx('image')}>
          {dish.imageUrl ? (
            <img src={dish.imageUrl} alt={dish.name} />
          ) : (
            <img src='/images/default-img.png' alt='default' />
          )}
        </div>
        <div className={cx('content')}>
          <h2 className={cx('title')}>{dish.name}</h2>
          <p className={cx('meta')}>Cooking time: {dish.cookingTime || 'N/A'} min</p>
          <p className={cx('meta')}>Calories: {dish.calorie || 'N/A'}</p>
          <p className={cx('meta')}>Difficulty: {dish.difficulty || 'N/A'}</p>
          <div className={cx('description')}>{dish.description || 'No description'}</div>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
