import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Animated, Dimensions, Text } from 'react-native';
import { MessageCircle, Focus, Plus } from 'lucide-react-native';

import { useTheme } from '@contexts/ThemeProvider';

const { width } = Dimensions.get('window');

export default function CenterNavigator({ onTabChange }) {
  const [showOptions, setShowOptions] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;
  const optionsScale = useRef(new Animated.Value(0)).current;

  // ANIMATION
  const handleCenterPress = () => {
    setShowOptions(!showOptions);

    // Animation Center
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    // Animation rotation
    Animated.timing(rotateAnim, {
      toValue: showOptions ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();

    // Animation options
    Animated.parallel([
      Animated.timing(optionsOpacity, {
        toValue: showOptions ? 0 : 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.spring(optionsScale, {
        toValue: showOptions ? 0 : 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  };

  //Select Menu
  const handleOptionSelect = (option) => {
    if (onTabChange) {
      onTabChange(option);
    }

    setShowOptions(!showOptions);

    // Reset animations
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(optionsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.spring(optionsScale, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  };

  // Close options menu, not change tab
  const handleOverlayPress = () => {
    setShowOptions(false);

    // Reset animations
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(optionsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.spring(optionsScale, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  return (
    <View style={styles.container}>
      {/* Main Center Button */}
      <TouchableWithoutFeedback onPress={handleCenterPress}>
        <Animated.View
          style={[
            styles.centerButton,
            {
              transform: [{ scale: scaleAnim }, { rotate: spin }]
            }
          ]}
        >
          <Plus size={30} color={colors.background} />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Options Menu */}
      {showOptions && (
        <Animated.View
          style={[
            styles.optionsContainer,
            {
              opacity: optionsOpacity,
              transform: [{ scale: optionsScale }]
            }
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              handleOptionSelect('Chat');
              handleCenterPress();
            }}
          >
            <Animated.View style={[styles.optionButton, styles.leftOption]}>
              <MessageCircle size={24} color={colors.titleWithBg} />
            </Animated.View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              handleOptionSelect('Nutrition');
              handleCenterPress();
            }}
          >
            <Animated.View style={[styles.optionButton, styles.rightOption]}>
              <Focus size={24} color={colors.titleWithBg} />
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Labels */}
          <View style={styles.labelsContainer}>
            <View style={[styles.label, styles.leftLabel]}>
              <Text style={styles.labelText}>Chat</Text>
            </View>
            <View style={[styles.label, styles.rightLabel]}>
              <Text style={styles.labelText}>Nutritional analysis</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Background overlay khi options mở */}
      {showOptions && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <Animated.View style={[styles.overlay, { opacity: optionsOpacity }]} />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 25,
      left: '50%',
      marginLeft: -30,
      alignItems: 'center',
      zIndex: 20
    },
    centerButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6
    },
    optionsContainer: {
      position: 'absolute',
      bottom: 100,
      alignItems: 'center',
      justifyContent: 'center',
      width: 150
    },
    optionButton: {
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      backgroundColor: colors.secondary
    },
    leftOption: {
      left: 0
    },
    rightOption: {
      right: 0
    },
    labelsContainer: {
      position: 'absolute',
      bottom: -25,
      width: 150
    },
    label: {
      position: 'absolute',
      width: 70,
      alignItems: 'center'
    },
    leftLabel: {
      left: -10
    },
    rightLabel: {
      right: -10
    },
    labelText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.title,
      textAlign: 'center'
    },
    overlay: {
      position: 'absolute',
      top: -1000,
      left: -width,
      width: width * 2,
      height: 2000,
      backgroundColor: colors.backgroundSide,
      zIndex: -1
    }
  });
