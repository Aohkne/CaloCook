import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, Check, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@contexts/ThemeProvider';

const { width, height } = Dimensions.get('window');

const CookingStepsModal = ({ 
  visible, 
  onClose, 
  steps = [], 
  dishData = {},
  onComplete 
}) => {
  const { colors } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const styles = createStyles(colors);

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
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressSteps}>
          {completedSteps.size}/{steps.length} steps
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  const renderStepCard = (step, index) => {
    const isCompleted = isStepCompleted(index);
    const isCurrent = isCurrentStep(index);
    
    return (
      <View key={index} style={styles.stepCard}>
        <View style={styles.stepCardHeader}>
          <View style={[
            styles.stepIcon,
            {
              backgroundColor: isCompleted ? colors.green : colors.primary
            }
          ]}>
            {isCompleted ? (
              <Check size={16} color={colors.white} />
            ) : (
              <Text style={styles.stepIconText}>{index + 1}</Text>
            )}
          </View>
          <Text style={styles.stepTitle}>
            {step.title || `Step ${index + 1}`}
          </Text>
        </View>
        
        <Text style={styles.stepDescription}>
          {step.description || step.content || 'No description'}
        </Text>
        
        {isCompleted && (
          <View style={styles.completedStatus}>
            <Check size={14} color={colors.green} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    );
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{dishData.name || 'Dish'}</Text>
            <Text style={styles.headerSubtitle}>
              Time: {getCookingTime()} • Difficulty: {getDifficulty()}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Steps List */}
        <ScrollView 
          style={styles.stepsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.stepsContent}
        >
          {steps.map((step, index) => renderStepCard(step, index))}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={handleBack}
          >
            <ChevronLeft size={20} color={colors.white} />
            <Text style={[styles.navButtonText, { color: colors.white }]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.continueButton]}
            onPress={handleStepComplete}
          >
            <Text style={[styles.navButtonText, { color: colors.white }]}>
              {currentStepIndex === steps.length - 1 ? 'Complete' : 'Continue'}
            </Text>
            <Check size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.cardBg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.title,
  },
  progressSteps: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.description,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.inputBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.green,
    borderRadius: 4,
  },
  stepsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stepsContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  stepCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.title,
    flex: 1,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.description,
    lineHeight: 24,
    marginBottom: 8,
  },
  completedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.green,
    marginLeft: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 140,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    backgroundColor: colors.secondary,
  },
  continueButton: {
    backgroundColor: colors.secondary,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 8,
    letterSpacing: 0.3,
  },
});

export default CookingStepsModal;