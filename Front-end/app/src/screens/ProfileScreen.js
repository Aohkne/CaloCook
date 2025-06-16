import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@contexts/ThemeProvider'
import { Lock, User, Edit3 } from 'lucide-react-native'
import Svg, { Circle } from 'react-native-svg'

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  // Animation values cho ngọn lửa
  const flameScale = useRef(new Animated.Value(1)).current
  const flameOpacity = useRef(new Animated.Value(1)).current
  const flameRotation = useRef(new Animated.Value(0)).current

  // User data
  const userName = "Nguyen Thanh Bao" // Có thể thay đổi tên ở đây

  // Function to get initials from name (first and last word)
  const getInitials = (name) => {
    const words = name.trim().split(' ').filter(word => word.length > 0)
    if (words.length === 0) return ''
    if (words.length === 1) return words[0].charAt(0).toUpperCase()

    const firstInitial = words[0].charAt(0).toUpperCase()
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase()
    return firstInitial + lastInitial
  }

  // Progress data
  const currentCalories = 375
  const targetCalories = 2213
  const progressPercentage = (currentCalories / targetCalories) * 100

  // Circle progress calculations
  const radius = 120
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  // Animation cho ngọn lửa
  useEffect(() => {
    // Animation nhấp nháy và phóng to thu nhỏ
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(flameScale, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(flameOpacity, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(flameScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(flameOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    )

    // Animation dao động nhẹ
    const wiggleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameRotation, {
          toValue: 0.05, // 5 độ
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(flameRotation, {
          toValue: -0.05, // -5 độ
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(flameRotation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    )

    pulseAnimation.start()
    wiggleAnimation.start()

    return () => {
      pulseAnimation.stop()
      wiggleAnimation.stop()
    }
  }, [])

  const handleLockPress = () => {
    navigation.navigate('ChangePassword')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLockPress}>
            <Lock size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileSection}>
        {/* Card Container bọc cả avatar, user info và progress */}
        <View style={styles.cardContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User
                size={50}
                color="#888888"
              />
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Edit3
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.identityBlock}>
              <View style={styles.nameDisplay}>
                <View style={styles.initialCircle}>
                  <Text style={styles.initialText}>{getInitials(userName)}</Text>
                </View>
                <View style={styles.nameDetails}>
                  <Text style={styles.displayName}>{userName}</Text>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>CaloCook User</Text>
                  </View>
                </View>
              </View>

              <View style={styles.contactStrip}>
                <View style={styles.emailField}>
                  <View style={styles.fieldHeader}>
                    <View style={styles.fieldDot} />
                    <Text style={styles.fieldTitle}>EMAIL</Text>
                  </View>
                  <Text style={styles.emailValue}>user123@gmail.com</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2}>
                {/* Background circle */}
                <Circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  stroke="#F0F0F0"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress circle */}
                <Circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  stroke="#FF8C42"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
                />
                {/* Progress dot at the end of the progress */}
                {progressPercentage > 0 && (
                  <Circle
                    cx={radius + strokeWidth + radius * Math.cos((progressPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                    cy={radius + strokeWidth + radius * Math.sin((progressPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                    r={6}
                    fill="#FFFFFF"
                    stroke="#FF8C42"
                    strokeWidth="2"
                  />
                )}
              </Svg>
              <View style={styles.progressContent}>
                <Animated.View
                  style={[
                    styles.flameContainer,
                    {
                      transform: [
                        { scale: flameScale },
                        {
                          rotate: flameRotation.interpolate({
                            inputRange: [-1, 1],
                            outputRange: ['-10deg', '10deg'],
                          })
                        }
                      ],
                      opacity: flameOpacity,
                    }
                  ]}
                >
                  <Text style={styles.flameIcon}>🔥</Text>
                </Animated.View>
                <Text style={styles.calorieNumber}>{currentCalories}</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
                <Text style={styles.calorieTarget}>of {targetCalories} kcal</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
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
    profileSection: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 20
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 30,
      alignItems: 'center'
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#F8F9FA',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#E9ECEF',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    editBadge: {
      position: 'absolute',
      bottom: -12,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FF6B35',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    cardContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingVertical: 30,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      alignItems: 'center',
    },
    userInfo: {
      width: '100%',
      marginBottom: 20,
      alignItems: 'center',
      paddingHorizontal: 20,
    },

    identityBlock: {
      width: '100%',
      backgroundColor: '#FAFAFA',
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E8E8E8',
    },

    nameDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#FFFFFF',
    },

    initialCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#FF6B35',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: '#FF6B35',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },

    initialText: {
      fontSize: 18,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },

    nameDetails: {
      flex: 1,
    },

    displayName: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.title || '#1A1A1A',
      marginBottom: 4,
      letterSpacing: -0.2,
    },

    roleTag: {
      alignSelf: 'flex-start',
      backgroundColor: '#F0F9FF',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#0EA5E9',
    },

    roleText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#0EA5E9',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },

    contactStrip: {
      backgroundColor: '#F8F9FA',
      paddingHorizontal: 20,
      paddingVertical: 14,
    },

    emailField: {
      width: '100%',
    },

    fieldHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    fieldDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: '#FF6B35',
      marginRight: 6,
    },

    fieldTitle: {
      fontSize: 9,
      fontWeight: '800',
      color: '#6B7280',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    emailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.title || '#374151',
      letterSpacing: 0.1,
      paddingLeft: 11,
    },
    progressContainer: {
      alignItems: 'center',
      marginTop: 10
    },
    progressCircle: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    progressContent: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center'
    },
    flameContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFE5E5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: '#FF6B6B',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    flameIcon: {
      fontSize: 24
    },
    calorieNumber: {
      fontSize: 36,
      fontWeight: '800',
      color: colors.title || '#000000',
      marginBottom: 2
    },
    calorieUnit: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.title || '#000000',
      marginBottom: 4
    },
    calorieTarget: {
      fontSize: 13,
      color: '#999999',
      fontWeight: '500'
    }
  })