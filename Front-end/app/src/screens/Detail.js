import React, { useState, useEffect, useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { Heart, Clock, Flame, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux'
import { getDishDetailData, clearDishDetail, updateDishLikeStatus } from '@redux/slices/dishSlice'
import { likeDish, dislikeDish, updateFavoriteItem } from '@redux/slices/favoriteSlice'
import { imageMap } from '@/constants/imageAssets';
import { addEatingHistory, getTotalCalories } from '@redux/slices/userSlice'

export default function Detail({ route, navigation }) {
    const { dish } = route.params
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const dispatch = useDispatch()

    // Get detail data from Redux
    const {
        dishDetail,
        dishIngredients,
        dishSteps,
        isLoadingDetail,
        detailError
    } = useSelector(state => state.dish)

    // Get user and favorites data
    const { user } = useSelector(state => state.auth)
    const { favorites } = useSelector(state => state.favorite)

    // Check if current dish is in favorites and sync state
    const dishId = dish._id || dish.id
    const isFavoriteDish = favorites.some(fav => fav.dishId === dishId)
    const [isLiked, setIsLiked] = useState(dish.isLiked || isFavoriteDish)

    // Helper function để capitalize text
    const capitalizeText = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    // Sync local state with favorites when favorites change
    useEffect(() => {
        const isFavorite = favorites.some(fav => fav.dishId === dishId)
        setIsLiked(isFavorite)
    }, [favorites, dishId])

    // Fetch detail data khi component mount
    useEffect(() => {
        if (dish._id || dish.id) {
            const dishId = dish._id || dish.id;
            dispatch(getDishDetailData(dishId));
        }

        // Cleanup khi component unmount
        return () => {
            dispatch(clearDishDetail());
        };
    }, [dispatch, dish._id, dish.id]);

    // Handle error
    useEffect(() => {
        if (detailError) {
            Alert.alert('Error', detailError);
        }
    }, [detailError]);

    const handleBackPress = () => {
        navigation.goBack()
    }

    // Updated heart press handler with API integration
    const handleHeartPress = useCallback(async () => {
        if (!user?._id) {
            Alert.alert('Error', 'Please login to add favorites')
            return
        }

        try {
            if (isLiked) {

                // Update local state immediately for instant UI feedback
                setIsLiked(false)

                // Call API to dislike
                await dispatch(dislikeDish({
                    userId: user._id,
                    dishId: dishId
                })).unwrap()

                // Update dish slice to sync with other screens
                dispatch(updateDishLikeStatus({ dishId, isLiked: false }))

            } else {

                // Update local state immediately for instant UI feedback
                setIsLiked(true)

                // Call API to like
                const result = await dispatch(likeDish({
                    userId: user._id,
                    dishId: dishId
                })).unwrap()

                // Update dish slice to sync with other screens
                dispatch(updateDishLikeStatus({ dishId, isLiked: true }))

                // Create new favorite item for immediate UI update
                const newFavoriteItem = {
                    _id: result._id || `temp_${dishId}_${Date.now()}`,
                    dishId: dishId,
                    dish: dishDetail || dish,
                    createdAt: new Date().toISOString()
                }

                // Update favorites list
                dispatch(updateFavoriteItem({
                    dishId,
                    favoriteData: newFavoriteItem,
                    action: 'like'
                }))

            }
        } catch (error) {
            console.error('Error updating favorite status:', error)

            // Revert local state on error
            setIsLiked(!isLiked)

            Alert.alert('Error', error.message || 'Failed to update favorite')
        }
    }, [dispatch, user, isLiked, dish, dishDetail, dishId])

    const handleLetsCook = async () => {
        if (!user?._id) {
            Alert.alert('Error', 'Please login to track calories')
            return
        }

        try {
            // Thêm vào history
            const historyResult = await dispatch(addEatingHistory({
                userId: user._id,
                dishId: dishId
            })).unwrap()
            // Tính ngày hiện tại với timezone đúng
            const today = new Date();
            const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
            const todayString = localDate.toISOString().split('T')[0];
            setTimeout(async () => {
                await dispatch(getTotalCalories({
                    userId: user._id,
                    date: todayString
                }))
            }, 1000)

            // Thông báo thành công
            Alert.alert(
                'Success!',
                `Added "${dishData.name}" (${dishData.calorie || dishData.calories} Kcal) to your eating history!`,
                [
                    {
                        text: 'View Profile',
                        onPress: () => {
                            navigation.navigate('MainTabs', {
                                screen: 'Profile'
                            })
                        }
                    },
                    {
                        text: 'OK',
                        style: 'default'
                    }
                ]
            )

        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to add to eating history')
        }
    }
    // Sử dụng data từ API 
    const dishData = dishDetail || dish;
    const ingredients = dishIngredients || [];
    const steps = dishSteps || [];

    const getImageSource = () => {
        // Ưu tiên imageUrl từ dishData (API response)
        const imageUrl = dishData.imageUrl || dish.imageUrl || dish.image;

        if (imageUrl?.startsWith('http')) {
            return { uri: imageUrl };
        } else if (imageUrl && imageMap[imageUrl]) {
            return imageMap[imageUrl];
        } else {
            return require('../assets/img/testImage.png');
        }
    };

    // Loading state
    if (isLoadingDetail) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <ChevronLeft size={24} color={colors.title} />
                    </TouchableOpacity>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading dish details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                >
                    <ChevronLeft size={24} color={colors.title} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={handleHeartPress}
                >
                    <Heart
                        size={28}
                        color={colors.red}
                        fill={isLiked ? colors.red : 'none'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Dish Image - Sử dụng logic xử lý image giống Card */}
                <View style={styles.imageContainer}>
                    <Image
                        source={getImageSource()}
                        style={styles.dishImage}
                    />
                </View>

                {/* Dish Info */}
                <View style={styles.content}>
                    <Text style={styles.dishName}>{dishData.name}</Text>

                    {/* Meta Information */}
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Clock size={16} color={colors.description} />
                            <Text style={styles.metaText}>
                                {dishData.cookingTime || dishData.time} Min
                            </Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Flame size={16} color={colors.description} />
                            <Text style={styles.metaText}>
                                {dishData.calorie || dishData.calories} Kcal
                            </Text>
                        </View>

                        <View style={styles.metaItem}>
                            <ChefHat size={16} color={colors.description} />
                            <Text style={styles.metaText}>
                                {capitalizeText(dishData.difficulty)}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{dishData.description}</Text>
                    </View>

                    {/* Ingredients từ API */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {ingredients.length > 0 ? (
                            ingredients.map((ingredient, index) => (
                                <View key={index} style={styles.ingredientItem}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.ingredientText}>
                                        {ingredient.quantity && ingredient.unit
                                            ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                                            : ingredient.name
                                        }
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No ingredients available</Text>
                        )}
                    </View>

                    {/* Steps từ API */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        {steps.length > 0 ? (
                            steps.map((step, index) => (
                                <View key={index} style={styles.stepContainer}>
                                    <View style={styles.stepHeader}>
                                        <Text style={styles.stepNumber}>
                                            {step.stepNumber || index + 1}:
                                        </Text>
                                        <Text style={styles.stepDescription}>
                                            {step.description}
                                        </Text>
                                    </View>
                                    {step.title && (
                                        <Text style={styles.stepTitle}>
                                            {step.title}
                                        </Text>
                                    )}
                                    {step.duration && (
                                        <Text style={styles.stepDuration}>
                                            {step.duration} Minutes
                                        </Text>
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No steps available</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Let's Cook Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.cookButton}
                    onPress={handleLetsCook}
                >
                    <Text style={styles.cookButtonText}>Let's Cook</Text>
                    <ChevronRight size={20} color={colors.title} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: colors.background,
        },
        backButton: {
            padding: 8,
        },
        heartButton: {
            padding: 8,
        },
        scrollView: {
            flex: 1,
        },
        imageContainer: {
            paddingHorizontal: 40,
            marginBottom: 20,
        },
        dishImage: {
            width: '100%',
            height: 320,
            borderRadius: 16,
            resizeMode: 'cover',
        },
        content: {
            paddingHorizontal: 40,
            paddingBottom: 100,
        },
        dishName: {
            fontSize: 24,
            fontWeight: '700',
            color: colors.title,
            textAlign: 'center',
            marginBottom: 16,
            letterSpacing: 0.5,
        },
        metaContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            gap: 20,
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        metaText: {
            fontSize: 14,
            color: colors.title,
            fontWeight: '500',
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: colors.secondary,
            marginBottom: 12,
        },
        description: {
            fontSize: 14,
            color: colors.description,
            lineHeight: 22,
            textAlign: 'justify',
        },
        ingredientItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
            paddingRight: 10,
        },
        bullet: {
            fontSize: 14,
            color: colors.textSecondary,
            marginRight: 8,
            marginTop: 1,
        },
        ingredientText: {
            fontSize: 14,
            color: colors.description,
            lineHeight: 20,
            flex: 1,
        },
        stepContainer: {
            marginBottom: 16,
        },
        stepHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 4,
        },
        stepDescription: {
            fontSize: 14,
            color: colors.description,
            lineHeight: 20,
            flex: 1,

        },
        stepNumber: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.title,
            marginRight: 8,
            minWidth: 16,
            lineHeight: 20,
            textAlignVertical: 'center',
        },
        stepTitle: {
            fontSize: 13,
            fontWeight: '500',
            color: colors.textSecondary,
            marginLeft: 33,
            marginBottom: 4,
        },
        stepText: {
            fontSize: 14,
            color: colors.description,
            lineHeight: 20,
            paddingLeft: 8,
            paddingRight: 10,
        },
        stepDuration: {
            fontSize: 12,
            color: colors.primary,
            marginTop: 4,
            fontWeight: '500',
            paddingLeft: 8,
        },
        bottomContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 34,
        },
        cookButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.secondary || '#00B894',
            borderRadius: 12,
            paddingVertical: 16,
            gap: 8,
        },
        cookButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#fff',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            marginTop: 10,
            fontSize: 16,
            color: colors.text,
            opacity: 0.7,
        },
        noDataText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontStyle: 'italic',
            opacity: 0.7,
        },
    })