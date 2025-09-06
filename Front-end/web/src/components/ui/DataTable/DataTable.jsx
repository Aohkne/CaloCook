import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { Icon } from '@iconify/react';

import styles from './DataTable.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DataTable({
  data = [],
  columns = [],
  title = 'Top Table',
  type,
  pageSize = 10,
  showSearch = true,
  showPagination = true,
  // Server-side props
  showServerSearch = false,
  serverSearchFields = [],
  onServerSearch,
  showStatusFilter = false,
  statusFilter = '',
  onStatusFilterChange,
  // Server-side pagination props
  useServerPagination = false,
  serverPagination = {},
  onServerPageChange
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize
  });
  const [searchValues, setSearchValues] = useState({});

  // Handle search input changes with debounce
  const handleSearchChange = (field, value) => {
    const newSearchValues = { ...searchValues, [field]: value };
    setSearchValues(newSearchValues);

    if (onServerSearch) {
      onServerSearch(field, value);
    }
  };

  // Configure table for client-side or server-side
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(useServerPagination
      ? {
          // Server-side pagination config
          manualPagination: true,
          pageCount: serverPagination.totalPages || -1,
          state: {
            sorting,
            pagination: {
              pageIndex: serverPagination.currentPage - 1 || 0,
              pageSize: serverPagination.itemsPerPage || 10
            }
          },
          onSortingChange: setSorting,
          getSortedRowModel: getSortedRowModel()
        }
      : {
          // Client-side pagination config
          state: {
            sorting,
            globalFilter,
            pagination
          },
          onSortingChange: setSorting,
          onGlobalFilterChange: setGlobalFilter,
          onPaginationChange: setPagination,
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel()
        })
  });

  return (
    <div className={cx('table-container')}>
      {/* Header */}
      <div className={cx('table-header', type)}>
        <h3 className={cx('table-title')}>{title}</h3>

        <div className={cx('filters-container')}>
          {/* Server-side search fields */}
          {showServerSearch &&
            serverSearchFields.map((field) => (
              <div key={field.key} className={cx('search-container')}>
                <Icon icon='mingcute:search-line' className={cx('search-icon')} />
                <input
                  type='text'
                  placeholder={field.placeholder}
                  value={searchValues[field.key] || ''}
                  onChange={(e) => handleSearchChange(field.key, e.target.value)}
                  className={cx('search-input')}
                />
              </div>
            ))}

          {/* Client-side global search */}
          {showSearch && !showServerSearch && (
            <div className={cx('search-container')}>
              <Icon icon='mingcute:search-line' className={cx('search-icon')} />
              <input
                type='text'
                placeholder='Search...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={cx('search-input')}
              />
            </div>
          )}

          {/* Status filter */}
          {showStatusFilter && (
            <div className={cx('filter-container')}>
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange('isActive', e.target.value)}
                className={cx('status-filter')}
              >
                <option value=''>All Status</option>
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={cx('table-wrapper', type)}>
        <table className={cx('table')}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cx('table-header-cell', type, {
                      sortable: header.column.getCanSort()
                    })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={cx('header-content')}>
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {header.column.getCanSort() && (
                        <div className={cx('sort-icon')}>
                          {header.column.getIsSorted() === 'asc' && <Icon icon='mingcute:up-line' />}
                          {header.column.getIsSorted() === 'desc' && <Icon icon='mingcute:down-line' />}
                          {!header.column.getIsSorted() && <Icon icon='mingcute:sort-line' />}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={cx('no-data')}>
                  <div className={cx('no-data-content')}>
                    <Icon icon='mingcute:file-search-line' className={cx('no-data-icon')} />
                    <p>No data found</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={cx('table-row', type)}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={cx('table-cell', type)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Server-side Pagination */}
      {useServerPagination && showPagination && (
        <div className={cx('pagination-container')}>
          <div className={cx('pagination-info')}>
            Showing {(serverPagination.currentPage - 1) * serverPagination.itemsPerPage + 1} to{' '}
            {Math.min(serverPagination.currentPage * serverPagination.itemsPerPage, serverPagination.totalItems)} of{' '}
            {serverPagination.totalItems} entries
          </div>

          <div className={cx('pagination-controls')}>
            <button
              onClick={() => onServerPageChange(1)}
              disabled={!serverPagination.hasPrevPage}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:left-line' />
              <Icon icon='mingcute:left-line' />
            </button>

            <button
              onClick={() => onServerPageChange(serverPagination.prevPage)}
              disabled={!serverPagination.hasPrevPage}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:left-line' />
            </button>

            <div className={cx('page-numbers')}>
              {Array.from({ length: Math.min(5, serverPagination.totalPages) }, (_, i) => {
                const pageIndex = Math.max(1, serverPagination.currentPage - 2) + i;
                if (pageIndex > serverPagination.totalPages) return null;

                return (
                  <button
                    key={pageIndex}
                    onClick={() => onServerPageChange(pageIndex)}
                    className={cx('page-btn', type, {
                      active: pageIndex === serverPagination.currentPage
                    })}
                  >
                    {pageIndex}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onServerPageChange(serverPagination.nextPage)}
              disabled={!serverPagination.hasNextPage}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:right-line' />
            </button>

            <button
              onClick={() => onServerPageChange(serverPagination.totalPages)}
              disabled={!serverPagination.hasNextPage}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:right-line' />
              <Icon icon='mingcute:right-line' />
            </button>
          </div>
        </div>
      )}

      {/* Client-side Pagination */}
      {showPagination && !useServerPagination && (
        <div className={cx('pagination-container')}>
          <div className={cx('pagination-info')}>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
          </div>

          <div className={cx('pagination-controls')}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:left-line' />
              <Icon icon='mingcute:left-line' />
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:left-line' />
            </button>

            <div className={cx('page-numbers')}>
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                const pageIndex = Math.max(0, table.getState().pagination.pageIndex - 2) + i;
                if (pageIndex >= table.getPageCount()) return null;

                return (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={cx('page-btn', type, {
                      active: pageIndex === table.getState().pagination.pageIndex
                    })}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:right-line' />
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={cx('pagination-btn', type)}
            >
              <Icon icon='mingcute:right-line' />
              <Icon icon='mingcute:right-line' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
