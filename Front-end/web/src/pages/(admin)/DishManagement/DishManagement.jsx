import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import DataTable from '@/components/ui/DataTable/DataTable';

import { ROUTES } from '@/constants/routes';

import { getWebImagePath } from '@/utils/imageHelper';

import { getTotalDish } from '@/api/dashboard';
import { activateDish, deactivateDish, createDish, getDishes } from '@/api/dish';

import styles from './DishManagement.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DishManagement() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
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

  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cookingTime: '',
    calorie: '',
    difficulty: 'easy',
    isActive: true,
    imageUrl: ''
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

  // Handle Modal
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({
      name: '',
      description: '',
      cookingTime: '',
      calorie: '',
      difficulty: 'easy',
      isActive: true,
      imageUrl: ''
    });

    setCreateModalOpen(false);
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

  // Add form handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleDifficultyChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: e.target.value
    }));
  };

  const handleActiveChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createDish(formData);
      setSuccess(response.message || 'Dish created successfully');

      handleCloseModal();
      // Reset form
      setFormData({
        name: '',
        description: '',
        cookingTime: '',
        calorie: '',
        difficulty: 'easy',
        isActive: true,
        imageUrl: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create dish');
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
        <button className={cx('create-button')} onClick={handleOpenCreateModal}>
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
      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Create Dish</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                onClick={handleCloseModal}
                aria-label='Close modal'
              >
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmit}>
              <div className={cx('form-group')}>
                <label htmlFor='name' className={cx('modal-input-label')}>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Enter dish name'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='cookingTime' className={cx('modal-input-label')}>
                  Cooking Time (minutes)
                </label>
                <input
                  id='cookingTime'
                  type='number'
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  placeholder='Enter cooking time'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='calorie' className={cx('modal-input-label')}>
                  Calories
                </label>
                <input
                  id='calorie'
                  type='number'
                  value={formData.calorie}
                  onChange={handleInputChange}
                  placeholder='Enter calories'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group', 'difficulty-group')}>
                <span className={cx('modal-input-label')}>Difficulty</span>
                <div className={cx('difficulty-blocks')}>
                  <label className={cx('difficulty-block')}>
                    <input
                      type='radio'
                      name='difficulty'
                      value='easy'
                      checked={formData.difficulty === 'easy'}
                      onChange={handleDifficultyChange}
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Easy</span>
                  </label>
                  <label className={cx('difficulty-block')}>
                    <input
                      type='radio'
                      name='difficulty'
                      value='medium'
                      checked={formData.difficulty === 'medium'}
                      onChange={handleDifficultyChange}
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Medium</span>
                  </label>
                  <label className={cx('difficulty-block')}>
                    <input
                      type='radio'
                      name='difficulty'
                      value='hard'
                      checked={formData.difficulty === 'hard'}
                      onChange={handleDifficultyChange}
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Hard</span>
                  </label>
                </div>
              </div>

              <div className={cx('form-group', 'description-group')}>
                <label htmlFor='description' className={cx('modal-input-label')}>
                  Description
                </label>
                <textarea
                  id='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Enter dish description'
                  className={cx('modal-input', 'modal-textarea')}
                  rows={10}
                  required
                />
              </div>

              <div className={cx('form-group', 'image-group')}>
                <label className={cx('modal-input-label')}>Image</label>
                <label htmlFor='image-upload' className={cx('image-upload-area')}>
                  <input
                    type='file'
                    id='image-upload'
                    accept='image/*'
                    onChange={handleImageChange}
                    className={cx('image-upload-input')}
                  />
                  <div className={cx('image-upload-content')}>
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt='Preview' className={cx('image-preview')} />
                    ) : (
                      <>
                        <Icon icon='mdi-light:image' width='50' height='50' />
                        <span className={cx('image-upload-text')}>Click to upload</span>
                        <span className={cx('image-upload-subtext')}>No file selected</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className={cx('form-group', 'activate-group')}>
                <div className={cx('activate-content')}>
                  <div>
                    <h4 className={cx('activate-title')}>Activate Dish</h4>
                    <p className={cx('activate-text')}>Make this dish available to users</p>
                  </div>
                  <label className={cx('switch')}>
                    <input
                      type='checkbox'
                      checked={formData.isActive}
                      onChange={handleActiveChange}
                      className={cx('switch-input')}
                    />
                    <span className={cx('switch-slider')}></span>
                  </label>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button type='button' className={cx('modal-button', 'modal-button-cancel')} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-create')}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DishManagement;
