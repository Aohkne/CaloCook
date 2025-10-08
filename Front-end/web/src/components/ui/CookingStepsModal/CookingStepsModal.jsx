import React, { useState, useEffect } from 'react';
import { X, Check, ChevronLeft } from 'lucide-react';
import styles from './CookingStepsModal.module.scss';

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
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Progress</span>
        <span className={styles.progressSteps}>
          {completedSteps.size}/{steps.length} steps
        </span>
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
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
      <div key={index} className={styles.stepCard}>
        <div className={styles.stepCardHeader}>
          <div className={`${styles.stepIcon} ${isCompleted ? styles.stepIconCompleted : ''}`}>
            {isCompleted ? (
              <Check size={16} />
            ) : (
              <span className={styles.stepIconText}>{index + 1}</span>
            )}
          </div>
          <span className={styles.stepTitle}>
            {step.title || `Step ${index + 1}`}
          </span>
        </div>
        
        <p className={styles.stepDescription}>
          {step.description || step.content || 'No description'}
        </p>
        
        {isCompleted && (
          <div className={styles.completedStatus}>
            <Check size={14} />
            <span className={styles.completedText}>Completed</span>
          </div>
        )}
      </div>
    );
  };

  if (!visible || steps.length === 0) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.headerTitle}>{dishData.name || 'Dish'}</h2>
            <p className={styles.headerSubtitle}>
              Time: {getCookingTime()} • Difficulty: {getDifficulty()}
            </p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Steps List */}
        <div className={styles.stepsContainer}>
          <div className={styles.stepsContent}>
            {steps.map((step, index) => renderStepCard(step, index))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.navigationContainer}>
          <button
            className={`${styles.navButton} ${styles.backButton}`}
            onClick={handleBack}
          >
            <ChevronLeft size={20} />
            <span className={styles.navButtonText}>Back</span>
          </button>

          <button
            className={`${styles.navButton} ${styles.continueButton}`}
            onClick={handleStepComplete}
          >
            <span className={styles.navButtonText}>
              {currentStepIndex === steps.length - 1 ? 'Complete' : 'Continue'}
            </span>
            <Check size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingStepsModal;
