import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Image, StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

import { ChefHat, Clock, Flame } from 'lucide-react-native';

import { useTheme } from '@contexts/ThemeProvider';
import Choice from '@components/Choice';

function RandomCard({ dishes, currentIndex, onCardChange }, ref) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Swipe
  const swipe = useRef(new Animated.ValueXY()).current;
  const swipeOnHeight = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },

    // Reset animation values when start new gesture
    onPanResponderGrant: () => {
      swipe.setOffset({
        x: swipe.x._value,
        y: swipe.y._value
      });
      swipe.setValue({ x: 0, y: 0 });
    },

    onPanResponderMove: (_, { dx, dy, y0 }) => {
      swipe.setValue({ x: dx, y: dy });
      /* y0 là điểm chạm(300 là nhắm chừng...)
        - chạm trên lắc dưới 
        - chạm dưới lắc trên 
    */
      swipeOnHeight.setValue(y0 > 300 ? 1 : -1);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      // Flatten offset để tránh accumulated values(nó tích luỹ)
      swipe.flattenOffset();

      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 100;

      /*
        IF: (set favorite + remove top)
        ELSE: Return back to position
      */
      if (isActionActive) {
        Animated.timing(swipe, {
          duration: 200,
          toValue: {
            x: direction * 500,
            y: dy
          },
          useNativeDriver: true
        }).start(removeTopCard);
      } else {
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0
          },
          useNativeDriver: true,
          friction: 5
        }).start();
      }
    }
  });

  const removeTopCard = useCallback(() => {
    swipe.setValue({ x: 0, y: 0 });
    const newIndex = currentIndex + 1;
    onCardChange(newIndex);
  }, [currentIndex, onCardChange, swipe]);

  // Method to animate swipe programmatically (for buttons)
  const animateSwipe = useCallback(
    (direction) => {
      const toValue = direction === 'right' ? 500 : -500;

      Animated.timing(swipe, {
        duration: 300,
        toValue: {
          x: toValue,
          y: 0
        },
        useNativeDriver: true
      }).start(removeTopCard);
    },
    [removeTopCard, swipe]
  );

  // Expose animateSwipe method to parent component
  useImperativeHandle(ref, () => ({
    animateSwipe
  }));

  // Get 3 card
  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = 0; i < Math.min(3, dishes.length - currentIndex); i++) {
      const cardIndex = currentIndex + i;
      if (cardIndex < dishes.length) {
        visibleCards.push({
          ...dishes[cardIndex],
          stackIndex: i
        });
      }
    }
    return visibleCards;
  };

  const visibleCards = getVisibleCards();
  // If no cards left, show empty state
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
        // Get card
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

        //Animate Card
        const dragHandlers = isTopCard ? panResponder.panHandlers : {};

        //Rotate(when drag)
        const rotate = Animated.multiply(swipe.x, swipeOnHeight).interpolate({
          inputRange: [-100, 0, 100],
          outputRange: ['8deg', '0deg', '-8deg']
        });

        /*Choice(when drag)
            left: x < 0
            right: x > 0
            from: -5px -> -100px  ~ 0 -> 1
        */
        const likeOpacity = swipe.x.interpolate({
          inputRange: [-100, -10], // x
          outputRange: [1, 0],
          extrapolate: 'clamp'
        });

        const nopeOpacity = swipe.x.interpolate({
          inputRange: [10, 100], // x
          outputRange: [0, 1],
          extrapolate: 'clamp'
        });

        const animatedCardStyle = {
          transform: [...swipe.getTranslateTransform(), { rotate }]
        };

        return (
          <Animated.View
            key={`${item._id}`}
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
              source={item.imageUrl ? require('@assets/img/default-img.png') : { uri: imageUrl }}
              style={styles.image}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{item.name}</Text>

              <View style={styles.info}>
                <View style={styles.infoItem}>
                  <Clock size={15} color={colors.description + '80'} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.cookingTime}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Flame size={15} color={colors.description + '80'} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.calorie}</Text>
                </View>

                <View style={styles.infoItem}>
                  <ChefHat size={15} color={colors.description + '80'} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.description}>{item.description}</Text>
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
      transform: [{ rotate: '3deg' }],
      opacity: 0.8
    },
    thirdCard: {
      zIndex: 1,
      transform: [{ rotate: '5deg' }],
      opacity: 0.6
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
    title: {
      color: colors.title,
      fontSize: 20,
      fontWeight: 700
    },

    content: {
      alignItems: 'center',
      marginVertical: 15
    },

    info: {
      marginVertical: 15,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    infoIcon: {
      marginEnd: 5
    },
    infoText: {
      color: colors.title,
      fontSize: 15
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 15,
      color: colors.title,
      fontSize: 15
    },
    description: {
      color: colors.description
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
