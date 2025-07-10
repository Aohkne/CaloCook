import React, { useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { Search } from 'lucide-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDishes, loadMoreDishes, resetDishes, clearError, updateDishLikeStatus, syncDishesWithFavorites } from '@redux/slices/dishSlice'
import { likeDish, dislikeDish, updateFavoriteItem, getFavorites } from '@redux/slices/favoriteSlice'
import DishCard from '../components/Card'

export default function DishScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const dispatch = useDispatch()

  // Get state from Redux
  const {
    dishes,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    currentPage
  } = useSelector(state => state.dish)

  // Get user and favorites from auth/favorite state
  const { user } = useSelector(state => state.auth)
  const { favorites } = useSelector(state => state.favorite)

  // Helper function để capitalize text
  const capitalizeText = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Fetch initial dishes and favorites
  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        // Fetch dishes with user context
        await dispatch(getAllDishes({ page: 1, limit: 10, userId: user._id }))
        // Fetch user's favorites
        await dispatch(getFavorites({ userId: user._id, page: 1, limit: 100 }))
      } else {
        // Fetch dishes without user context
        await dispatch(getAllDishes({ page: 1, limit: 10 }))
      }
    }

    fetchData()
  }, [dispatch, user])

  // Sync dishes with favorites when favorites data changes
  useEffect(() => {
    if (favorites.length > 0 && dishes.length > 0) {
      dispatch(syncDishesWithFavorites(favorites))
    }
  }, [dispatch, favorites, dishes.length])

  // Handle error display
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ])
    }
  }, [error, dispatch])

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    const refreshData = async () => {
      dispatch(resetDishes())
      if (user?._id) {
        await dispatch(getAllDishes({ page: 1, limit: 10, userId: user._id }))
        await dispatch(getFavorites({ userId: user._id, page: 1, limit: 100 }))
      } else {
        await dispatch(getAllDishes({ page: 1, limit: 10 }))
      }
    }

    refreshData()
  }, [dispatch, user])

  // Handle load more when scrolling
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      const nextPage = currentPage + 1
      dispatch(loadMoreDishes({
        page: nextPage,
        limit: 10,
        userId: user?._id
      }))
    }
  }, [hasMore, isLoadingMore, isLoading, currentPage, dispatch, user])

  // Handle heart press với API call và real-time update
  const handleHeartPress = useCallback(async (dishId) => {
    if (!user?._id) {
      Alert.alert('Error', 'Please login to add favorites')
      return
    }

    try {
      // Tìm dish hiện tại để check trạng thái like
      const currentDish = dishes.find(d => d._id === dishId)

      if (currentDish?.isLiked) {

        // Nếu đã like thì dislike
        const result = await dispatch(dislikeDish({
          userId: user._id,
          dishId: dishId
        })).unwrap()

        // Cập nhật local state trong dish slice
        dispatch(updateDishLikeStatus({ dishId, isLiked: false }))

      } else {

        // Nếu chưa like thì like
        const result = await dispatch(likeDish({
          userId: user._id,
          dishId: dishId
        })).unwrap()

        // Cập nhật local state trong dish slice
        dispatch(updateDishLikeStatus({ dishId, isLiked: true }))

        // Cập nhật favorites list ngay lập tức
        const newFavoriteItem = {
          _id: result._id || `temp_${dishId}_${Date.now()}`,
          dishId: dishId,
          dish: currentDish,
          createdAt: new Date().toISOString()
        }

        dispatch(updateFavoriteItem({
          dishId,
          favoriteData: newFavoriteItem,
          action: 'like'
        }))
      }

    } catch (error) {
      console.error('Error updating favorite status')
      Alert.alert('Error', error.message || 'Failed to update favorite')
    }
  }, [dispatch, user, dishes])

  // Handle card press - Navigate to Detail
  const handleCardPress = useCallback((dish) => {
    navigation.navigate('Detail', { dish })
  }, [navigation])

  // Handle scroll to detect when to load more
  const handleScroll = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const paddingToBottom = 20

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      handleLoadMore()
    }
  }, [handleLoadMore])

  // Loading state for initial load
  if (isLoading && dishes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dish</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('FilterScreen')}
            >
              <Search size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading dishes...</Text>
        </View>
      </View>
    )
  }

  // Empty state
  if (!isLoading && dishes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dish</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('FilterScreen')}
            >
              <Search size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No dishes found</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRefresh}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dish</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('FilterScreen')}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {dishes.map((dish) => (
          <DishCard
            key={dish._id || dish.id}
            dish={dish}
            onHeartPress={handleHeartPress}
            onCardPress={handleCardPress}
          />
        ))}

        {/* Load more indicator */}
        {isLoadingMore && (
          <View style={styles.loadMoreContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadMoreText}>Loading more...</Text>
          </View>
        )}

        {/* End of list indicator */}
        {!hasMore && dishes.length > 0 && (
          <View style={styles.endOfListContainer}>
            <Text style={styles.endOfListText}>No more dishes to load</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
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
      paddingTop: 50,
      paddingBottom: 20,
      backgroundColor: colors.background,
    },
    title: {
      color: colors.title,
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 1
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 15
    },
    iconButton: {
      padding: 8
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 20
    },
    scrollContent: {
      paddingTop: 0,
      paddingBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
      opacity: 0.7
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50
    },
    emptyText: {
      fontSize: 18,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 20
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8
    },
    retryButtonText: {
      color: colors.white || '#fff',
      fontSize: 16,
      fontWeight: '600'
    },
    loadMoreContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      gap: 10
    },
    loadMoreText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7
    },
    endOfListContainer: {
      alignItems: 'center',
      paddingVertical: 20
    },
    endOfListText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.5,
      fontStyle: 'italic'
    }
  })