import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import styles from './CookingStepsModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const CookingStepsModal = ({ 
  visible, 
  onClose, 
  steps = [], 
  dishData = {},
  onComplete 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (visible) {
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
    }
  }, [visible]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      
      // Xóa tick của step trước đó (step mà ta sẽ quay về)
      setCompletedSteps(prevCompleted => {
        const newCompleted = new Set(prevCompleted);
        newCompleted.delete(prevStep);
        return newCompleted;
      });
      
      // Lùi về step trước
      setCurrentStepIndex(prevStep);
    }
  };

  const handleStepComplete = () => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStepIndex);
    setCompletedSteps(newCompletedSteps);

    if (currentStepIndex === steps.length - 1) {
      // All steps completed
      onComplete();
    } else {
      // Move to next step
      handleNext();
    }
  };

  const isStepCompleted = (stepIndex) => completedSteps.has(stepIndex);
  const isCurrentStep = (stepIndex) => stepIndex === currentStepIndex;
  const progressPercentage = (completedSteps.size / steps.length) * 100;

  // Helper functions for dish data
  const getCookingTime = () => {
    const time = dishData.cookingTime || dishData.time || 0;
    if (time >= 60) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${time}m`;
  };

  const getDifficulty = () => {
    const difficulty = dishData.difficulty || 'unknown';
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Unknown';
    }
  };

  const renderProgressBar = () => (
    <div className={cx('progress-container')}>
      <div className={cx('progress-header')}>
        <span className={cx('progress-label')}>Progress</span>
        <span className={cx('progress-steps')}>
          {completedSteps.size}/{steps.length} steps
        </span>
      </div>
      <div className={cx('progress-bar-container')}>
        <div className={cx('progress-bar')}>
          <div 
            className={cx('progress-fill')}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderStepCard = (step, index) => {
    const isCompleted = isStepCompleted(index);
    const isCurrent = isCurrentStep(index);
    
    return (
      <div key={index} className={cx('step-card')}>
        <div className={cx('step-card-header')}>
          <div 
            className={cx('step-icon')}
            style={{
              backgroundColor: isCompleted ? 'var(--green)' : 'var(--primary)'
            }}
          >
            {isCompleted ? (
            <Icon icon="heroicons:check" width="16" height="16" color="var(--white)" />
            ) : (
              <span className={cx('step-icon-text')}>{index + 1}</span>
            )}
          </div>
          <span className={cx('step-title')}>
            {step.title || `Step ${index + 1}`}
          </span>
        </div>
        
        <p className={cx('step-description')}>
          {step.description || step.content || 'No description'}
        </p>
        
        {isCompleted && (
          <div className={cx('completed-status')}>
            <Icon icon="heroicons:check" width="14" height="14" color="var(--green)" />
            <span className={cx('completed-text')}>Completed</span>
          </div>
        )}
      </div>
    );
  };

  if (!visible || steps.length === 0) {
    return null;
  }

  return (
    <div className={cx('modal-overlay')}>
      <div className={cx('modal-container')}>
        {/* Header */}
        <div className={cx('header')}>
          <div className={cx('header-content')}>
            <h2 className={cx('header-title')}>{dishData.name || 'Dish'}</h2>
            <p className={cx('header-subtitle')}>
              Time: {getCookingTime()} • Difficulty: {getDifficulty()}
            </p>
          </div>
          <button onClick={onClose} className={cx('close-button')}>
            <Icon icon="heroicons:x-mark" width="24" height="24" />
          </button>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Steps List */}
        <div className={cx('steps-container')}>
          <div className={cx('steps-content')}>
            {steps.map((step, index) => renderStepCard(step, index))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={cx('navigation-container')}>
          <button
            className={cx('nav-button', 'back-button')}
            onClick={handleBack}
          >
            <Icon icon="heroicons:chevron-left" width="20" height="20" />
            <span className={cx('nav-button-text')}>Back</span>
          </button>

          <button
            className={cx('nav-button', 'continue-button')}
            onClick={handleStepComplete}
          >
            <span className={cx('nav-button-text')}>
              {currentStepIndex === steps.length - 1 ? 'Complete' : 'Continue'}
            </span>
            <Icon icon="heroicons:check" width="20" height="20" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingStepsModal;
