import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, ScrollView, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, Button } from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { Lock, User, Edit3, Calendar, Ruler, Weight, Target, Crown, X, Save, Users, Activity, Flame, ThumbsUp, ThumbsDown, Mars, Venus, Sun, Moon, History, LogOut } from 'lucide-react-native'
import Svg, { Circle } from 'react-native-svg'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, updateUserProfile, clearError, updateLocalUserData, getTotalCalories } from '@/redux/slices/userSlice'
import { logout, logoutLocal } from '@/redux/slices/authSlice'
export default function ProfileScreen({ navigation }) {
  const { colors, toggleTheme, isDark } = useTheme()
  const styles = createStyles(colors)
  const dispatch = useDispatch()

  // Redux state
  const { userData, totalCalories, isLoading, isUpdating, error } = useSelector(state => state.user)
  useEffect(() => {
    const loadUserData = async () => {
      await dispatch(getUserProfile())

      // Load total calories cho hôm nay với timezone đúng
      if (userData?._id) {
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        const todayString = localDate.toISOString().split('T')[0];
        dispatch(getTotalCalories({
          userId: userData._id,
          date: todayString
        }))
      }
    }

    loadUserData()
  }, [dispatch, userData?._id])

  //useEffect focus listener
  useEffect(() => {
    //unsubscribe đảm bảo listener được xóa khi component unmount để tránh memory leak.
    const unsubscribe = navigation.addListener('focus', () => {
      if (userData?._id) {
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        const todayString = localDate.toISOString().split('T')[0];
        dispatch(getTotalCalories({
          userId: userData._id,
          date: todayString
        }))
      }
    })

    return unsubscribe
  }, [navigation, userData?._id, dispatch])

  // Modal state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  // Edit form data
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    height: '',
    weight: '',
    calorieLimit: '',
    gender: 'male',
    dob: '',
    avatarUrl: ''
  })

  // Load user profile on component mount
  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  // Update editData when userData changes
  useEffect(() => {
    if (userData) {
      setEditData({
        username: userData.username || '',
        email: userData.email || '',
        height: userData.height?.toString() || '',
        weight: userData.weight?.toString() || '',
        calorieLimit: userData.calorieLimit?.toString() || '',
        gender: userData.gender || 'male',
        dob: userData.dob || '',
        avatarUrl: userData.avatarUrl || ''
      })
    }
  }, [userData])

  // Handle error display
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const userName = userData?.username || 'User'

  // Function to get initials from name (first and last word)
  const getInitials = (name) => {
    const words = name.trim().split(' ').filter(word => word.length > 0)
    if (words.length === 0) return ''
    if (words.length === 1) return words[0].charAt(0).toUpperCase()

    const firstInitial = words[0].charAt(0).toUpperCase()
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase()
    return firstInitial + lastInitial
  }

  // Sửa format date function:
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // Calculate age
  const calculateAge = (dateString) => {
    if (!dateString) return 0
    try {
      const today = new Date()
      const birthDate = new Date(dateString)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    } catch (error) {
      return 0
    }
  }

  const calculateBMI = (weight, height) => {
    if (!weight || !height || weight <= 0 || height <= 0) return '0.0'
    try {
      const heightInM = height / 100
      return (weight / (heightInM * heightInM)).toFixed(1)
    } catch (error) {
      return '0.0'
    }
  }


  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Chỉ clear local state, không gọi API
            dispatch(logoutLocal())
          },
        },
      ]
    )
  }
  // Hình tròn
  // Progress data (có thể lấy từ API riêng)

  // Animation values cho ngọn lửa
  const flameScale = useRef(new Animated.Value(1)).current
  const flameOpacity = useRef(new Animated.Value(1)).current
  const flameRotation = useRef(new Animated.Value(0)).current
  const currentCalories = totalCalories || 0
  const targetCalories = userData?.calorieLimit || 2000
  const progressPercentage = targetCalories > 0 ? (currentCalories / targetCalories) * 100 : 0



  // Circle progress calculations
  const radius = 120
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference

  //Giới hạn progress không vượt quá 100% cho hiển thị vòng tròn
  const displayPercentage = Math.min(progressPercentage, 100)
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference

  // Tính toán màu sắc và icon dựa trên progress (vẫn dùng progressPercentage gốc để xác định trạng thái)
  const getProgressColor = () => {
    if (progressPercentage <= 15) {
      return '#FF4444' // Màu đỏ khi ít
    } else if (progressPercentage > 100) {
      return '#FF4444' // Màu đỏ khi vượt mức (lửa)
    } else if (progressPercentage === 100) {
      return colors.primary // Màu xanh lime khi đúng mục tiêu
    } else {
      // Chuyển từ xanh nhạt → xanh lime (#9AF10C) cho 15-100%
      const progress = (progressPercentage - 15) / 85 // 0-1 cho toàn bộ khoảng 15-100%

      // Bắt đầu từ màu xanh nhạt và chuyển sang #9AF10C
      const startColor = { r: 200, g: 250, b: 180 } // #C8FAAB - xanh nhạt hơn #9AF10C
      const endColor = { r: 154, g: 241, b: 12 }    // #9AF10C

      const red = Math.round(startColor.r - progress * (startColor.r - endColor.r))
      const green = Math.round(startColor.g - progress * (startColor.g - endColor.g))
      const blue = Math.round(startColor.b - progress * (startColor.b - endColor.b))

      return `rgb(${red}, ${green}, ${blue})`
    }
  }

  const getProgressIcon = () => {
    if (progressPercentage > 100) {
      return <Flame size={24} color="#FF4444" />
    } else if (progressPercentage === 100) {
      return <ThumbsUp size={24} color={colors.primary} />
    } else {
      return <ThumbsDown size={24} color="#FF4444" />
    }
  }

  const getIconBackgroundColor = () => {
    if (progressPercentage <= 15) {
      return '#FFE5E5' // Background đỏ nhạt khi ít
    } else if (progressPercentage > 100) {
      return '#FFE5E5' // Background đỏ nhạt cho lửa
    } else if (progressPercentage === 100) {
      return '#F0FCE8' // Background xanh lime nhạt khi hoàn thành
    } else {
      return '#F0F0FF' // Background xanh rất nhạt khi đang tiến bộ
    }
  }

  // Animation cho icon
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

    // Animation dao động nhẹ (chỉ cho icon lửa khi vượt mức)
    let wiggleAnimation
    if (progressPercentage > 100) {
      wiggleAnimation = Animated.loop(
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
      wiggleAnimation.start()
    }

    pulseAnimation.start()

    return () => {
      pulseAnimation.stop()
      if (wiggleAnimation) {
        wiggleAnimation.stop()
      }
    }
  }, [progressPercentage])

  // End hình tròn

  const handleLockPress = () => {
    navigation.navigate('ChangePassword')
  }

  const handleEditPress = () => {
    setIsEditModalVisible(true)
  }

  const handleSaveChanges = async () => {
    // Validate input
    if (!editData.username.trim()) {
      Alert.alert('Error', 'Username cannot be empty')
      return
    }
    if (!editData.email.trim()) {
      Alert.alert('Error', 'Email cannot be empty')
      return
    }
    if (editData.height && (isNaN(parseInt(editData.height)) || parseInt(editData.height) <= 0)) {
      Alert.alert('Error', 'Please enter a valid height')
      return
    }
    if (editData.weight && (isNaN(parseInt(editData.weight)) || parseInt(editData.weight) <= 0)) {
      Alert.alert('Error', 'Please enter a valid weight')
      return
    }
    if (editData.calorieLimit && (isNaN(parseInt(editData.calorieLimit)) || parseInt(editData.calorieLimit) <= 0)) {
      Alert.alert('Error', 'Please enter a valid calorie limit')
      return
    }

    // Prepare update data
    const updateData = {
      username: editData.username,
      email: editData.email,
      height: editData.height ? parseInt(editData.height) : null,
      weight: editData.weight ? parseInt(editData.weight) : null,
      calorieLimit: editData.calorieLimit ? parseInt(editData.calorieLimit) : null,
      gender: editData.gender,
      dob: editData.dob,
      avatarUrl: editData.avatarUrl
    }

    try {

      // Dispatch update action
      const result = await dispatch(updateUserProfile(updateData))

      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditModalVisible(false)
        Alert.alert('Success', 'Profile updated successfully!')

        // Delay một chút trước khi refresh data
        setTimeout(() => {
          dispatch(getUserProfile())
        }, 100)
      }
    } catch (error) {
      // Error will be handled by useEffect
    }
  }

  const handleCancelEdit = () => {
    // Reset edit data to original values
    if (userData) {
      setEditData({
        username: userData.username || '',
        email: userData.email || '',
        height: userData.height?.toString() || '',
        weight: userData.weight?.toString() || '',
        calorieLimit: userData.calorieLimit?.toString() || '',
        gender: userData.gender || 'male',
        dob: userData.dob || '',
        avatarUrl: userData.avatarUrl || ''
      })
    }
    setIsEditModalVisible(false)
  }

  const InfoCard = ({ icon, title, value, subtitle, backgroundColor = '#F8F9FA' }) => (
    <View style={[styles.infoCard, { backgroundColor }]}>
      <View style={styles.infoIcon}>
        {icon}
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {subtitle && <Text style={styles.infoSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  )

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLockPress}>
            <Lock size={24} color={colors.title} />
          </TouchableOpacity>
          {/* History Icon - Add this */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('History')}
          >
            <History size={24} color={colors.title} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
            {isDark ? (
              <Moon size={24} color="#4A90E2" />
            ) : (
              <Sun size={24} color="#FFA500" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          {/* Card Container bọc cả avatar, user info và progress */}
          <View style={styles.cardContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {userData?.avatarUrl ? (
                  <Image
                    source={{ uri: userData?.avatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <User size={50} color="#888888" />
                )}
              </View>
              <TouchableOpacity style={styles.editBadge} onPress={handleEditPress}>
                <Edit3 size={16} color="#FFFFFF" />
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
                      {userData?.role === 'admin' && <Crown size={10} color="#0EA5E9" />}
                      <Text style={styles.roleText}>
                        {userData?.role === 'admin' ? 'Admin User' : 'User'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.contactStrip}>
                  <View style={styles.emailField}>
                    <View style={styles.fieldHeader}>
                      <View style={styles.fieldDot} />
                      <Text style={styles.fieldTitle}>EMAIL</Text>
                    </View>
                    <Text style={styles.emailValue}>{userData?.email || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Personal Information Cards */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.infoGrid}>
                <InfoCard
                  icon={<Calendar size={20} color="#FF6B35" />}
                  title="Age"
                  value={`${calculateAge(userData?.dob)} years`}
                  subtitle={formatDate(userData?.dob)}
                  backgroundColor="#FFF5F0"
                />

                <InfoCard
                  icon={userData?.gender === 'male' ?
                    <Mars size={20} color="#3B82F6" /> :
                    <Venus size={20} color="#EC4899" />
                  }
                  title="Gender"
                  value={userData?.gender === 'male' ? 'Male' : 'Female'}
                  backgroundColor="#F0F9FF"
                />
              </View>

              <View style={styles.infoGrid}>
                <InfoCard
                  icon={<Ruler size={20} color="#10B981" />}
                  title="Height"
                  value={`${userData?.height || 0} cm`}
                  backgroundColor="#F0FDF4"
                />

                <InfoCard
                  icon={<Weight size={20} color="#8B5CF6" />}
                  title="Weight"
                  value={`${userData?.weight || 0} kg`}
                  backgroundColor="#FAF5FF"
                />
              </View>

              <View style={styles.infoGrid}>
                <InfoCard
                  icon={<Activity size={20} color="#EF4444" />}
                  title="BMI"
                  value={calculateBMI(userData?.weight, userData?.height)}
                  subtitle="Normal"
                  backgroundColor="#FEF2F2"
                />

                <InfoCard
                  icon={<Target size={20} color="#F59E0B" />}
                  title="Target"
                  value={`${userData?.calorieLimit || 0} kcal`}
                  subtitle="Daily"
                  backgroundColor="#FFFBEB"
                />
              </View>
            </View>

            {/* TT */}

            {/* JSX RENDER HÌNH TRÒN */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
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
                  {/* Progress circle - sử dụng displayPercentage*/}
                  <Circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    stroke={getProgressColor()}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
                  />
                  {/* Progress dot at the end of the progress - sử dụng displayPercentage */}
                  {displayPercentage > 0 && (
                    <Circle
                      cx={radius + strokeWidth + radius * Math.cos((displayPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                      cy={radius + strokeWidth + radius * Math.sin((displayPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
                      r={6}
                      fill="#FFFFFF"
                      stroke={getProgressColor()}
                      strokeWidth="2"
                    />
                  )}
                </Svg>
                <View style={styles.progressContent}>
                  <Animated.View
                    style={[
                      styles.flameContainer,
                      {
                        backgroundColor: getIconBackgroundColor(),
                        transform: [
                          { scale: flameScale },
                          {
                            rotate: (progressPercentage > 100) ?
                              flameRotation.interpolate({
                                inputRange: [-1, 1],
                                outputRange: ['-10deg', '10deg'],
                              }) : '0deg'
                          }
                        ],
                        opacity: flameOpacity,
                        shadowColor: getProgressColor(),
                      }
                    ]}
                  >
                    {getProgressIcon()}
                  </Animated.View>
                  <Text style={styles.calorieNumber}>{currentCalories}</Text>
                  <Text style={styles.calorieUnit}>kcal</Text>
                  <Text style={styles.calorieTarget}>of {targetCalories || 0} kcal</Text>
                </View>
              </View>
            </View>

            {/* End hình tròn */}

            {/* TT */}

            {/* Account Status */}
            <View style={styles.statusSection}>
              <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusTitle}>Account Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: userData?.isActive ? colors.primary : '#EF4444' }]}>
                    <Text style={styles.statusText}>{userData?.isActive ? 'Active' : 'Suspended'}</Text>
                  </View>
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>Joined: {formatDate(userData?.createdAt)}</Text>
                  <Text style={styles.statusLabel}>Last updated: {formatDate(userData?.updatedAt)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>


        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelEdit}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.modalCloseButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity
              onPress={handleSaveChanges}
              style={[styles.modalSaveButton, { opacity: isUpdating ? 0.6 : 1 }]}
              disabled={isUpdating}
            >
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.modalSaveText}>{isUpdating ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.modalScrollContent}
          >
            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={editData.username}
                onChangeText={(text) => setEditData(prev => ({ ...prev, username: text }))}
                placeholder="Enter your username"
                placeholderTextColor="#999"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={editData.email}
                onChangeText={(text) => setEditData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    editData.gender === 'male' && styles.genderButtonActive
                  ]}
                  onPress={() => setEditData(prev => ({ ...prev, gender: 'male' }))}
                >
                  <Mars size={20} color={editData.gender === 'male' ? colors.secondary : '#6B7280'} />
                  <Text style={[
                    styles.genderText,
                    editData.gender === 'male' && styles.genderTextActive
                  ]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    editData.gender === 'female' && styles.genderButtonActive
                  ]}
                  onPress={() => setEditData(prev => ({ ...prev, gender: 'female' }))}
                >
                  <Venus size={20} color={editData.gender === 'female' ? colors.secondary : '#6B7280'} />
                  <Text style={[
                    styles.genderText,
                    editData.gender === 'female' && styles.genderTextActive
                  ]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Height */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={styles.textInput}
                value={editData.height}
                onChangeText={(text) => setEditData(prev => ({ ...prev, height: text }))}
                placeholder="Enter your height"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.textInput}
                value={editData.weight}
                onChangeText={(text) => setEditData(prev => ({ ...prev, weight: text }))}
                placeholder="Enter your weight"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Calorie Limit */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Daily Calorie Target</Text>
              <TextInput
                style={styles.textInput}
                value={editData.calorieLimit}
                onChangeText={(text) => setEditData(prev => ({ ...prev, calorieLimit: text }))}
                placeholder="Enter your daily calorie target"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.textInput}
                value={editData.dob}
                onChangeText={(text) => setEditData(prev => ({ ...prev, dob: text }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
              <Text style={styles.inputHint}>Format: YYYY-MM-DD (e.g., 1995-05-15)</Text>
            </View>

            {/* Avatar URL */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Avatar URL (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={editData.avatarUrl}
                onChangeText={(text) => setEditData(prev => ({ ...prev, avatarUrl: text }))}
                placeholder="Enter avatar image URL"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            {/* Thêm padding bottom để tránh bị che */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}
const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    scrollContainer: {
      flex: 1,
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
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
    },
    editBadge: {
      position: 'absolute',
      bottom: -12,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.secondary,
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
      backgroundColor: colors.cardBg,
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
      backgroundColor: colors.secondary,
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
      color: '#000000',
      marginBottom: 4,
      letterSpacing: -0.2,
    },
    roleTag: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: '#E6F4F1',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.secondary,
      gap: 4,
    },
    roleText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.secondary,
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
      backgroundColor: colors.secondary,
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
      color: '#000000',
      letterSpacing: 0.1,
      paddingLeft: 11,
    },
    // Info Section Styles
    infoSection: {
      width: '100%',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.title || '#1A1A1A',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    infoGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 12,
    },
    infoCard: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    genderIcon: {
      fontSize: 20,
    },
    targetIcon: {
      fontSize: 20,
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000000',
      marginBottom: 2,
    },
    infoSubtitle: {
      fontSize: 11,
      color: '#9CA3AF',
      fontWeight: '500',
    },


    // Progress Section
    progressContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.title || '#1A1A1A',
      marginBottom: 16,
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
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
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
    },


    //End hình tròn 
    // Status Section
    statusSection: {
      width: '100%',
      marginTop: 10,
    },
    statusCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    statusHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000000',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    statusInfo: {
      gap: 4,
    },
    statusLabel: {
      fontSize: 13,
      color: '#6B7280',
      fontWeight: '500',
    },

    // Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background || '#FFFFFF',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    modalCloseButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.title || '#1A1A1A',
    },
    modalSaveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.secondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
    },
    modalSaveText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    inputGroup: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.title || '#1A1A1A',
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text || '#1A1A1A',
      backgroundColor: '#FFFFFF',
    },
    inputHint: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 4,
      fontStyle: 'italic',
    },
    genderContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    genderButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      gap: 8,
    },
    genderButtonActive: {
      borderColor: colors.secondary,
      backgroundColor: '#E6F4F1',
    },
    genderText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#6B7280',
    },
    genderTextActive: {
      color: colors.secondary,
      fontWeight: '600',
    },
    modalScrollContent: {
      paddingBottom: 100,
    },
    bottomPadding: {
      height: 50,
    },
    themeToggleButton: {
      padding: 8,
    },

    logoutSection: {
      marginTop: 20,
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    logoutButton: {
      backgroundColor: '#EF4444',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
      shadowColor: '#EF4444',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    logoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    }
  })