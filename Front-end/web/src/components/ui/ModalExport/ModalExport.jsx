import { Icon } from '@iconify/react';
import { useState } from 'react';

import { exportDish } from '@/api/dish';

import styles from './ModalExport.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ModalExport({ modelOpen = false, onClose }) {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    minCookingTime: '',
    maxCookingTime: '',
    minCalorie: '',
    maxCalorie: '',
    difficulty: '',
    isActive: '',
    type: 'excel'
  });

  const handleCloseModal = () => {
    setFilters({
      name: '',
      minCookingTime: '',
      maxCookingTime: '',
      minCalorie: '',
      maxCalorie: '',
      difficulty: '',
      isActive: '',
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

  const handleDifficultyChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: e.target.value
    }));
  };

  const handleActiveChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      isActive: value
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
      const response = await exportDish(filters);
      setSuccess(response.message || `Export ${filters.type.toUpperCase()} successful!`);

      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to export dishes');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      minCookingTime: '',
      maxCookingTime: '',
      minCalorie: '',
      maxCalorie: '',
      difficulty: '',
      isActive: '',
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
              <h3 className={cx('modal-title')}>Export Dishes</h3>
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
                Name
              </label>
              <input
                id='name'
                type='text'
                value={filters.name}
                onChange={handleInputChange}
                placeholder='Dish name'
                className={cx('modal-input')}
              />
            </div>

            {/* Cooking Time Range */}
            <div className={cx('form-row')}>
              <div className={cx('form-group', 'half')}>
                <label htmlFor='minCookingTime' className={cx('modal-input-label')}>
                  <Icon icon='mdi:clock-outline' width={18} height={18} />
                  Min Cooking Time
                </label>
                <input
                  id='minCookingTime'
                  type='number'
                  value={filters.minCookingTime}
                  onChange={handleInputChange}
                  placeholder='Min (minutes)'
                  className={cx('modal-input')}
                  min='0'
                />
              </div>
              <div className={cx('form-group', 'half')}>
                <label htmlFor='maxCookingTime' className={cx('modal-input-label')}>
                  Max Cooking Time
                </label>
                <input
                  id='maxCookingTime'
                  type='number'
                  value={filters.maxCookingTime}
                  onChange={handleInputChange}
                  placeholder='Max (minutes)'
                  className={cx('modal-input')}
                  min='0'
                />
              </div>
            </div>

            {/* Calorie Range */}
            <div className={cx('form-row')}>
              <div className={cx('form-group', 'half')}>
                <label htmlFor='minCalorie' className={cx('modal-input-label')}>
                  <Icon icon='mdi:fire' width={18} height={18} />
                  Min Calories
                </label>
                <input
                  id='minCalorie'
                  type='number'
                  value={filters.minCalorie}
                  onChange={handleInputChange}
                  placeholder='Min (kcal)'
                  className={cx('modal-input')}
                  min='0'
                />
              </div>
              <div className={cx('form-group', 'half')}>
                <label htmlFor='maxCalorie' className={cx('modal-input-label')}>
                  Max Calories
                </label>
                <input
                  id='maxCalorie'
                  type='number'
                  value={filters.maxCalorie}
                  onChange={handleInputChange}
                  placeholder='Max (kcal)'
                  className={cx('modal-input')}
                  min='0'
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className={cx('form-group')}>
              <label className={cx('modal-input-label')}>
                <Icon icon='mdi:chef-hat' width={18} height={18} />
                Difficulty
              </label>
              <div className={cx('difficulty-blocks')}>
                <label className={cx('difficulty-block', { active: filters.difficulty === '' })}>
                  <input
                    type='radio'
                    name='difficulty'
                    value=''
                    checked={filters.difficulty === ''}
                    onChange={handleDifficultyChange}
                  />
                  <span>All</span>
                </label>
                <label className={cx('difficulty-block', 'easy', { active: filters.difficulty === 'easy' })}>
                  <input
                    type='radio'
                    name='difficulty'
                    value='easy'
                    checked={filters.difficulty === 'easy'}
                    onChange={handleDifficultyChange}
                  />
                  <span>Easy</span>
                </label>
                <label className={cx('difficulty-block', 'medium', { active: filters.difficulty === 'medium' })}>
                  <input
                    type='radio'
                    name='difficulty'
                    value='medium'
                    checked={filters.difficulty === 'medium'}
                    onChange={handleDifficultyChange}
                  />
                  <span>Medium</span>
                </label>
                <label className={cx('difficulty-block', 'hard', { active: filters.difficulty === 'hard' })}>
                  <input
                    type='radio'
                    name='difficulty'
                    value='hard'
                    checked={filters.difficulty === 'hard'}
                    onChange={handleDifficultyChange}
                  />
                  <span>Hard</span>
                </label>
              </div>
            </div>

            {/* Status Filter */}
            <div className={cx('form-group')}>
              <label className={cx('modal-input-label')}>
                <Icon icon='mdi:check-circle' width={18} height={18} />
                Status
              </label>
              <div className={cx('status-blocks')}>
                <label className={cx('status-block', { active: filters.isActive === '' })}>
                  <input
                    type='radio'
                    name='isActive'
                    value=''
                    checked={filters.isActive === ''}
                    onChange={() => handleActiveChange('')}
                  />
                  <span>All</span>
                </label>
                <label className={cx('status-block', 'active-status', { active: filters.isActive === 'true' })}>
                  <input
                    type='radio'
                    name='isActive'
                    value='true'
                    checked={filters.isActive === 'true'}
                    onChange={() => handleActiveChange('true')}
                  />
                  <span>Active</span>
                </label>
                <label className={cx('status-block', 'inactive-status', { active: filters.isActive === 'false' })}>
                  <input
                    type='radio'
                    name='isActive'
                    value='false'
                    checked={filters.isActive === 'false'}
                    onChange={() => handleActiveChange('false')}
                  />
                  <span>Blocked</span>
                </label>
              </div>
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

export default ModalExport;
