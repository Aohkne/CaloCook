import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { Trophy, Sparkles, X } from 'lucide-react-native';


const { width, height } = Dimensions.get('window');

export default function MedalAchievementModal({ visible, onClose, level, points }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getMedalImage = (level) => {
    const medals = {
      bronze: require('@/assets/level/bronze.png'),
      silver: require('@/assets/level/silver.png'),
      gold: require('@/assets/level/golden.png')
    };
    return medals[level];
  };

  const getLevelColor = (level) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700'
    };
    return colors[level] || '#FFD700';
  };

  const getLevelTitle = (level) => {
    const titles = {
      bronze: 'Bronze Chef',
      silver: 'Silver Chef',
      gold: 'Gold Chef'
    };
    return titles[level] || 'Chef';
  };

  // Dòng 51-95: THAY THẾ useEffect với version có debug
useEffect(() => {
    
    
    if (visible) {
        
        
        // Reset animations
        scaleAnim.setValue(0);
        rotateAnim.setValue(0);
        glowAnim.setValue(0);
        sparkleAnim.setValue(0);
        fadeAnim.setValue(0);

       

        // Start entrance animation
        Animated.sequence([
            // Fade in background
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }),
            // Medal entrance with rotation
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ]).start(() => {
            
            
            // Start continuous animations
            // Glow pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true
                    })
                ])
            ).start();

            // Sparkle rotation
            Animated.loop(
                Animated.timing(sparkleAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true
                })
            ).start();
            
           
        });
    } else {
        
        // Reset when modal closes
        scaleAnim.setValue(0);
        rotateAnim.setValue(0);
        glowAnim.setValue(0);
        sparkleAnim.setValue(0);
        fadeAnim.setValue(0);
    }
}, [visible]);

  const medalRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8]
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const sparkleRotation = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Congratulations Text */}
          <Animated.View style={[styles.congratsContainer, { opacity: fadeAnim }]}>
            <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
            <Text style={styles.achievementText}>You've Reached</Text>
            <Text style={[styles.levelText, { color: getLevelColor(level) }]}>
              {getLevelTitle(level)}
            </Text>
          </Animated.View>

          {/* Medal Container */}
          <View style={styles.medalContainer}>
            {/* Background Glow - Multiple layers */}
            <Animated.View
              style={[
                styles.glowLayer1,
                {
                  backgroundColor: getLevelColor(level),
                  opacity: glowOpacity,
                  transform: [{ scale: glowScale }]
                }
              ]}
            />
            <Animated.View
              style={[
                styles.glowLayer2,
                {
                  backgroundColor: getLevelColor(level),
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.5]
                  }),
                  transform: [{ scale: glowScale }]
                }
              ]}
            />
            <Animated.View
              style={[
                styles.glowLayer3,
                {
                  backgroundColor: getLevelColor(level),
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 0.3]
                  }),
                  transform: [{ scale: glowScale }]
                }
              ]}
            />

            {/* Sparkles */}
            <Animated.View
              style={[
                styles.sparkleContainer,
                { transform: [{ rotate: sparkleRotation }] }
              ]}
            >
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.sparkle,
                    {
                      transform: [
                        { rotate: `${i * 45}deg` },
                        { translateX: 120 }
                      ]
                    }
                  ]}
                >
                  <Sparkles size={20} color={getLevelColor(level)} />
                </View>
              ))}
            </Animated.View>

            {/* Medal Image */}
            <Animated.View
              style={{
                transform: [
                  { scale: scaleAnim },
                  { rotate: medalRotation }
                ]
              }}
            >
              <Image
                source={getMedalImage(level)}
                style={styles.medalImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Points Info */}
          <Animated.View style={[styles.pointsContainer, { opacity: fadeAnim }]}>
            <View style={styles.pointsCard}>
              <Trophy size={24} color={getLevelColor(level)} />
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsLabel}>Total Points</Text>
                <Text style={[styles.pointsValue, { color: getLevelColor(level) }]}>
                  {points || 0}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Continue Button */}
          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: getLevelColor(level) }]}
              onPress={onClose}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#1A1A2E',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  congratsContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 4
  },
  levelText: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 15,
    letterSpacing: 1
  },
  medalContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  },
  glowLayer1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: 0
  },
  glowLayer2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    zIndex: 0
  },
  glowLayer3: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: 0
  },
  sparkleContainer: {
    position: 'absolute',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sparkle: {
    position: 'absolute'
  },
  medalImage: {
    width: 200,
    height: 200,
    zIndex: 10
  },
  pointsContainer: {
    width: '100%',
    marginBottom: 24
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  pointsInfo: {
    flex: 1,
    alignItems: 'center'
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 4
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '900'
  },
  buttonContainer: {
    width: '100%'
  },
  continueButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1
  }
});