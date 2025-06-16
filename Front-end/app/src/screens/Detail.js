import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView
} from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { Heart, Clock, Flame, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react-native';
export default function Detail({ route, navigation }) {
    const { dish } = route.params
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [isLiked, setIsLiked] = useState(dish.isLiked)

    const handleBackPress = () => {
        navigation.goBack()
    }

    const handleHeartPress = () => {
        setIsLiked(!isLiked)
    }

    const handleLetsCook = () => {
        // Navigate to cooking screen or start cooking timer
        console.log('Let\'s Cook pressed!')
    }

    // Sample detailed data - you can expand this based on your dish object
    const dishDetails = {
        ...dish,
        description: "A hearty and flavorful dish that brings together tender, juicy chicken with perfectly cooked eggs. Simmered in a savory blend of spices and herbs. This comforting meal balances protein-rich goodness with rich, satisfying textures. Whether served over steamed rice or pasta with crusty bread, this delicious combination is a wholesome feast for any time of day.",
        ingredients: [
            "2 chicken thighs or breasts, sliced into bite-sized pieces",
            "2-3 eggs",
            "1 small onion, thinly sliced",
            "1 tablespoon soy sauce",
            "1 tablespoon mirin (or sugar as a substitute)",
            "1 tablespoon cooking oil",
            "1/4 cup water or chicken broth",
            "Salt to taste",
            "Optional: green onions or parsley for garnish",
            "Steamed rice or bread for serving"
        ],
        steps: [
            {
                title: "Prepare ingredients:",
                details: [
                    "Slice the chicken, onions, and any garnish (green onions, herbs).",
                    "Crack the eggs into a bowl and beat lightly."
                ]
            },
            {
                title: "Sauté onions:",
                details: [
                    "Heat oil in a pan over medium heat.",
                    "Add the sliced onions and cook until soft and slightly golden."
                ]
            },
            {
                title: "Cook the chicken:",
                details: [
                    "Add the chicken to the pan with the onions.",
                    "Cook until the chicken turns white and starts to brown lightly.",
                    "Add seasoning."
                ]
            },
            {
                title: "Add the eggs:",
                details: [
                    "Pour the beaten eggs evenly over the chicken.",
                    "Cover the pan with a lid and cook for 1-2 minutes, until the eggs are just set (still slightly runny, is traditional in oyakodon).",
                    "Cook longer for firmer eggs."
                ]
            },
            {
                title: "Serve:",
                details: [
                    "Turn off the heat and let it sit covered for a minute.",
                    "Serve hot over steamed rice or with bread.",
                    "Garnish with chopped green onions or herbs if desired."
                ]
            }
        ]
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                >

                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={handleHeartPress}
                >
                    <Heart
                        size={28}
                        color={isLiked ? '#FF69B4' : '#FF69B4'}
                        fill={isLiked ? '#FF69B4' : 'none'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Dish Image */}
                <View style={styles.imageContainer}>
                    <Image source={dish.image} style={styles.dishImage} />
                </View>

                {/* Dish Info */}
                <View style={styles.content}>
                    <Text style={styles.dishName}>{dishDetails.name}</Text>

                    {/* Meta Information */}
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Clock size={16} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{dishDetails.time}</Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Flame size={16} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{dishDetails.calories}</Text>
                        </View>

                        <View style={styles.metaItem}>
                            <ChefHat size={16} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{dishDetails.difficulty}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{dishDetails.description}</Text>
                    </View>

                    {/* Ingredients */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {dishDetails.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.ingredientText}>{ingredient}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Steps */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        {dishDetails.steps.map((step, index) => (
                            <View key={index} style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                {step.details.map((detail, detailIndex) => (
                                    <View key={detailIndex} style={styles.stepDetail}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.stepText}>{detail}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
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
                    <ChevronRight size={20} color="#fff" />
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
            height: 300,
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
            color: colors.text,
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
            color: colors.textSecondary,
            fontWeight: '500',
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 12,
        },
        description: {
            fontSize: 14,
            color: colors.textSecondary,
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
            color: colors.textSecondary,
            lineHeight: 20,
            flex: 1,
        },
        stepContainer: {
            marginBottom: 16,
        },
        stepTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
        },
        stepDetail: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 6,
            paddingLeft: 8,
            paddingRight: 10,
        },
        stepText: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            flex: 1,
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
    })