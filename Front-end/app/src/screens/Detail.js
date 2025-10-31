import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeProvider';
import { Heart, Clock, Flame, ChefHat, ChevronLeft, Star, Share2 } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getDishDetailData, clearDishDetail, updateDishLikeStatus } from '@redux/slices/dishSlice';
import { likeDish, dislikeDish, updateFavoriteItem } from '@redux/slices/favoriteSlice';
import { imageMap } from '@/constants/imageAssets';
import { addEatingHistory, getTotalCalories, createReport } from '@redux/slices/userSlice';
import CookingStepsModal from '@/components/CookingStepsModal';
import { addAchievementPoints } from '@redux/slices/achievementSlice';
import MedalAchievementModal from '@/components/MedalAchievementModal';
import {
  createRating,
  getRatingsByDishId,
  getAverageRating,
  separateUserRating,
  clearError as clearRatingError,
  resetRatings
} from '@redux/slices/ratingSlice';
export default function Detail({ route, navigation }) {
  const { dish } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  // Get detail data from Redux
  const { dishDetail, dishIngredients, dishSteps, isLoadingDetail, detailError } = useSelector((state) => state.dish);

  // Get user and favorites data
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorite);

  // Check if current dish is in favorites and sync state
  const dishId = dish._id || dish.id;
  const isFavoriteDish = favorites.some((fav) => fav.dishId === dishId);
  const [isLiked, setIsLiked] = useState(dish.isLiked || isFavoriteDish);
  const [isCookingModalVisible, setIsCookingModalVisible] = useState(false);
  const [showMedalModal, setShowMedalModal] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [newPoints, setNewPoints] = useState(0);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportError, setReportError] = useState('');
  const {
    ratings,
    averageRating,
    totalRatings,
    userOwnRating,
    isLoading: isLoadingRating,
    error: ratingError,
    successMessage: ratingSuccess
  } = useSelector((state) => state.rating);
  //  Rating states
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewDetailModalVisible, setIsReviewDetailModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingDescription, setRatingDescription] = useState('');

  //  Separate user's rating from others
  const otherReviews = ratings.filter((r) => {
    const ratingUserId = typeof r.userId === 'object' ? r.userId._id : r.userId;
    return ratingUserId !== user?._id;
  });

  // Helper function để capitalize text
  const capitalizeText = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Sync local state with favorites when favorites change
  useEffect(() => {
    const isFavorite = favorites.some((fav) => fav.dishId === dishId);
    setIsLiked(isFavorite);
  }, [favorites, dishId]);

  // Fetch detail data khi component mount
  useEffect(() => {
    if (dish._id || dish.id) {
      const dishId = dish._id || dish.id;

      // Fetch dish detail
      dispatch(getDishDetailData(dishId));

      // Fetch ratings
      dispatch(
        getRatingsByDishId({
          dishId,
          sortBy: 'createdAt',
          order: 'desc'
        })
      );

      // Fetch average rating
      dispatch(getAverageRating(dishId));
    }

    // Cleanup khi component unmount
    return () => {
      dispatch(clearDishDetail());
      dispatch(resetRatings());
    };
  }, [dispatch, dish._id, dish.id]);

  // ✅ Separate user's own rating when ratings or user changes
  useEffect(() => {
    if (user?._id && ratings.length > 0) {
      dispatch(separateUserRating({ userId: user._id }));
    }
  }, [dispatch, ratings, user?._id]);

  useEffect(() => {
    if (ratingError) {
      Alert.alert('Error', ratingError);
      dispatch(clearRatingError());
    }
  }, [ratingError, dispatch]);

  useEffect(() => {
    if (ratingSuccess) {
      Alert.alert('Success', ratingSuccess);
      dispatch(clearRatingError());
    }
  }, [ratingSuccess, dispatch]);

  // ✅ Rating handlers
  const renderStars = (rating, isInteractive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = isInteractive
        ? hoveredStar
          ? starValue <= hoveredStar
          : starValue <= userRating
        : starValue <= Math.floor(rating);

      return (
        <TouchableOpacity
          key={index}
          disabled={!isInteractive}
          onPress={isInteractive ? () => handleStarPress(starValue) : undefined}
        >
          <Star size={isInteractive ? 32 : 16} color={colors.yellow} fill={isFilled ? colors.yellow : 'none'} />
        </TouchableOpacity>
      );
    });
  };

  const handleStarPress = (rating) => {
    if (!user?._id) {
      Alert.alert('Error', 'Please login to rate this dish');
      return;
    }
    setUserRating(rating);
    setIsRatingModalVisible(true);
  };

  const handleReviewPress = (review) => {
    setSelectedReview(review);
    setIsReviewDetailModalVisible(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalVisible(false);
    setRatingDescription('');
    setUserRating(0);
  };

  const handleSubmitRating = async () => {
    const trimmedDescription = ratingDescription.trim();

    if (!trimmedDescription) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (trimmedDescription.length < 10) {
      Alert.alert('Error', 'Description must be at least 10 characters');
      return;
    }

    try {
      await dispatch(
        createRating({
          userId: user._id,
          dishId: dishId,
          star: userRating,
          description: trimmedDescription
        })
      ).unwrap();

      // ✅ Đợi cả 2 API hoàn thành trước khi đóng modal
      await Promise.all([
        dispatch(
          getRatingsByDishId({
            dishId,
            sortBy: 'createdAt',
            order: 'desc'
          })
        ).unwrap(),
        dispatch(getAverageRating(dishId)).unwrap()
      ]);

      // Reset và đóng modal sau khi refresh xong
      handleCloseRatingModal();
      setUserRating(0);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit rating');
    }
  };

  // Handle error
  useEffect(() => {
    if (detailError) {
      Alert.alert('Error', detailError);
    }
  }, [detailError]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Updated heart press handler with API integration
  const handleHeartPress = useCallback(async () => {
    if (!user?._id) {
      Alert.alert('Error', 'Please login to add favorites');
      return;
    }

    try {
      if (isLiked) {
        // Update local state immediately for instant UI feedback
        setIsLiked(false);

        // Call API to dislike
        await dispatch(
          dislikeDish({
            userId: user._id,
            dishId: dishId
          })
        ).unwrap();

        // Update dish slice to sync with other screens
        dispatch(updateDishLikeStatus({ dishId, isLiked: false }));
      } else {
        // Update local state immediately for instant UI feedback
        setIsLiked(true);

        // Call API to like
        const result = await dispatch(
          likeDish({
            userId: user._id,
            dishId: dishId
          })
        ).unwrap();

        // Update dish slice to sync with other screens
        dispatch(updateDishLikeStatus({ dishId, isLiked: true }));

        // Create new favorite item for immediate UI update
        const newFavoriteItem = {
          _id: result._id || `temp_${dishId}_${Date.now()}`,
          dishId: dishId,
          dish: dishDetail || dish,
          createdAt: new Date().toISOString()
        };

        // Update favorites list
        dispatch(
          updateFavoriteItem({
            dishId,
            favoriteData: newFavoriteItem,
            action: 'like'
          })
        );
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);

      // Revert local state on error
      setIsLiked(!isLiked);

      Alert.alert('Error', error.message || 'Failed to update favorite');
    }
  }, [dispatch, user, isLiked, dish, dishDetail, dishId]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toISOString().split('T')[0];
    } catch (error) {
      return 'N/A';
    }
  };

  // Handle Report Modal
  const handleOpenReportModal = () => {
    if (!user?._id) {
      Alert.alert('Error', 'Please login to report');
      return;
    }
    setIsReportModalVisible(true);
    setReportError('');
    setReportReason('');
  };

  const handleCloseReportModal = () => {
    setIsReportModalVisible(false);
    setReportError('');
    setReportReason('');
  };

  const handleSubmitReport = async () => {
    const trimmedReason = reportReason.trim();

    if (!trimmedReason) {
      setReportError('Please enter a reason for reporting');
      return;
    }

    if (trimmedReason.length < 10) {
      setReportError('Reason must be at least 10 characters');
      return;
    }

    try {
      await dispatch(
        createReport({
          dishId: dishId,
          description: trimmedReason
        })
      ).unwrap();

      Alert.alert('Success', 'Report submitted successfully');
      handleCloseReportModal();
    } catch (error) {
      setReportError(error.message || 'Failed to submit report');
    }
  };

  const handleLetsCook = () => {
    if (!user?._id) {
      Alert.alert('Error', 'Please login to track calories');
      return;
    }
    setIsCookingModalVisible(true); // Hiện modal cooking steps thay vì add history ngay
  };

  // Handle Share Ingredient
  const handleShareIngredient = async () => {
    try {
      // Ensure we have full detail (ingredients/steps). If not, fetch them.
      if (!(dishDetail && (dishIngredients?.length > 0 || dishSteps?.length > 0))) {
        if (dishId) {
          try {
            await dispatch(getDishDetailData(dishId)).unwrap();
          } catch (fetchErr) {
            console.warn('Could not fetch full dish detail for sharing', fetchErr);
          }
        }
      }

      // Prefer the dedicated slices, fallback to fields in dishDetail or initial dish prop
      const ings = dishIngredients?.length ? dishIngredients : dishDetail?.ingredients || dish?.ingredients || [];
      const stepsArr = dishSteps?.length ? dishSteps : dishDetail?.steps || dish?.steps || [];

      const ingredientsText =
        ings.length > 0
          ? ings
              .map((ing) => {
                const qty = ing.quantity ? `${ing.quantity}` : '';
                const unit = ing.unit ? ` ${ing.unit}` : '';
                const name = ing.name || ing.ingredientName || ing.title || '';
                return `- ${[qty, unit, name].join(' ').trim()}`;
              })
              .join('\n')
          : 'No ingredients listed';

      const stepsText =
        stepsArr.length > 0
          ? stepsArr
              .map((s, idx) => {
                const num = s.stepNumber || idx + 1;
                const title = s.title ? `${s.title} - ` : '';
                const desc = s.description || s.text || '';
                const dur = s.duration ? ` (${s.duration} min)` : '';
                return `${num}. ${title}${desc}${dur}`.trim();
              })
              .join('\n')
          : 'No steps listed';

      const message = [
        `🔥 Check out this recipe — let's cook this today!`,
        `🍽 Dish: ${dishData?.name || dish?.name || 'Unknown'}`,
        `⏱ Time: ${dishData?.cookingTime || dish?.time || 'N/A'} min`,
        `🔥 Calories: ${dishData?.calorie || dish?.calories || 'N/A'} kcal`,
        `🎯 Difficulty: ${capitalizeText(dishData?.difficulty || dish?.difficulty) || 'N/A'}`,
        `⭐ Rating: ${averageRating ? averageRating.toFixed(1) : dishData?.rating || 'N/A'}/5`,
        '',
        `📝 Description:\n${dishData?.description || dish?.description || 'No description'}`,
        '',
        `🥕 Ingredients:\n${ingredientsText}`,
        '',
        `👣 Steps:\n${stepsText}`,
        '',
        '(Shared from Calocook)'
      ].join('\n');

      await Share.share({ message: message.trim() });
    } catch (e) {
      console.log('Share error:', e);
      Alert.alert('Error', 'Failed to share recipe');
    }
  };

  // Dòng 155-210: SỬA handleCookingComplete
  // Tìm và THAY THẾ handleCookingComplete
  const handleCookingComplete = async () => {
    try {
      const historyResult = await dispatch(
        addEatingHistory({
          userId: user._id,
          dishId: dishId
        })
      ).unwrap();

      const today = new Date();
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
      const todayString = localDate.toISOString().split('T')[0];

      setTimeout(async () => {
        await dispatch(
          getTotalCalories({
            userId: user._id,
            date: todayString
          })
        );
      }, 1000);

      setIsCookingModalVisible(false);

      let achievementResult = null;
      let pointsEarned = 0;

      try {
        achievementResult = await dispatch(
          addAchievementPoints({
            userId: user._id,
            difficulty: dishData.difficulty
          })
        ).unwrap();

        pointsEarned = achievementResult?.pointsEarned || 0;

        // ✅ SỬA: Check level up
        if (achievementResult?.levelChanged && achievementResult?.newLevel !== 'none') {
          const levelToSet = achievementResult.newLevel;
          const pointsToSet = achievementResult.totalPoints || 0;

          // ✅ THÊM: Set states với delay nhỏ để đảm bảo sync
          setNewLevel(levelToSet);
          setNewPoints(pointsToSet);

          // ✅ QUAN TRỌNG: Dùng setTimeout để đảm bảo states được update trước khi show modal
          setTimeout(() => {
            setShowMedalModal(true);
          }, 100); // Delay 100ms để đảm bảo states được update

          return; // Không show alert thông thường
        } else {
        }
      } catch (achievementError) {
        console.error('❌ Achievement error:', achievementError);
      }

      // Alert thông thường (khi không level up)
      const calorieInfo = `${dishData.calorie || dishData.calories} Kcal`;
      const difficultyLevel = capitalizeText(dishData.difficulty);

      let pointsMessage = '';
      if (pointsEarned > 0) {
        const emoji =
          dishData.difficulty?.toLowerCase() === 'easy'
            ? '😊'
            : dishData.difficulty?.toLowerCase() === 'medium'
            ? '🔥'
            : '⚡';
        pointsMessage = `\n\n${emoji} +${pointsEarned} Points Earned!\n(${difficultyLevel} Difficulty)`;
      }

      Alert.alert('Success!', `Added "${dishData.name}" (${calorieInfo}) to your eating history!${pointsMessage}`, [
        {
          text: 'View Profile',
          onPress: () => {
            navigation.navigate('MainTabs', {
              screen: 'Profile'
            });
          }
        },
        {
          text: 'OK',
          style: 'default'
        }
      ]);
    } catch (error) {
      console.error('❌ Cooking complete error:', error);
      Alert.alert('Error', error.message || 'Failed to add to eating history');
    }
  };
  // Sử dụng data từ API
  const dishData = dishDetail || dish;
  const ingredients = dishIngredients || [];
  const steps = dishSteps || [];

  const getImageSource = () => {
    // Ưu tiên imageUrl từ dishData (API response)
    const imageUrl = dishData.imageUrl || dish.imageUrl || dish.image;

    if (imageUrl?.startsWith('http')) {
      return { uri: imageUrl };
    } else if (imageUrl && imageMap[imageUrl]) {
      return imageMap[imageUrl];
    } else {
      return require('../assets/img/testImage.png');
    }
  };

  // Loading state
  if (isLoadingDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronLeft size={24} color={colors.title} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={styles.loadingText}>Loading dish details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ChevronLeft size={24} color={colors.title} />
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleShareIngredient}>
            <Share2 style={styles.shareButton} size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartButton} onPress={handleHeartPress}>
            <Heart size={28} color={colors.red} fill={isLiked ? colors.red : 'none'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dish Image - Sử dụng logic xử lý image giống Card */}
        <View style={styles.imageContainer}>
          <Image source={getImageSource()} style={styles.dishImage} />
        </View>

        {/* Dish Info */}
        <View style={styles.content}>
          <Text style={styles.dishName}>{dishData.name}</Text>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.description} />
              <Text style={styles.metaText}>{dishData.cookingTime || dishData.time} Min</Text>
            </View>

            <View style={styles.metaItem}>
              <Flame size={16} color={colors.description} />
              <Text style={styles.metaText}>{dishData.calorie || dishData.calories} Kcal</Text>
            </View>

            <View style={styles.metaItem}>
              <ChefHat size={16} color={colors.description} />
              <Text style={styles.metaText}>{capitalizeText(dishData.difficulty)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{dishData.description}</Text>
          </View>

          {/* Ingredients từ API */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.ingredientText}>
                    {ingredient.quantity && ingredient.unit
                      ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                      : ingredient.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No ingredients available</Text>
            )}
          </View>

          {/* Steps từ API */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {steps.length > 0 ? (
              steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepNumber}>{step.stepNumber || index + 1}:</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                  {step.title && <Text style={styles.stepTitle}>{step.title}</Text>}
                  {step.duration && <Text style={styles.stepDuration}>{step.duration} Minutes</Text>}
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No steps available</Text>
            )}
          </View>
          {/* ✅ Rating Section with real data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>

            <View style={styles.ratingTop}>
              <View style={styles.averageRatingContainer}>
                <Text style={styles.ratingNumber}>{averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</Text>
              </View>

              <View style={styles.starsInfo}>
                <View style={styles.starsDisplay}>{renderStars(averageRating)}</View>
                <Text style={styles.ratingCount}>
                  {totalRatings} {totalRatings === 1 ? 'Rating' : 'Ratings'}
                </Text>
              </View>
            </View>

            <View style={styles.userRating}>{renderStars(userRating, true)}</View>
          </View>
        </View>

        {/* ✅ Reviews List - Show user's own rating first, then others */}
        <View style={styles.reviewsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsListContent}
          >
            {/* User's own rating first */}
            {userOwnRating && (
              <TouchableOpacity
                key={userOwnRating._id}
                style={[styles.reviewCard, styles.ownReviewCard]}
                onPress={() =>
                  handleReviewPress({
                    id: userOwnRating._id,
                    userName: userOwnRating.fullName || 'You',
                    rating: userOwnRating.star,
                    comment: userOwnRating.description,
                    date: formatDate(userOwnRating.createdAt)
                  })
                }
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{userOwnRating.fullName || 'You'}</Text>
                    <View style={styles.reviewStars}>{renderStars(userOwnRating.star)}</View>
                  </View>
                  <Text style={styles.reviewDate}>{formatDate(userOwnRating.createdAt)}</Text>
                </View>
                <Text style={styles.reviewComment} numberOfLines={1}>
                  {userOwnRating.description.split(' ').length > 30
                    ? userOwnRating.description.split(' ').slice(0, 30).join(' ') + '...'
                    : userOwnRating.description}
                </Text>
              </TouchableOpacity>
            )}

            {/* Other reviews - limit to 4 */}
            {otherReviews.slice(0, 4).map((review) => (
              <TouchableOpacity
                key={review._id}
                style={styles.reviewCard}
                onPress={() =>
                  handleReviewPress({
                    id: review._id,
                    userName: review.fullName,
                    rating: review.star,
                    comment: review.description,
                    date: formatDate(review.createdAt)
                  })
                }
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{review.fullName}</Text>
                    <View style={styles.reviewStars}>{renderStars(review.star)}</View>
                  </View>
                  <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                </View>
                <Text style={styles.reviewComment} numberOfLines={1}>
                  {review.description.split(' ').length > 30
                    ? review.description.split(' ').slice(0, 30).join(' ') + '...'
                    : review.description}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Empty state */}
            {!userOwnRating && otherReviews.length === 0 && (
              <View style={styles.emptyReviews}>
                <Text style={styles.emptyReviewsText}>No reviews yet. Be the first to rate!</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Report Button */}
        <View style={styles.reportButtonContainer}>
          <TouchableOpacity style={styles.reportButton} onPress={handleOpenReportModal}>
            <Text style={styles.reportButtonText}>Report this Dish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Let's Cook Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.cookButton} onPress={handleLetsCook}>
          <Text style={styles.cookButtonText}>Let's Cook</Text>
        </TouchableOpacity>
      </View>

      {/* Cooking Steps Modal */}
      <CookingStepsModal
        visible={isCookingModalVisible}
        onClose={() => setIsCookingModalVisible(false)}
        steps={steps}
        dishData={dishData}
        onComplete={handleCookingComplete}
      />
      <MedalAchievementModal
        visible={showMedalModal}
        onClose={() => {
          setShowMedalModal(false);
        }}
        level={newLevel}
        points={newPoints}
      />
      {/* Rating Modal */}
      <Modal
        visible={isRatingModalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={handleCloseRatingModal}
      >
        <View style={styles.ratingModalOverlay}>
          <View style={styles.ratingModalContent}>
            <View style={styles.ratingModalHeader}>
              <Text style={styles.ratingModalTitle}>RATE THIS DISH</Text>
              <TouchableOpacity onPress={handleCloseRatingModal}>
                <Text style={styles.ratingModalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingModalBody}>
              <Text style={styles.ratingModalLabel}>Tell us about your experience with this dish</Text>

              <TextInput
                style={styles.ratingTextarea}
                multiline
                numberOfLines={5}
                placeholder='Share your thoughts about the taste, preparation, or anything else...'
                placeholderTextColor={colors.description}
                value={ratingDescription}
                onChangeText={setRatingDescription}
                textAlignVertical='top'
              />

              <TouchableOpacity
                style={styles.submitRatingButton}
                onPress={handleSubmitRating}
                disabled={isLoadingRating}
              >
                {isLoadingRating ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text style={styles.submitRatingButtonText}>Submit Rating</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Detail Modal */}
      <Modal
        visible={isReviewDetailModalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setIsReviewDetailModalVisible(false)}
      >
        <View style={styles.ratingModalOverlay}>
          <View style={styles.ratingModalContent}>
            <View style={styles.ratingModalHeader}>
              <Text style={styles.ratingModalTitle}>REVIEW DETAILS</Text>
              <TouchableOpacity onPress={() => setIsReviewDetailModalVisible(false)}>
                <Text style={styles.ratingModalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>

            {selectedReview && (
              <View style={styles.ratingModalBody}>
                <View style={styles.reviewDetailHeader}>
                  <Text style={styles.reviewDetailName}>{selectedReview.userName}</Text>
                  <Text style={styles.reviewDetailDate}>{selectedReview.date}</Text>
                </View>

                <View style={styles.reviewDetailStars}>{renderStars(selectedReview.rating)}</View>

                <View style={styles.reviewDetailCommentBox}>
                  <Text style={styles.reviewDetailComment}>{selectedReview.comment}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={handleCloseReportModal}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleCloseReportModal}>
            <View style={styles.modalContentWrapper}>
              <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={styles.modalContent}>
                {/* Title and Close */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>Report</Text>
                    <Text style={styles.modalSubtitle}>Help us improve by reporting issues</Text>
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={handleCloseReportModal}>
                    <Text style={styles.modalCloseButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Input Section */}
                <View style={styles.inputSection}>
                  <View style={styles.textInputWrapper}>
                    <TextInput
                      style={styles.reportTextInput}
                      multiline
                      numberOfLines={6}
                      placeholder="Tell us what's wrong with this dish..."
                      placeholderTextColor='#999'
                      value={reportReason}
                      onChangeText={setReportReason}
                      textAlignVertical='top'
                    />
                    <Text style={styles.charCount}>{reportReason.length}/10 minimum</Text>
                  </View>

                  {reportError ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorIcon}>⚠</Text>
                      <Text style={styles.errorText}>{reportError}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCloseReportModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitReportButton} onPress={handleSubmitReport}>
                    <Text style={styles.submitReportButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.background
    },
    backButton: {
      padding: 8
    },
    actionsContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15
    },
    heartButton: {
      padding: 8
    },
    shareButton: {
      alignSelf: 'flex-end',
      marginLeft: 'auto'
    },
    scrollView: {
      flex: 1
    },
    imageContainer: {
      paddingHorizontal: 40,
      marginBottom: 20
    },
    dishImage: {
      width: '100%',
      height: 320,
      borderRadius: 16,
      resizeMode: 'cover'
    },
    content: {
      paddingHorizontal: 40,
      paddingBottom: 100
    },
    dishName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.title,
      textAlign: 'center',
      marginBottom: 16,
      letterSpacing: 0.5
    },
    metaContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      gap: 20
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    metaText: {
      fontSize: 14,
      color: colors.title,
      fontWeight: '500'
    },
    section: {
      marginBottom: 24
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.secondary,
      marginBottom: 12
    },
    description: {
      fontSize: 14,
      color: colors.description,
      lineHeight: 22,
      textAlign: 'justify'
    },
    ingredientItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
      paddingRight: 10
    },
    bullet: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 8,
      marginTop: 1
    },
    ingredientText: {
      fontSize: 14,
      color: colors.description,
      lineHeight: 20,
      flex: 1
    },
    stepContainer: {
      marginBottom: 16
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 4
    },
    stepDescription: {
      fontSize: 14,
      color: colors.description,
      lineHeight: 20,
      flex: 1
    },
    stepNumber: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.title,
      marginRight: 8,
      minWidth: 16,
      lineHeight: 20,
      textAlignVertical: 'center'
    },
    stepTitle: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      marginLeft: 33,
      marginBottom: 4
    },
    stepText: {
      fontSize: 14,
      color: colors.description,
      lineHeight: 20,
      paddingLeft: 8,
      paddingRight: 10
    },
    stepDuration: {
      fontSize: 12,
      color: colors.primary,
      marginTop: 4,
      fontWeight: '500',
      paddingLeft: 8
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingVertical: 20,
      paddingBottom: 34
    },
    cookButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.secondary || '#00B894',
      borderRadius: 12,
      paddingVertical: 16,
      gap: 8
    },
    cookButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff'
    },
    reportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#DC2E60',
      borderRadius: 12,
      paddingVertical: 14,
      gap: 8
    },
    reportButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#DC2E60'
    },
    reportButtonContainer: {
      marginTop: 32,
      marginBottom: 20,
      paddingHorizontal: 20
    },
    scrollViewContent: {
      paddingBottom: 120
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
      opacity: 0.7
    },
    noDataText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
      opacity: 0.7
    },
    // Report Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
      padding: 0
    },
    modalContentWrapper: {
      width: '100%',
      paddingBottom: Platform.OS === 'ios' ? 34 : 0
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 12,
      paddingBottom: 24,
      paddingHorizontal: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 20
    },
    modalIconContainer: {
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 8
    },
    modalIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#FFF3CD',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalIconText: {
      fontSize: 32
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
      marginTop: 9
    },
    modalTitleContainer: {
      flex: 1,
      paddingRight: 12
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 4
    },
    modalSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
      marginTop: 7
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalCloseButton: {
      fontSize: 24,
      color: '#6B7280',
      fontWeight: '400'
    },
    inputSection: {
      marginBottom: 20
    },
    modalLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 12
    },
    textInputWrapper: {
      position: 'relative'
    },
    reportTextInput: {
      borderWidth: 2,
      borderColor: '#E5E7EB',
      borderRadius: 16,
      padding: 16,
      fontSize: 15,
      color: '#111827',
      backgroundColor: '#F9FAFB',
      minHeight: 120,
      textAlignVertical: 'top'
    },
    charCount: {
      position: 'absolute',
      bottom: 12,
      right: 16,
      fontSize: 12,
      color: '#6B7280',
      backgroundColor: '#F9FAFB',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      padding: 12,
      backgroundColor: '#FEE2E2',
      borderRadius: 12,
      gap: 8
    },
    errorIcon: {
      fontSize: 16
    },
    errorText: {
      flex: 1,
      color: '#DC2626',
      fontSize: 13,
      fontWeight: '500'
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12
    },
    cancelButton: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#E5E7EB'
    },
    cancelButtonText: {
      color: '#374151',
      fontSize: 16,
      fontWeight: '600'
    },
    submitReportButton: {
      flex: 1,
      backgroundColor: '#DC2E60',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#DC2E60',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6
    },
    submitReportButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold'
    },

    // Rating Section Styles
    ratingTop: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 16,
      marginBottom: 16
    },
    averageRatingContainer: {
      justifyContent: 'center'
    },
    ratingNumber: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.title,
      lineHeight: 48
    },
    starsInfo: {
      flexDirection: 'column',
      gap: 8
    },
    starsDisplay: {
      flexDirection: 'row',
      gap: 4
    },
    ratingCount: {
      fontSize: 14,
      color: colors.description
    },
    userRating: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8
    },

    // Reviews Section Styles
    reviewsSection: {
      marginTop: 24,
      marginBottom: 16
    },
    reviewsListContent: {
      paddingHorizontal: 16,
      gap: 16
    },
    reviewCard: {
      width: 280,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      borderRadius: 12,
      padding: 16,
      gap: 12
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    },
    reviewInfo: {
      flex: 1,
      gap: 6
    },
    reviewName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.title
    },
    reviewStars: {
      flexDirection: 'row',
      gap: 4
    },
    reviewDate: {
      fontSize: 12,
      color: colors.description
    },
    reviewComment: {
      fontSize: 14,
      color: colors.description,
      lineHeight: 20
    },

    // Review Detail Modal Styles
    reviewDetailContent: {
      padding: 24,
      gap: 16
    },
    reviewDetailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
      borderBottomColor: colors.inputBorder
    },
    reviewDetailName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.title
    },
    reviewDetailDate: {
      fontSize: 14,
      color: colors.description
    },
    reviewDetailStars: {
      flexDirection: 'row',
      gap: 6
    },
    reviewDetailComment: {
      fontSize: 16,
      color: colors.description,
      lineHeight: 24,
      backgroundColor: colors.backgroundSubside,
      borderRadius: 8,
      minHeight: 100
    },

    // Rating Modal Specific Styles
    ratingModalLabel: {
      fontSize: 14,
      color: colors.description,
      marginBottom: 16
    },
    ratingTextarea: {
      borderWidth: 2,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.title,
      backgroundColor: colors.inputBg,
      minHeight: 120,
      marginBottom: 12
    },
    ratingError: {
      color: colors.red,
      fontSize: 12,
      marginBottom: 12
    },
    submitRatingButton: {
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8
    },
    submitRatingButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600'
    },

    //Modal
    ratingModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 150
    },
    ratingModalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 20
    },
    ratingModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB'
    },
    ratingModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.title
    },
    ratingModalCloseButton: {
      fontSize: 28,
      color: '#6B7280',
      fontWeight: '300'
    },
    ratingModalBody: {
      padding: 20
    },
    ratingModalLabel: {
      fontSize: 14,
      color: colors.description,
      marginBottom: 16
    },
    reviewDetailCommentBox: {
      marginTop: 16
    },

    emptyReviews: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      minWidth: 280
    },
    emptyReviewsText: {
      fontSize: 14,
      color: colors.description,
      textAlign: 'center',
      fontStyle: 'italic'
    }
  });
