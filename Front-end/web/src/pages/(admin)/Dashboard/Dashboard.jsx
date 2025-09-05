import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import DataTable from '@/components/ui/DataTable/DataTable';

import { getWebImagePath } from '@/utils/imageHelper';

import { getTopFavorites, getTotalDish, getTotalUser } from '@/api/dashboard';

import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
  const [totalUser, setTotalUser] = useState(0);
  const [totalDish, setTotalDish] = useState(0);
  const [topFavorites, setTopFavorites] = useState([]);

  useEffect(() => {
    //USERS
    handleTotalUser();

    //DISHS
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
    try {
      const response = await getTopFavorites();
      console.log(response.data);
      setTopFavorites(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get top favorites failed.');
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
        cell: ({ row }) => <span className={cx('difficulty')}>{row.original.dish?.difficulty || 'N/A'}</span>
      },
      {
        accessorKey: 'favoriteCount',
        header: 'Favorites',
        cell: ({ row }) => (
          <div className={cx('favorite-cell')}>
            {row.original.favoriteCount}
            <Icon icon='line-md:heart-filled' className={cx('heart-icon')} />
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
        <Panel type='user' title='Users' icon='mdi:user-group' total={totalUser} />
        <Panel type='dish' title='Dishs' icon='bxs:dish' total={totalDish} />
        <Panel type='favorite' title='Top Favorite' icon='line-md:heart-filled' total={10} />
        <Panel type='rating' title='Top Rating' icon='line-md:star-filled' total={10} />
      </div>

      <div className={cx('table')}>
        <DataTable
          data={topFavorites}
          columns={favoriteColumns}
          title='Top Favorite Dishes'
          pageSize={10}
          type='favorite'
        />
      </div>
    </div>
  );
}

export default Dashboard;
