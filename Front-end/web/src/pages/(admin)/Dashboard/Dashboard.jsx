import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import TopTable from '@/components/ui/TopTable/TopTable';

import { ROUTES } from '@/constants/routes';

import { getWebImagePath } from '@/utils/imageHelper';

import { getTopFavorites, getTopRatings, getTotalDish, getTotalUser } from '@/api/dashboard';

import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
  const navigate = useNavigate();

  const [totalUser, setTotalUser] = useState(0);
  const [totalDish, setTotalDish] = useState(0);
  const [topFavorites, setTopFavorites] = useState([]);
  const [topRatings, setTopRatings] = useState([]);

  const [isShowFavorite, setIsShowFavorite] = useState(true);
  const [isShowRating, setIsShowRating] = useState(false);

  useEffect(() => {
    //TOTAL USERS
    handleTotalUser();

    //TOTAL DISHS
    handleTotalDish();

    //TOP FAVORITES
    handleTopFavorites();
  }, [totalUser, totalDish]);

  const handleTotalUser = async () => {
    try {
      const response = await getTotalUser();

      setTotalUser(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get total user failed.');
    }
  };

  const handleTotalDish = async () => {
    try {
      const response = await getTotalDish();
      setTotalDish(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get total dish failed.');
    }
  };

  const handleTopFavorites = async () => {
    setIsShowFavorite(true);
    setIsShowRating(false);
    try {
      const response = await getTopFavorites();
      setTopFavorites(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get top favorites failed.');
    }
  };

  const handleTopRatings = async () => {
    setIsShowFavorite(false);
    setIsShowRating(true);
    try {
      const response = await getTopRatings();
      setTopRatings(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get top ratings failed.');
    }
  };

  // Columns cho Top Favorite table
  const favoriteColumns = useMemo(
    () => [
      {
        accessorKey: 'dish.imageUrl',
        header: 'Image',
        cell: ({ row }) => (
          <div className={cx('dish-image')}>
            {row.original.dish?.imageUrl ? (
              <img
                src={getWebImagePath(row.original.dish?.imageUrl)}
                alt={row.original.dish?.name || 'dish'}
                className={cx('dish-img')}
                onError={(e) => {
                  e.target.src = '/images/default-img.png';
                }}
              />
            ) : (
              <img src='/images/default-img.png' alt='default-img.png' className={cx('dish-img')} />
            )}
          </div>
        )
      },
      {
        accessorKey: 'dish.name',
        header: 'Name',
        cell: ({ row }) => (
          <span className={cx('dish-name')}>
            <strong>{row.original.dish?.name || 'N/A'}</strong>
          </span>
        )
      },
      {
        accessorKey: 'dish.description',
        header: 'Description',
        cell: ({ row }) => (
          <span className={cx('description')}>
            {row.original.dish?.description
              ? row.original.dish.description.length > 50
                ? `${row.original.dish.description.substring(0, 50)}...`
                : row.original.dish.description
              : 'No description'}
          </span>
        )
      },
      {
        accessorKey: 'dish.calorie',
        header: 'Calories',
        cell: ({ row }) => <span className={cx('calories')}>{row.original.dish?.calorie || 'N/A'}</span>
      },
      {
        accessorKey: 'dish.cookingTime',
        header: 'Cooking Time',
        cell: ({ row }) => <span className={cx('cookingTime')}>{row.original.dish?.cookingTime || 'N/A'}</span>
      },
      {
        accessorKey: 'dish.difficulty',
        header: 'Difficulty',
        cell: ({ row }) => (
          <span className={cx('difficulty-cell', row.original.dish?.difficulty)}>
            {row.original.dish?.difficulty || 'N/A'}
          </span>
        )
      },
      {
        accessorKey: 'favoriteCount',
        header: 'Favorites',
        cell: ({ row }) => (
          <div className={cx('favorite-cell')}>
            {row.original.favoriteCount}
            <Icon icon='line-md:heart-filled' width='24' height='24' className={cx('heart-icon')} />
          </div>
        )
      }
    ],
    []
  );

  // Columns cho Top Favorite table
  const ratingColumns = useMemo(
    () => [
      {
        accessorKey: 'dish.imageUrl',
        header: 'Image',
        cell: ({ row }) => (
          <div className={cx('dish-image')}>
            {row.original.dish?.imageUrl ? (
              <img
                src={getWebImagePath(row.original.dish?.imageUrl)}
                alt={row.original.dish?.name || 'dish'}
                className={cx('dish-img')}
                onError={(e) => {
                  e.target.src = '/images/default-img.png';
                }}
              />
            ) : (
              <img src='/images/default-img.png' alt='default-img.png' className={cx('dish-img')} />
            )}
          </div>
        )
      },
      {
        accessorKey: 'dish.name',
        header: 'Name',
        cell: ({ row }) => (
          <span className={cx('dish-name')}>
            <strong>{row.original.dish?.name || 'N/A'}</strong>
          </span>
        )
      },
      {
        accessorKey: 'dish.description',
        header: 'Description',
        cell: ({ row }) => (
          <span className={cx('description')}>
            {row.original.dish?.description
              ? row.original.dish.description.length > 50
                ? `${row.original.dish.description.substring(0, 50)}...`
                : row.original.dish.description
              : 'No description'}
          </span>
        )
      },
      {
        accessorKey: 'dish.calorie',
        header: 'Calories',
        cell: ({ row }) => <span className={cx('calories')}>{row.original.dish?.calorie || 'N/A'}</span>
      },
      {
        accessorKey: 'dish.cookingTime',
        header: 'Cooking Time',
        cell: ({ row }) => <span className={cx('cookingTime')}>{row.original.dish?.cookingTime || 'N/A'}</span>
      },
      {
        accessorKey: 'dish.difficulty',
        header: 'Difficulty',
        cell: ({ row }) => (
          <span className={cx('difficulty-cell', row.original.dish?.difficulty)}>
            {row.original.dish?.difficulty || 'N/A'}
          </span>
        )
      },
      {
        accessorKey: 'averageRating',
        header: 'Rating',
        cell: ({ row }) => (
          <div className={cx('rating-cell')}>
            <Icon icon='line-md:star-filled' width='24' height='24' className={cx('start-icon')} />
            {row.original.averageRating}
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      <div className={cx('title')}>Dashboard</div>

      <div className={cx('content')}>
        <Panel
          type='user'
          title='Users'
          icon='mdi:user-group'
          total={totalUser}
          onClick={() => {
            navigate(ROUTES.USER_MANAGEMENT);
          }}
        />

        <Panel
          type='dish'
          title='Dishs'
          icon='bxs:dish'
          total={totalDish}
          onClick={() => {
            navigate(ROUTES.DISH_MANAGEMENT);
          }}
        />

        <Panel
          type='favorite'
          title='Top Favorite'
          icon='line-md:heart-filled'
          total={10}
          onClick={handleTopFavorites}
        />
        <Panel type='rating' title='Top Rating' icon='line-md:star-filled' total={10} onClick={handleTopRatings} />
      </div>

      <div className={cx('table')}>
        {/* FAVORITE */}
        {isShowFavorite && (
          <TopTable
            data={topFavorites}
            columns={favoriteColumns}
            title='Top Favorite Dishes'
            pageSize={10}
            type='favorite'
          />
        )}

        {/* RATING */}
        {isShowRating && (
          <TopTable data={topRatings} columns={ratingColumns} title='Top Rating Dishes' pageSize={10} type='rating' />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
