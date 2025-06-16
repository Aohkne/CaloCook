import React from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { Ionicons } from '@expo/vector-icons'
import { Heart, Clock, Flame, ChefHat } from 'lucide-react-native';

export default function Card({ dish, onHeartPress, onCardPress }) {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    return (
        <Pressable
            style={styles.Card}
            onPress={() => onCardPress && onCardPress(dish)}
        >
            <View style={styles.imageContainer}>
                <Image source={dish.image} style={styles.dishImage} />

                <Pressable
                    style={styles.heartIcon}
                    onPress={() => onHeartPress && onHeartPress(dish.id)}
                >
                    <Heart
                        size={28}
                        color={dish.isLiked ? '#FF69B4' : '#FF69B4'}
                        fill={dish.isLiked ? '#FF69B4' : 'none'}
                    />
                </Pressable>
            </View>

            <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{dish.name}</Text>

                <View style={styles.dishMeta}>
                    <View style={styles.metaItem}>

                        <Clock size={14} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{dish.time}</Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Flame size={14} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{dish.calories}</Text>
                    </View>

                    {dish.difficulty && (
                        <View style={styles.metaItem}>
                            <ChefHat size={14} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{dish.difficulty}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.ingredients}>{dish.ingredients}</Text>
            </View>
        </Pressable>
    )
}

const createStyles = (colors) =>
    StyleSheet.create({
        Card: {
            backgroundColor: colors.card || '#FFFFFF',
            borderRadius: 16,
            marginBottom: 20,
            padding: 18,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            alignItems: 'center',
            width: '85%',
            alignSelf: 'center',
            minHeight: 280,
        },
        imageContainer: {
            position: 'relative',
            width: '100%',
            marginBottom: 16,
        },
        dishImage: {
            width: '100%',
            height: 280,
            borderRadius: 16,
            resizeMode: 'cover'
        },
        heartIcon: {
            position: 'absolute',
            top: -2,
            right: -2,
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 8,
        },
        dishInfo: {
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: 8,
        },
        dishName: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 12,
            letterSpacing: 0.5,
            textAlign: 'center',
            lineHeight: 20,
        },
        dishMeta: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            gap: 16,
            flexWrap: 'wrap',
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        metaText: {
            fontSize: 12,
            color: colors.textSecondary || '#666',
            fontWeight: '500'
        },
        ingredients: {
            fontSize: 12,
            color: colors.textSecondary || '#666',
            lineHeight: 18,
            textAlign: 'center',
            paddingHorizontal: 4,
        }
    })