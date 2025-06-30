import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Image, StyleSheet, Text, View, Animated, PanResponder, Dimensions } from 'react-native';

import { ChefHat, Clock, Flame } from 'lucide-react-native';

import { useTheme } from '@contexts/ThemeProvider';
import { imageMap } from '@/constants/imageAssets';
import Choice from '@components/Choice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function RandomCard({ dishes, currentIndex, onCardChange, onLike }, ref) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Swipe animations
  const swipe = useRef(new Animated.ValueXY()).current;
  const swipeOnHeight = useRef(new Animated.Value(1)).current;

  const [isAnimating, setIsAnimating] = useState(false);

  // Reset animation values when currentIndex changes
  useEffect(() => {
    swipe.setValue({ x: 0, y: 0 });
    swipeOnHeight.setValue(1);
    setIsAnimating(false);
  }, [currentIndex, swipe, swipeOnHeight]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (isAnimating) return false;
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },

    onPanResponderGrant: () => {
      if (!isAnimating) {
        swipe.setOffset({
          x: swipe.x._value,
          y: swipe.y._value
        });
        swipe.setValue({ x: 0, y: 0 });
      }
    },

    onPanResponderMove: (_, { dx, dy, y0 }) => {
      if (!isAnimating) {
        swipe.setValue({ x: dx, y: dy });
        const touchThreshold = screenHeight * 0.4; // 40% of screen height
        swipeOnHeight.setValue(y0 > touchThreshold ? 1 : -1);
      }
    },

    onPanResponderRelease: (_, { dx, dy }) => {
      if (isAnimating) return;

      swipe.flattenOffset();

      const direction = Math.sign(dx);
      const swipeThreshold = screenWidth * 0.25; // 25% of screen width
      const isActionActive = Math.abs(dx) > swipeThreshold;

      if (isActionActive) {
        setIsAnimating(true);

        if (direction < 0) {
          onLike && onLike();
        }

        // Animate card out
        Animated.timing(swipe, {
          duration: 250,
          toValue: {
            x: direction * screenWidth * 1.5,
            y: dy
          },
          useNativeDriver: true
        }).start(() => {
          removeTopCard();
        });
      } else {
        // Spring back to center
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 6,
          tension: 100
        }).start();
      }
    }
  });

  const removeTopCard = useCallback(() => {
    swipe.setValue({ x: 0, y: 0 });
    swipeOnHeight.setValue(1);
    setIsAnimating(false);

    const newIndex = currentIndex + 1;
    onCardChange(newIndex);
  }, [currentIndex, onCardChange, swipe, swipeOnHeight]);

  const animateSwipe = useCallback(
    (direction) => {
      if (isAnimating) return;

      setIsAnimating(true);
      const toValue = direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5;

      if (direction === 'left') {
        onLike && onLike();
      }

      Animated.timing(swipe, {
        duration: 300,
        toValue: {
          x: toValue,
          y: 0
        },
        useNativeDriver: true
      }).start(() => {
        removeTopCard();
      });
    },
    [removeTopCard, swipe, onLike, isAnimating]
  );

  useImperativeHandle(ref, () => ({
    animateSwipe
  }));

  // Get visible cards (maximum 3)
  const getVisibleCards = () => {
    const visibleCards = [];
    const maxCards = Math.min(3, dishes.length - currentIndex);

    for (let i = 0; i < maxCards; i++) {
      const cardIndex = currentIndex + i;
      if (cardIndex < dishes.length && dishes[cardIndex]) {
        visibleCards.push({
          ...dishes[cardIndex],
          stackIndex: i,
          uniqueKey: `${dishes[cardIndex]._id}_${cardIndex}`
        });
      }
    }
    return visibleCards;
  };

  const visibleCards = getVisibleCards();

  if (visibleCards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more dishes!</Text>
      </View>
    );
  }

  return (
    <View style={styles.stackContainer}>
      {visibleCards.map((item, index) => {
        const stackIndex = item.stackIndex;
        const isTopCard = stackIndex === 0;

        const getCardStyle = (stackIndex) => {
          const baseStyle = [styles.container];

          switch (stackIndex) {
            case 0:
              return [...baseStyle, styles.topCard];
            case 1:
              return [...baseStyle, styles.secondCard];
            case 2:
              return [...baseStyle, styles.thirdCard];
            default:
              return [...baseStyle, styles.hiddenCard];
          }
        };

        const dragHandlers = isTopCard ? panResponder.panHandlers : {};

        // Animation styles for top card only
        let animatedCardStyle = {};
        let likeOpacity = new Animated.Value(0);
        let nopeOpacity = new Animated.Value(0);

        if (isTopCard) {
          // Rotation animation
          const rotate = Animated.multiply(swipe.x, swipeOnHeight).interpolate({
            inputRange: [-100, 0, 100],
            outputRange: ['8deg', '0deg', '-8deg'],
            extrapolate: 'clamp'
          });

          // Choice opacity animations
          likeOpacity = swipe.x.interpolate({
            inputRange: [-120, -50],
            outputRange: [1, 0],
            extrapolate: 'clamp'
          });

          nopeOpacity = swipe.x.interpolate({
            inputRange: [50, 120],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          });

          animatedCardStyle = {
            transform: [...swipe.getTranslateTransform(), { rotate }]
          };
        }

        return (
          <Animated.View
            key={item.uniqueKey}
            style={[getCardStyle(stackIndex), isTopCard && animatedCardStyle]}
            {...dragHandlers}
          >
            {isTopCard && (
              <>
                <Animated.View style={[styles.choiceContainer, styles.likeContainer, { opacity: likeOpacity }]}>
                  <Choice type='like' />
                </Animated.View>

                <Animated.View style={[styles.choiceContainer, styles.nopeContainer, { opacity: nopeOpacity }]}>
                  <Choice type='nope' />
                </Animated.View>
              </>
            )}

            <Image
              source={
                item.imageUrl?.startsWith('http')
                  ? { uri: item.imageUrl }
                  : imageMap[item.imageUrl] || require('@assets/img/default-img.png')
              }
              style={styles.image}
              resizeMode='cover'
            />

            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={styles.info}>
                <View style={styles.infoItem}>
                  <Clock size={15} color={colors.description + '80'} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.cookingTime} min</Text>
                </View>

                <View style={styles.infoItem}>
                  <Flame size={15} color={colors.description + '80'} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.calorie} kcal</Text>
                </View>

                <View style={styles.infoItem}>
                  <ChefHat size={15} color={colors.description + '80'} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    stackContainer: {
      position: 'relative'
    },

    container: {
      position: 'absolute',
      left: 20,
      width: '90%',
      paddingVertical: 15,
      paddingHorizontal: 22,
      borderRadius: 20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: colors.white
    },

    topCard: {
      zIndex: 3,
      transform: [{ rotate: '0deg' }],
      opacity: 1
    },
    secondCard: {
      zIndex: 2,
      transform: [{ rotate: '3deg' }]
    },
    thirdCard: {
      zIndex: 1,
      transform: [{ rotate: '5deg' }]
    },

    hiddenCard: {
      zIndex: 0,
      transform: [{ scale: 0.8 }],
      opacity: 0
    },

    choiceContainer: {
      position: 'absolute',
      top: 50,
      zIndex: 4
    },
    likeContainer: {
      right: 30,
      transform: [{ rotate: '35deg' }]
    },
    nopeContainer: {
      left: 30,
      transform: [{ rotate: '-30deg' }]
    },

    image: {
      width: '100%',
      height: 300,
      borderRadius: 10,
      resizeMode: 'cover'
    },

    content: {
      alignItems: 'center',
      marginVertical: 15
    },

    title: {
      color: colors.title,
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 10
    },

    info: {
      marginVertical: 15,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },

    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 15,
      color: colors.title,
      marginHorizontal: 15
    },

    infoIcon: {
      marginEnd: 5
    },

    infoText: {
      fontSize: 15,
      color: colors.title,
      textTransform: 'capitalize'
    },

    description: {
      color: colors.description,
      textAlign: 'center'
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },

    emptyText: {
      color: colors.title,
      fontSize: 18,
      fontWeight: 600
    }
  });

export default forwardRef(RandomCard);
