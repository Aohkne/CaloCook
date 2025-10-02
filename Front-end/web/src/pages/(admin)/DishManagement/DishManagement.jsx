import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import DataTable from '@/components/ui/DataTable/DataTable';

import { ROUTES } from '@/constants/routes';

import { getWebImagePath } from '@/utils/imageHelper';

import { getTotalDish } from '@/api/dashboard';
import { activateDish, deactivateDish, getDishes } from '@/api/dish';

import styles from './DishManagement.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DishManagement() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [totalDish, setTotalDish] = useState(0);
  const [dishes, setDishes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    minCookingTime: '',
    maxCookingTime: '',
    minCalorie: '',
    maxCalorie: '',
    difficulty: '',
    isActive: ''
  });

  // Handle FILTER changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle range FILTER changes
  const handleRangeFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle PAGINATION
  const handlePageChange = (newPage) => {
    handleDishes(filters, newPage);
  };

  const handleTotalDish = async () => {
    try {
      const response = await getTotalDish();
      setTotalDish(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get total dish failed.');
    }
  };

  //API
  const handleDishes = useCallback(
    async (filterParams = filters, currentPage = 1) => {
      try {
        const response = await getDishes({
          ...filterParams,
          page: currentPage,
          limit: 10
        });

        setDishes(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error(error.response?.data?.message || 'Get dishes failed.');
      }
    },
    [filters]
  );

  const handleDeactiveDish = async (dishId) => {
    try {
      const response = await deactivateDish(dishId);
      setSuccess(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Deactivate dish failed.');
      console.error(error.response?.data?.message || 'Deactivate dish failed.');
    }
  };

  const handleActiveDish = async (dishId) => {
    try {
      const response = await activateDish(dishId);
      setSuccess(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Activate dish failed.');
      console.error(error.response?.data?.message || 'Activate dish failed.');
    }
  };

  // Columns for Dish table
  const dishColumns = useMemo(
    () => [
      {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => (
          <div className={cx('dish-image')}>
            {row.original.imageUrl ? (
              <img
                src={getWebImagePath(row.original.imageUrl)}
                alt={row.original.name || 'dish'}
                className={cx('dish-img')}
                onError={(e) => {
                  e.target.src = '/images/default-img.png';
                }}
              />
            ) : (
              <img src='/images/default-img.png' alt='default dish' className={cx('dish-img')} />
            )}
          </div>
        )
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className={cx('dish-name')}>
            <strong>{row.original.name || 'N/A'}</strong>
          </span>
        )
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className={cx('description')}>
            {row.original.description
              ? row.original.description.length > 50
                ? `${row.original.description.substring(0, 50)}...`
                : row.original.description
              : 'No description'}
          </span>
        )
      },
      {
        accessorKey: 'calorie',
        header: 'Calorie',
        cell: ({ row }) => (
          <span className={cx('calorie')}>{row.original.calorie ? `${row.original.calorie} cal` : 'N/A'}</span>
        )
      },
      {
        accessorKey: 'cookingTime',
        header: 'Cooking Time',
        cell: ({ row }) => (
          <span className={cx('cooking-time')}>
            {row.original.cookingTime ? `${row.original.cookingTime} min` : 'N/A'}
          </span>
        )
      },
      {
        accessorKey: 'difficulty',
        header: 'Difficulty',
        cell: ({ row }) => (
          <span className={cx('difficulty-cell', row.original.difficulty)}>{row.original.difficulty || 'N/A'}</span>
        )
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <span className={cx('status-cell', row.original.isActive ? 'active' : 'inActive')}>
            {row.original.isActive ? 'Active' : 'Blocked'}
          </span>
        )
      },
      {
        accessorKey: 'Action',
        header: 'Action',
        cell: ({ row }) => (
          <div className={cx('dish-cell')}>
            <button onClick={() => handleDeactiveDish(row.original._id)}>
              <Icon icon='lucide:edit' width='24' height='24' className={cx('edit-icon')} />
            </button>
            {row.original.isActive ? (
              <button onClick={() => handleDeactiveDish(row.original._id)}>
                <Icon icon='ic:outline-block' width='24' height='24' className={cx('block-icon')} />
              </button>
            ) : (
              <button onClick={() => handleActiveDish(row.original._id)}>
                <Icon icon='gg:unblock' width='28' height='28' className={cx('unblock-icon')} />
              </button>
            )}
          </div>
        )
      }
    ],
    []
  );

  useEffect(() => {
    setError('');
    setSuccess('');

    //TOTAL DISHES
    handleTotalDish();

    //DISHES
    handleDishes();
  }, [handleDishes]);

  useEffect(() => {
    setError('');
    setSuccess('');

    const delayedSearch = setTimeout(() => {
      handleDishes(filters, 1); // Reset to page 1 when filtering
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [filters, handleDishes]);

  useEffect(() => {
    if (success) {
      handleDishes(filters, pagination.currentPage);
      handleTotalDish();
    }
  }, [success, handleDishes, filters, pagination.currentPage]);

  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      {/* MSG */}
      {error && <div className={cx('error-message')}>{error}</div>}
      {success && <div className={cx('success-message')}>{success}</div>}

      <div className={cx('title')}>Dish Management</div>

      <div className={cx('content')}>
        <Panel
          type='dish'
          title='Dishes'
          icon='bxs:dish'
          total={totalDish}
          onClick={() => {
            navigate(ROUTES.DISH_MANAGEMENT);
          }}
        />
        <button className={cx('create-button')}>
          <Icon icon='typcn:plus' width={50} height={50} className={cx('plus-icon')} />
          CREATE DISH
        </button>
      </div>

      <div className={cx('table')}>
        {/* DISHES */}
        <DataTable
          data={dishes}
          columns={dishColumns}
          title='Dish Management'
          type='dish'
          useServerPagination={true}
          serverPagination={pagination}
          onServerPageChange={handlePageChange}
          // Search
          showServerSearch={true}
          serverSearchFields={[{ key: 'name', placeholder: 'Search by dish name...' }]}
          onServerSearch={handleFilterChange}
          // Status
          showStatusFilter={true}
          statusFilter={filters.isActive}
          onStatusFilterChange={handleFilterChange}
          // Difficulty
          showDifficultyFilter={true}
          difficultyFilter={filters.difficulty}
          // Range: min/max cooking time/calories
          showRangeFilters={true}
          rangeFilters={{
            minCookingTime: filters.minCookingTime,
            maxCookingTime: filters.maxCookingTime,
            minCalorie: filters.minCalorie,
            maxCalorie: filters.maxCalorie
          }}
          onRangeFilterChange={handleRangeFilterChange}
        />
      </div>
    </div>
  );
}

export default DishManagement;
