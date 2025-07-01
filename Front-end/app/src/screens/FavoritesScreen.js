
import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import { getFavorites, dislikeDish, clearError, updateFavoriteItem } from '@redux/slices/favoriteSlice'
import { updateDishLikeStatus } from '@redux/slices/dishSlice'
import DishCard from '../components/Card'

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const dispatch = useDispatch()

  // Get state from Redux
  const { favorites, isLoading, error, hasMore, pagination } = useSelector(state => state.favorite)
  const { user } = useSelector(state => state.auth)

  // Fetch favorites on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(getFavorites({
        userId: user._id,
        page: 1,
        limit: 10
      }))
    }
  }, [dispatch, user])

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
    if (user?._id) {
      dispatch(getFavorites({
        userId: user._id,
        page: 1,
        limit: 10
      }))
    }
  }, [dispatch, user])

  // Handle heart press - Remove from favorites với real-time update
  const handleHeartPress = useCallback(async (dishId) => {
    if (!user?._id) {
      Alert.alert('Error', 'Please login to manage favorites')
      return
    }

    try {
      // Tìm favorite item hiện tại
      const currentFavorite = favorites.find(fav => fav.dishId === dishId)

      if (currentFavorite) {
        await dispatch(dislikeDish({
          userId: user._id,
          dishId: dishId
        })).unwrap()

        // Cập nhật dish slice để sync trạng thái
        dispatch(updateDishLikeStatus({ dishId, isLiked: false }))

        // Cập nhật favorites list ngay lập tức (đã được handle trong dislikeDish.fulfilled)
        dispatch(updateFavoriteItem({
          dishId,
          favoriteData: null,
          action: 'dislike'
        }))
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      Alert.alert('Error', error.message || 'Failed to remove from favorites')
    }
  }, [dispatch, user, favorites])

  // Handle card press - Navigate to Detail
  const handleCardPress = useCallback((dish) => {
    navigation.navigate('Detail', { dish })
  }, [navigation])

  // Transform favorites data for DishCard component
  const transformedFavorites = favorites.map(favorite => ({
    _id: favorite.dishId,
    name: favorite.dish?.name || 'Unknown Dish',
    cookingTime: favorite.dish?.cookingTime || 0,
    calorie: favorite.dish?.calorie || 0,
    difficulty: favorite.dish?.difficulty || 'Unknown',
    description: favorite.dish?.description || '',
    imageUrl: favorite.dish?.imageUrl || '',
    isLiked: true // Always true in favorites screen
  }))

  // Loading state
  if (isLoading && favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </View>
    )
  }

  // Empty state
  if (!isLoading && favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite dishes yet</Text>
          <Text style={styles.emptySubText}>Start adding dishes to your favorites!</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Dish')}
          >
            <Text style={styles.browseButtonText}>Browse Dishes</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
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
      >
        {transformedFavorites.map((dish) => (
          <DishCard
            key={dish._id}
            dish={dish}
            onHeartPress={handleHeartPress}
            onCardPress={handleCardPress}
          />
        ))}
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
      paddingTop: 50,
      paddingHorizontal: 20
    },
    emptyText: {
      fontSize: 18,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 8,
      textAlign: 'center'
    },
    emptySubText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.5,
      marginBottom: 30,
      textAlign: 'center'
    },
    browseButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8
    },
    browseButtonText: {
      color: colors.white || '#fff',
      fontSize: 16,
      fontWeight: '600'
    }
  })