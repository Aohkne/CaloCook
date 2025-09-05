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
  title = 'Data Table',
  pageSize = 10,
  showSearch = true,
  showPagination = true,
  type
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className={cx('table-container')}>
      {/* Header */}
      <div className={cx('table-header', type)}>
        <h3 className={cx('table-title')}>{title}</h3>

        {showSearch && (
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
      </div>

      {/* Table */}
      <div className={cx('table-wrapper')}>
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

      {/* Pagination */}
      {showPagination && (
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
              className={cx('pagination-btn')}
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
              className={cx('pagination-btn')}
            >
              <Icon icon='mingcute:right-line' />
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={cx('pagination-btn')}
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
