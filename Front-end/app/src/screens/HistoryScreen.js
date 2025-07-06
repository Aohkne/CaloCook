import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    ActivityIndicator,
    Alert
} from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { ArrowLeft, Clock, Utensils, Calendar, Star } from 'lucide-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getEatingHistory } from '@redux/slices/userSlice'

export default function HistoryScreen({ navigation }) {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)
    const { eatingHistory, isLoadingHistory, error } = useSelector(state => state.user)

    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (user?._id) {
            dispatch(getEatingHistory(user._id))
        }
    }, [dispatch, user?._id])

    const onRefresh = React.useCallback(async () => {
        if (user?._id) {
            setRefreshing(true)
            await dispatch(getEatingHistory(user._id))
            setRefreshing(false)
        }
    }, [dispatch, user?._id])

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            // Reset hours để so sánh chính xác
            today.setHours(0, 0, 0, 0)
            yesterday.setHours(0, 0, 0, 0)
            date.setHours(0, 0, 0, 0)

            if (date.getTime() === today.getTime()) {
                return 'Today'
            } else if (date.getTime() === yesterday.getTime()) {
                return 'Yesterday'
            } else {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
            }
        } catch (error) {
            return dateString
        }
    }

    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        } catch (error) {
            return ''
        }
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return '#4CAF50'
            case 'medium':
                return '#FF9800'
            case 'hard':
                return '#F44336'
            default:
                return colors.textSecondary
        }
    }

    const groupHistoryByDate = (history) => {
        const grouped = {}

        history.forEach(item => {
            const date = new Date(item.createdAt || item.date)
            const dateKey = date.toDateString()

            if (!grouped[dateKey]) {
                grouped[dateKey] = []
            }

            grouped[dateKey].push(item)
        })

        // Sort dates in descending order (newest first)
        const sortedDates = Object.keys(grouped).sort((a, b) =>
            new Date(b) - new Date(a)
        )

        return sortedDates.map(date => ({
            date,
            items: grouped[date].sort((a, b) =>
                new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
            )
        }))
    }

    const HistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyItemLeft}>
                <View style={styles.dishIconContainer}>
                    <Utensils size={18} color={colors.secondary} />
                </View>
                <View style={styles.dishInfo}>
                    <Text style={styles.dishName} numberOfLines={2}>
                        {item.dish?.name || 'Unknown Dish'}
                    </Text>
                    <View style={styles.dishMeta}>
                        <View style={styles.metaItem}>
                            <Clock size={12} color={colors.textSecondary} />
                            <Text style={styles.metaText}>
                                {item.dish?.cookingTime || 0} min
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={[
                                styles.difficultyText,
                                { color: getDifficultyColor(item.dish?.difficulty) }
                            ]}>
                                {item.dish?.difficulty || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.historyItemRight}>
                <View style={styles.caloriesContainer}>
                    <Text style={styles.caloriesText}>
                        {item.dish?.calorie || 0}
                    </Text>
                    <Text style={styles.caloriesUnit}>kcal</Text>
                </View>
                <Text style={styles.timeText}>
                    {formatTime(item.createdAt || item.date)}
                </Text>
            </View>
        </View>
    )

    const DateSection = ({ date, items }) => (
        <View style={styles.dateSection}>
            <View style={styles.dateHeader}>
                <Calendar size={16} color={colors.secondary} />
                <Text style={styles.dateTitle}>
                    {formatDate(date)}
                </Text>
                <Text style={styles.dateCount}>
                    {items.length} dish{items.length > 1 ? 'es' : ''}
                </Text>
            </View>

            <View style={styles.dateItems}>
                {items.map((item, index) => (
                    <HistoryItem key={`${item._id || item.id}-${index}`} item={item} />
                ))}
            </View>

            <View style={styles.dateSummary}>
                <Text style={styles.dateSummaryText}>
                    Total: {items.reduce((sum, item) => sum + (item.dish?.calorie || 0), 0)} kcal
                </Text>
            </View>
        </View>
    )

    if (isLoadingHistory && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Eating History</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                    <Text style={styles.loadingText}>Loading your eating history...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const groupedHistory = groupHistoryByDate(eatingHistory)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Eating History</Text>
                <View style={styles.placeholder} />
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={onRefresh}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!error && groupedHistory.length === 0 && !isLoadingHistory && (
                <View style={styles.emptyContainer}>
                    <Utensils size={48} color={colors.textSecondary} />
                    <Text style={styles.emptyTitle}>No eating history yet</Text>
                    <Text style={styles.emptyDescription}>
                        Start cooking some dishes to see your eating history here
                    </Text>
                </View>
            )}

            {!error && groupedHistory.length > 0 && (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.secondary]}
                            tintColor={colors.secondary}
                        />
                    }
                >
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Total Dishes Cooked</Text>
                        <Text style={styles.summaryCount}>{eatingHistory.length}</Text>
                    </View>

                    {groupedHistory.map((dateGroup, index) => (
                        <DateSection
                            key={dateGroup.date}
                            date={dateGroup.date}
                            items={dateGroup.items}
                        />
                    ))}

                    <View style={styles.bottomSpacing} />
                </ScrollView>
            )}
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
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
        },
        backButton: {
            padding: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
        },
        placeholder: {
            width: 40,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        loadingText: {
            fontSize: 16,
            color: colors.textSecondary,
            marginTop: 16,
        },
        errorContainer: {
            margin: 20,
            padding: 16,
            backgroundColor: '#FFF5F5',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#FED7D7',
        },
        errorText: {
            fontSize: 14,
            color: '#E53E3E',
            textAlign: 'center',
            marginBottom: 12,
        },
        retryButton: {
            backgroundColor: '#E53E3E',
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 8,
            alignSelf: 'center',
        },
        retryText: {
            fontSize: 14,
            color: '#fff',
            fontWeight: '500',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginTop: 16,
            marginBottom: 8,
        },
        emptyDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
        },
        scrollView: {
            flex: 1,
        },
        summaryContainer: {
            margin: 20,
            marginBottom: 10,
            padding: 20,
            backgroundColor: colors.secondary,
            borderRadius: 16,
            alignItems: 'center',
        },
        summaryTitle: {
            fontSize: 14,
            color: '#fff',
            opacity: 0.9,
            marginBottom: 4,
        },
        summaryCount: {
            fontSize: 32,
            fontWeight: '700',
            color: '#fff',
        },
        dateSection: {
            marginHorizontal: 20,
            marginBottom: 20,
        },
        dateHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border || '#E5E5E5',
        },
        dateTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginLeft: 8,
            flex: 1,
        },
        dateCount: {
            fontSize: 12,
            color: colors.textSecondary,
            backgroundColor: colors.card || '#F5F5F5',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        dateItems: {
            gap: 8,
        },
        historyItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card || '#F5F5F5',
            padding: 16,
            borderRadius: 12,
            marginBottom: 4,
        },
        historyItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        dishIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.secondary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        dishInfo: {
            flex: 1,
        },
        dishName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
            lineHeight: 20,
        },
        dishMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        metaText: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        difficultyText: {
            fontSize: 12,
            fontWeight: '500',
            textTransform: 'capitalize',
        },
        historyItemRight: {
            alignItems: 'flex-end',
        },
        caloriesContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: 4,
        },
        caloriesText: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.secondary,
        },
        caloriesUnit: {
            fontSize: 12,
            color: colors.secondary,
            marginLeft: 2,
        },
        timeText: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        dateSummary: {
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border || '#E5E5E5',
            alignItems: 'center',
        },
        dateSummaryText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.secondary,
        },
        bottomSpacing: {
            height: 20,
        },
    })