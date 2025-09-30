import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@contexts/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';

import * as Animatable from 'react-native-animatable';

const { height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [index, setIndex] = React.useState(0);
  const { setOnboardingCompleted } = useAuth();
  const navigation = useNavigation();

  const content = [
    {
      images: require('../assets/onboarding2.jpg'),
      title: 'Welcome to CaloCook',
      subtitle: 'Your journey to healthy eating starts here'
    },
    {
      images: require('../assets/onboarding3.jpg'),
      title: 'Discover Recipes',
      subtitle: 'Explore a variety of nutritious and delicious recipes.'
    },
    {
      images: require('../assets/onboarding4.jpg'),
      title: 'Track Your Nutrition',
      subtitle: 'Easily log your meals and monitor your daily calorie.'
    }
  ];

  const handleGetStarted = () => {
    // advance to next slide; if last, navigate to Login
    if (index < content.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setOnboardingCompleted();
      navigation.navigate('Login');
    }
  };

  const current = content[index];

  return (
    <View style={styles.container}>
      {/* Top: white background with image */}
      <View style={styles.topContainer}>
        <Animatable.View animation='fadeInDown' duration={1200} key={index}>
          <Image source={current.images} style={styles.image} resizeMode='cover' />
        </Animatable.View>
      </View>

      {/* Bottom: solid color background with text + button */}
      <View style={styles.bottomContainer}>
        <Animatable.View animation='fadeInUp' delay={300} style={styles.content} key={`content-${index}`}>
          <Text style={styles.title}>
            {current.title.split(' ').slice(0, 2).join(' ')}{' '}
            <Text style={{ color: '#FFD369' }}>{current.title.split(' ').slice(2).join(' ')}</Text>
          </Text>

          <Animatable.Text animation='fadeInUp' delay={600} style={styles.subtitle}>
            {current.subtitle}
          </Animatable.Text>
        </Animatable.View>

        {/* Pagination dots showing current slide */}
        <View style={styles.dotsContainer} pointerEvents='none'>
          {content.map((_, i) => (
            <View key={`dot-${i}`} style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        <Animatable.View animation='bounceIn' delay={600}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>{index < content.length - 1 ? 'Continue' : 'Get Started'}</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white
    },
    topContainer: {
      height: height * 0.54, // nửa màn hình trên
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white
    },
    bottomContainer: {
      flex: 1,
      backgroundColor: colors.secondary,
      overflow: 'hidden',
      paddingVertical: 80,
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    image: {
      flex: 1,
      maxHeight: height * 0.54,
      maxWidth: '100%'
    },
    content: {
      alignItems: 'center'
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.white,
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: 1
    },

    subtitle: {
      fontSize: 16,
      color: colors.white,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 280,
      marginTop: 6
    },

    button: {
      backgroundColor: colors.white,
      borderRadius: 25,
      paddingVertical: 17,
      paddingHorizontal: 45,
      marginTop: 20,
      elevation: 4
    },
    buttonText: {
      color: colors.secondary,
      fontSize: 16,
      fontWeight: '700'
    },

    dotsContainer: {
      position: 'absolute',
      bottom: 150,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 20,
      marginHorizontal: 6
    },
    dotActive: {
      backgroundColor: colors.white,
      width: 10,
      height: 10
    },
    dotInactive: {
      backgroundColor: 'rgba(255, 255, 255, 0.35)'
    }
  });
