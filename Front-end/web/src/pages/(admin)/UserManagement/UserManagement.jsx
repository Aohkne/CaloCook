import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import DataTable from '@/components/ui/DataTable/DataTable';

import { ROUTES } from '@/constants/routes';

import { getWebImagePath } from '@/utils/imageHelper';

import { getTotalUser } from '@/api/dashboard';
import { activateUser, deactivateUser, getUsers } from '@/api/user';

import styles from './UserManagement.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function UserManagement() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [totalUser, setTotalUser] = useState(0);
  const [users, setUsers] = useState([]);
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
    username: '',
    email: '',
    isActive: ''
  });

  // Handle FILTER changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle PAGINATION
  const handlePageChange = (newPage) => {
    handleUsers(filters, newPage);
  };

  const handleTotalUser = async () => {
    try {
      const response = await getTotalUser();

      setTotalUser(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get total user failed.');
    }
  };

  //API
  const handleUsers = useCallback(
    async (filterParams = filters, currentPage = 1) => {
      try {
        const response = await getUsers({
          ...filterParams,
          page: currentPage,
          limit: 10
        });

        setUsers(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error(error.response?.data?.message || 'Get users failed.');
      }
    },
    [filters]
  );

  const handleDeactiveUsers = async (userId) => {
    try {
      const response = await deactivateUser(userId);

      setSuccess(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Deactive user failed.');
      console.error(error.response?.data?.message || 'Deactive user failed.');
    }
  };

  const handleActiveUsers = async (userId) => {
    try {
      const response = await activateUser(userId);

      setSuccess(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Active user failed.');
      console.error(error.response?.data?.message || 'Active user failed.');
    }
  };

  // Columns cho Top Favorite table
  const userColumns = useMemo(
    () => [
      {
        accessorKey: 'avatar_url',
        header: 'Avatar',
        cell: ({ row }) => (
          <div className={cx('user-image')}>
            {row.original.avatar_url ? (
              <img
                src={getWebImagePath(row.original.avatar_url)}
                alt={row.original.username || 'avt'}
                className={cx('user-img')}
                onError={(e) => {
                  e.target.src = '/images/default-img.png';
                }}
              />
            ) : (
              <img src='/images/default-img.png' alt='default-img.png' className={cx('user-img')} />
            )}
          </div>
        )
      },
      {
        accessorKey: 'username',
        header: 'Name',
        cell: ({ row }) => (
          <span className={cx('user-name')}>
            <strong>{row.original.username || 'N/A'}</strong>
          </span>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className={cx('email')}>{row.original.email || 'N/A'}</span>
      },
      {
        accessorKey: 'dob',
        header: 'Birth',
        cell: ({ row }) => <span className={cx('dob')}>{row.original.dob || 'N/A'}</span>
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
          <div className={cx('user-cell')}>
            {row.original.isActive ? (
              <Icon
                icon='ic:outline-block'
                width='24'
                height='24'
                className={cx('block-icon')}
                onClick={() => handleDeactiveUsers(row.original._id)}
              />
            ) : (
              <Icon
                icon='gg:unblock'
                width='28'
                height='28'
                className={cx('unblock-icon')}
                onClick={() => handleActiveUsers(row.original._id)}
              />
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

    //TOTAL USERS
    handleTotalUser();

    //USERS
    handleUsers();
  }, [totalUser, handleUsers]);

  useEffect(() => {
    setError('');
    setSuccess('');

    const delayedSearch = setTimeout(() => {
      handleUsers(filters, 1); // Reset to page 1 when filtering
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [filters, handleUsers]);

  useEffect(() => {
    if (success) {
      handleUsers(filters, pagination.currentPage);
      handleTotalUser();
    }
  }, [success, handleUsers, filters, pagination.currentPage]);

  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      {/* MSG */}
      {error && <div className={cx('error-message')}>{error}</div>}
      {success && <div className={cx('success-message')}>{success}</div>}

      <div className={cx('title')}>User Management</div>

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
      </div>

      <div className={cx('table')}>
        {/* USERS */}
        <DataTable
          data={users}
          columns={userColumns}
          title='User Management'
          type='user'
          useServerPagination={true}
          serverPagination={pagination}
          onServerPageChange={handlePageChange}
          showServerSearch={true}
          serverSearchFields={[
            { key: 'username', placeholder: 'Search by username...' },
            { key: 'email', placeholder: 'Search by email...' }
          ]}
          onServerSearch={handleFilterChange}
          showStatusFilter={true}
          statusFilter={filters.isActive}
          onStatusFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

export default UserManagement;
