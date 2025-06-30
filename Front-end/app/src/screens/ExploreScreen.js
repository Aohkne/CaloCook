import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, RefreshCw, X } from 'lucide-react-native';

import { useTheme } from '@contexts/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';

import RandomCard from '@components/RandomCard';
import { randomDishes, resetDishes } from '@/redux/slices/dishSlice';
import { likeDish, toggleFavoriteLocal } from '@/redux/slices/favoriteSlice';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const { dishes, isLoading, error } = useSelector((state) => state.dish);

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef(null);

  // Animation for action
  const animationRefs = useRef({
    heart: new Animated.Value(1),
    refresh: new Animated.Value(1),
    x: new Animated.Value(1)
  }).current;

  useLayoutEffect(() => {
    if (user?._id) {
      // API
      dispatch(randomDishes({ userId: user._id, limit: 10 }));
    }
  }, [dispatch, user?._id]);

  const animateScale = useCallback((scale, newValue) => {
    Animated.spring(scale, {
      toValue: newValue,
      friction: 4,
      useNativeDriver: true
    }).start();
  }, []);

  // LIKE API
  const onLike = useCallback(async () => {
    if (!user?._id || currentIndex >= dishes.length) return;

    const currentDish = dishes[currentIndex];
    if (!currentDish) return;

    try {
      //Optimistic update
      dispatch(
        toggleFavoriteLocal({
          dishId: currentDish._id,
          isLiked: true,
          dishData: currentDish
        })
      );

      //API
      const resultAction = await dispatch(
        likeDish({
          userId: user._id,
          dishId: currentDish._id
        })
      );

      //Handle API response
      if (likeDish.fulfilled.match(resultAction)) {
        console.log('Dish liked successfully');
      } else {
        dispatch(
          toggleFavoriteLocal({
            dishId: currentDish._id,
            isLiked: false
          })
        );
        console.error('Failed to like dish:', resultAction.payload);
      }
    } catch (error) {
      // Revert optimistic
      dispatch(
        toggleFavoriteLocal({
          dishId: currentDish._id,
          isLiked: false
        })
      );
    }
  }, [dispatch, user?._id, currentIndex, dishes]);

  // ACTION

  const handleLike = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.animateSwipe('left');
    }
  }, []);

  const handleNope = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.animateSwipe('right');
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setCurrentIndex(0);
    dispatch(resetDishes());
    if (user?._id) {
      // API
      dispatch(randomDishes({ userId: user._id, limit: 10 }));
    }
  }, [dispatch, user?._id]);

  const handleCardChange = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.dishList}>
        <RandomCard
          ref={cardRef}
          dishes={dishes}
          currentIndex={currentIndex}
          onCardChange={handleCardChange}
          onLike={onLike}
        />
      </View>

      <View style={styles.action}>
        <TouchableWithoutFeedback
          onPress={handleLike}
          onPressIn={() => animateScale(animationRefs.heart, 0.8)}
          delayPressIn={0}
          onPressOut={() => animateScale(animationRefs.heart, 1)}
          delayPressOut={110}
        >
          <Animated.View style={[styles.btn, { transform: [{ scale: animationRefs.heart }] }]}>
            <Heart size={25} color={colors.primary} strokeWidth={2.5} />
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={handleRefresh}
          onPressIn={() => animateScale(animationRefs.refresh, 0.8)}
          delayPressIn={0}
          onPressOut={() => animateScale(animationRefs.refresh, 1)}
          delayPressOut={110}
        >
          <Animated.View style={[styles.btn, { transform: [{ scale: animationRefs.refresh }] }]}>
            <RefreshCw size={25} color={colors.yellow} strokeWidth={2.5} />
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={handleNope}
          onPressIn={() => animateScale(animationRefs.x, 0.8)}
          delayPressIn={0}
          onPressOut={() => animateScale(animationRefs.x, 1)}
          delayPressOut={110}
        >
          <Animated.View style={[styles.btn, { transform: [{ scale: animationRefs.x }] }]}>
            <X size={30} color={colors.red} strokeWidth={2.5} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.background
    },
    header: {
      marginBottom: 15
    },
    title: {
      color: colors.title,
      fontSize: 32,
      letterSpacing: 3,
      fontWeight: 700
    },

    dishList: {
      flex: 1,
      marginVertical: 15
    },

    action: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    btn: {
      height: 50,
      width: 50,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: colors.white
    }
  });
