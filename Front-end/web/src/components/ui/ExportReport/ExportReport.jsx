import { Icon } from '@iconify/react';
import { useState } from 'react';

import { exportReport } from '@/api/report';

import styles from './ExportReport.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ExportReport({ modelOpen = false, onClose }) {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    dishName: '',
    type: 'excel'
  });

  const handleCloseModal = () => {
    setFilters({
      dishName: '',
      type: 'excel'
    });
    setError('');
    setSuccess('');

    if (onClose) onClose();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTypeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      type: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsExporting(true);
    setError('');
    setSuccess('');

    try {
      const response = await exportReport(filters);
      setSuccess(response.message || `Export ${filters.type.toUpperCase()} successful!`);

      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to export reports');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      dishName: '',
      type: filters.type
    });
  };

  if (!modelOpen) return null;

  return (
    <div className={cx('wrapper')}>
      <div className={cx('modal-overlay')} onClick={handleCloseModal}></div>

      <div className={cx('modal')}>
        <div className={cx('modal-content')}>
          {/* HEADER */}
          <div className={cx('modal-content-top')}>
            <div className={cx('modal-title-wrapper')}>
              <Icon icon='line-md:download-loop' width={28} height={28} />
              <h3 className={cx('modal-title')}>Export Reports</h3>
            </div>

            <button
              type='button'
              className={cx('modal-close-button')}
              onClick={handleCloseModal}
              aria-label='Close modal'
            >
              <Icon icon='charm:cross' />
            </button>
          </div>

          {/* FORM */}
          <form className={cx('modal-form')} onSubmit={handleSubmit}>
            {/* Export Type */}
            <div className={cx('form-group', 'export-type-group')}>
              <label className={cx('modal-input-label')}>Export Format</label>
              <div className={cx('export-type-options')}>
                <label className={cx('export-type-option', { active: filters.type === 'excel' })}>
                  <input
                    type='radio'
                    name='type'
                    value='excel'
                    checked={filters.type === 'excel'}
                    onChange={handleTypeChange}
                  />
                  <Icon icon='vscode-icons:file-type-excel' width={32} height={32} />
                  <span>Excel (.xlsx)</span>
                </label>
                <label className={cx('export-type-option', { active: filters.type === 'csv' })}>
                  <input
                    type='radio'
                    name='type'
                    value='csv'
                    checked={filters.type === 'csv'}
                    onChange={handleTypeChange}
                  />
                  <Icon icon='fa7-solid:file-csv' width={32} height={32} />
                  <span>CSV (.csv)</span>
                </label>
              </div>
            </div>

            <div className={cx('divider')}>
              <span>Filters (Optional)</span>
            </div>

            {/* Name Filter */}
            <div className={cx('form-group')}>
              <label htmlFor='name' className={cx('modal-input-label')}>
                <Icon icon='mdi:food' width={18} height={18} />
                Dish Name
              </label>
              <input
                id='dishName'
                type='text'
                value={filters.dishName}
                onChange={handleInputChange}
                placeholder='Dish name'
                className={cx('modal-input')}
              />
            </div>

            {/* MESSAGES */}
            {error && (
              <div className={cx('message', 'error-message')}>
                <Icon icon='mdi:alert-circle' width={20} height={20} />
                {error}
              </div>
            )}
            {success && (
              <div className={cx('message', 'success-message')}>
                <Icon icon='mdi:check-circle' width={20} height={20} />
                {success}
              </div>
            )}

            {/* Actions */}
            <div className={cx('modal-actions')}>
              <button type='button' className={cx('modal-button', 'modal-button-clear')} onClick={handleClearFilters}>
                <Icon icon='mdi:filter-off' width={20} height={20} />
                Clear Filters
              </button>
              <div className={cx('action-buttons')}>
                <button type='button' className={cx('modal-button', 'modal-button-cancel')} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-export')} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Icon icon='line-md:loading-loop' width={20} height={20} />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Icon icon='line-md:download-loop' width={20} height={20} />
                      Export
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExportReport;
