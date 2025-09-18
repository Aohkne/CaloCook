import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import DataTable from '@/components/ui/DataTable/DataTable';

import { ROUTES } from '@/constants/routes';
import { getReports, deleteReport } from '@/api/report';

import styles from './ReportManagement.module.scss';
import classNames from 'classnames/bind';
import ComfirmDelete from '@/components/ui/ComfirmDelete/ComfirmDelete';

const cx = classNames.bind(styles);

function UserManagement() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [totalReport, setTotalReport] = useState(0);
  const [reports, setReports] = useState([]);
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
  const handlePageChange = async (newPage) => {
    const page = Number(newPage) || 1;
    await handleUsers(filters, page);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailText, setDetailText] = useState('');

  const openConfirm = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setToDeleteId(null);
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteReport(toDeleteId);
      setSuccess('Report deleted');
      closeConfirm();

      // Refresh current page. handleUsers will return the page info so we can clamp if needed.
      const res = await handleUsers(filters, pagination.currentPage || 1);

      // If current page is now greater than totalPages (e.g., last item on last page deleted), clamp to last page
      if (res && res.currentPage > res.totalPages) {
        await handleUsers(filters, res.totalPages);
      }

      // Update total count badge
      await handleTotalUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleTotalUser = async () => {
    try {
      const response = await getReports();

      const total = response?.totalCount ?? response?.TotalCount ?? response?.data?.totalCount ?? 0;
      setTotalReport(total);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get total user failed.');
    }
  };

  // deletion now handled via confirm dialog

  // API
  const handleUsers = useCallback(async (filterParams = {}, currentPage = 1) => {
    try {
      const limit = 10;

      // Build params by including only truthy filter values
      const params = { page: currentPage, limit };
      if (filterParams && typeof filterParams === 'object') {
        Object.keys(filterParams).forEach((k) => {
          const v = filterParams[k];
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            params[k] = v;
          }
        });
      }

      const reportResponse = await getReports(params);

      const items = reportResponse?.data ?? [];
      const total = reportResponse?.totalCount ?? 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      const usedPage = Math.min(Math.max(1, Number(currentPage || 1)), totalPages);

      setReports(items);
      const prevPage = Math.max(1, usedPage - 1);
      const nextPage = Math.min(totalPages, usedPage + 1);

      setPagination({
        currentPage: usedPage,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: usedPage < totalPages,
        hasPrevPage: usedPage > 1,
        prevPage,
        nextPage
      });

      // Return pagination info so callers can clamp / react if needed
      return { currentPage: usedPage, totalPages, prevPage, nextPage };
    } catch (error) {
      console.error(error.response?.data?.message || 'Get reports failed.');
      return null;
    }
  }, []);

  // Columns cho Top Favorite table
  const userColumns = useMemo(
    () => [
      {
        accessorKey: 'datetime',
        header: 'Datetime',
        cell: ({ row }) => {
          const raw = row.original.createdAt;
          let formatted = 'N/A';
          try {
            if (raw) {
              const d = new Date(raw);
              formatted = new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }).format(d);
            }
          } catch {
            formatted = String(raw);
          }

          return (
            <span className={cx('datetime')}>
              <strong>{formatted}</strong>
            </span>
          );
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className={cx('email')}>{row.original.userEmail || 'N/A'}</span>
      },
      {
        accessorKey: 'dishName',
        header: 'Dish',
        cell: ({ row }) => <span className={cx('dish')}>{row.original.dishName || 'N/A'}</span>
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span
            className={cx('description')}
            onClick={() => {
              const txt = row.original.description || 'N/A';
              setDetailText(txt);
              setDetailOpen(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            {row.original.description
              ? row.original.description.length > 80
                ? `${row.original.description.substring(0, 40)}...`
                : row.original.description
              : 'N/A'}
          </span>
        )
      },
      {
        accessorKey: 'Action',
        header: 'Action',
        cell: ({ row }) => (
          <div className={cx('user-cell')}>
            <button onClick={() => openConfirm(row.original._id || row.original.id)}>
              <Icon icon='material-symbols-light:delete-rounded' width='24' height='24' className={cx('block-icon')} />
            </button>
          </div>
        )
      }
    ],
    []
  );

  useEffect(() => {
    setError('');
    setSuccess('');

    // TOTAL REPORTS
    handleTotalUser();

    // initial load
    handleUsers(filters, 1);
  }, [handleUsers, filters]);

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
          title='Reports'
          icon='tabler:message-report-filled'
          total={totalReport}
          onClick={() => {
            navigate(ROUTES.REPORT_MANAGEMENT);
          }}
        />
      </div>

      <div className={cx('table')}>
        {/* USERS */}
        <DataTable
          data={reports}
          columns={userColumns}
          title='User Management'
          type='user'
          useServerPagination={true}
          serverPagination={pagination}
          // Search
          onServerPageChange={handlePageChange}
          showServerSearch={true}
          // Status
          onServerSearch={handleFilterChange}
        />
        <ComfirmDelete
          open={confirmOpen}
          title='Delete report'
          message='Are you sure you want to delete this report?'
          onCancel={closeConfirm}
          onConfirm={handleConfirmDelete}
        />
        {/* Full description modal */}
        {detailOpen && (
          <div className={cx('detail-modal-overlay')} onClick={() => setDetailOpen(false)}>
            <div className={cx('detail-modal')} onClick={(e) => e.stopPropagation()}>
              <div className={cx('detail-modal-header')}>Full description</div>
              <div className={cx('detail-modal-body')}>{detailText}</div>
              <div className={cx('detail-modal-actions')}>
                <button className={cx('btn', 'close')} onClick={() => setDetailOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
