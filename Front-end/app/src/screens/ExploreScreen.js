import React, { useCallback, useRef, useState } from 'react';

import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeProvider';
import { Heart, RefreshCw, X } from 'lucide-react-native';

import RandomCard from '@components/RandomCard';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [dishes, setDishes] = useState([
    {
      id: 1,
      title: 'CHICKEN WITH EGG',
      image: require('../assets/img/testImage.png'),
      time: '10 min',
      calories: '220 kcal',
      difficulty: 'Easy',
      ingredients: 'Egg, chicken, tomatoes, salad +1'
    },
    {
      id: 2,
      title: 'SALMON SALAD',
      image: require('../assets/img/testImage.png'),
      time: '15 min',
      calories: '300 kcal',
      difficulty: 'Medium',
      ingredients: 'Salmon, lettuce, cucumber +2'
    },
    {
      id: 3,
      title: 'BEEF STEAK',
      image: require('../assets/img/testImage.png'),
      time: '20 min',
      calories: '450 kcal',
      difficulty: 'Hard',
      ingredients: 'Beef, potato, vegetables +3'
    },
    {
      id: 4,
      title: 'BEEF STEAK',
      image: require('../assets/img/testImage.png'),
      time: '20 min',
      calories: '450 kcal',
      difficulty: 'Hard',
      ingredients: 'Beef, potato, vegetables +3'
    },
    {
      id: 5,
      title: 'BEEF STEAK',
      image: require('../assets/img/testImage.png'),
      time: '20 min',
      calories: '450 kcal',
      difficulty: 'Hard',
      ingredients: 'Beef, potato, vegetables +3'
    },
    {
      id: 6,
      title: 'BEEF STEAK',
      image: require('../assets/img/testImage.png'),
      time: '20 min',
      calories: '450 kcal',
      difficulty: 'Hard',
      ingredients: 'Beef, potato, vegetables +3'
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef(null);

  // Animation for action
  const animationRefs = useRef({
    heart: new Animated.Value(1),
    refresh: new Animated.Value(1),
    x: new Animated.Value(1)
  }).current;

  const animateScale = useCallback((scale, newValue) => {
    Animated.spring(scale, {
      toValue: newValue,
      friction: 4,
      useNativeDriver: true
    }).start();
  }, []);

  // Action
  const handleLike = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.animateSwipe('right');
    }
  }, []);

  const handleNope = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.animateSwipe('left');
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const handleCardChange = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.dishList}>
        <RandomCard ref={cardRef} dishes={dishes} currentIndex={currentIndex} onCardChange={handleCardChange} />
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
      paddingVertical: 25,
      paddingHorizontal: 20,
      backgroundColor: colors.background
    },
    header: {
      marginBottom: 15
    },
    title: {
      color: colors.title,
      fontSize: 35,
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
