import React, { useState, useRef, useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Pressable,
    SafeAreaView,
    PanResponder,
    Animated
} from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { X, Search, ChevronRight } from 'lucide-react-native';

export default function FilterScreen({ navigation }) {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const [searchText, setSearchText] = useState('')
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [selectedDifficulty, setSelectedDifficulty] = useState('Easy')
    const [cookingTime, setCookingTime] = useState([5, 60]) // min - max in minutes
    const [calories, setCalories] = useState([140, 450])
    const [timeSliderWidth, setTimeSliderWidth] = useState(0)
    const [calorieSliderWidth, setCalorieSliderWidth] = useState(0)

    const ingredients = ['Eggs', 'Chicken', 'Tomatoes', 'Rice', 'Pasta', 'Cream']

    const toggleIngredient = (ingredient) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(item => item !== ingredient)
                : [...prev, ingredient]
        )
    }

    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`
        } else {
            const hours = Math.floor(minutes / 60)
            const mins = minutes % 60
            return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
        }
    }

    const CustomRangeSlider = ({
        values,
        onValuesChange,
        min,
        max,
        step = 1,
        formatLabel,
        sliderWidth,
        onLayout
    }) => {
        const [isDragging, setIsDragging] = useState(null)
        const leftAnimValue = useRef(new Animated.Value(0)).current
        const rightAnimValue = useRef(new Animated.Value(0)).current
        const draggedValue = useRef(null)
        const currentValues = useRef(values)

        // Cập nhật animated values khi values thay đổi từ bên ngoài
        React.useEffect(() => {
            if (!sliderWidth || isDragging !== null) return

            const leftPosition = getPositionFromValue(values[0])
            const rightPosition = getPositionFromValue(values[1])

            leftAnimValue.setValue(leftPosition)
            rightAnimValue.setValue(rightPosition)
            currentValues.current = values
        }, [values, sliderWidth, isDragging])

        const constrainValue = useCallback((value) => {
            return Math.max(min, Math.min(max, Math.round(value / step) * step))
        }, [min, max, step])

        const getValueFromPosition = useCallback((position) => {
            const percentage = position / sliderWidth
            return min + percentage * (max - min)
        }, [min, max, sliderWidth])

        const getPositionFromValue = useCallback((value) => {
            return ((value - min) / (max - min)) * sliderWidth
        }, [min, max, sliderWidth])

        const createPanResponder = (thumbIndex) => {
            return PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,

                onPanResponderGrant: () => {
                    setIsDragging(thumbIndex)
                    draggedValue.current = currentValues.current[thumbIndex]
                },

                onPanResponderMove: (event, gestureState) => {
                    if (!sliderWidth) return

                    const currentPosition = getPositionFromValue(draggedValue.current) + gestureState.dx
                    const newValue = constrainValue(getValueFromPosition(currentPosition))
                    const newPosition = getPositionFromValue(newValue)

                    if (thumbIndex === 0) {
                        // Left thumb - can't go beyond right thumb
                        const constrainedValue = Math.min(newValue, currentValues.current[1])
                        const constrainedPosition = getPositionFromValue(constrainedValue)
                        leftAnimValue.setValue(constrainedPosition)
                        currentValues.current = [constrainedValue, currentValues.current[1]]
                    } else {
                        // Right thumb - can't go before left thumb
                        const constrainedValue = Math.max(newValue, currentValues.current[0])
                        const constrainedPosition = getPositionFromValue(constrainedValue)
                        rightAnimValue.setValue(constrainedPosition)
                        currentValues.current = [currentValues.current[0], constrainedValue]
                    }
                },

                onPanResponderRelease: () => {
                    setIsDragging(null)
                    draggedValue.current = null
                    // Chỉ cập nhật state một lần khi kết thúc drag
                    onValuesChange([...currentValues.current])
                }
            })
        }

        const leftPanResponder = createPanResponder(0)
        const rightPanResponder = createPanResponder(1)

        const handleTrackPress = (event) => {
            if (!sliderWidth || isDragging !== null) return

            const { locationX } = event.nativeEvent
            const newValue = constrainValue(getValueFromPosition(locationX))

            // Determine which thumb is closer
            const leftDist = Math.abs(newValue - currentValues.current[0])
            const rightDist = Math.abs(newValue - currentValues.current[1])

            const newValues = [...currentValues.current]
            const newPosition = getPositionFromValue(newValue)

            if (leftDist < rightDist) {
                const constrainedValue = Math.min(newValue, currentValues.current[1])
                newValues[0] = constrainedValue
                const constrainedPosition = getPositionFromValue(constrainedValue)

                Animated.timing(leftAnimValue, {
                    toValue: constrainedPosition,
                    duration: 150,
                    useNativeDriver: false,
                }).start()
            } else {
                const constrainedValue = Math.max(newValue, currentValues.current[0])
                newValues[1] = constrainedValue
                const constrainedPosition = getPositionFromValue(constrainedValue)

                Animated.timing(rightAnimValue, {
                    toValue: constrainedPosition,
                    duration: 150,
                    useNativeDriver: false,
                }).start()
            }

            currentValues.current = newValues
            onValuesChange(newValues)
        }

        if (!sliderWidth) {
            return (
                <View style={styles.customSliderContainer}>
                    <Text style={styles.sliderLabel}>
                        {formatLabel ? formatLabel(values[0], values[1]) : `${values[0]} - ${values[1]}`}
                    </Text>
                    <View
                        style={styles.sliderWrapper}
                        onLayout={onLayout}
                    >
                        <View style={styles.sliderTrack} />
                    </View>
                </View>
            )
        }

        // Sử dụng giá trị hiện tại để hiển thị label khi đang drag
        const displayValues = isDragging !== null ? currentValues.current : values

        return (
            <View style={styles.customSliderContainer}>
                <Text style={styles.sliderLabel}>
                    {formatLabel ? formatLabel(displayValues[0], displayValues[1]) : `${displayValues[0]} - ${displayValues[1]}`}
                </Text>
                <View
                    style={styles.sliderWrapper}
                    onLayout={onLayout}
                >
                    <TouchableOpacity
                        style={styles.sliderTrack}
                        activeOpacity={1}
                        onPress={handleTrackPress}
                    >
                        {/* Active range */}
                        <Animated.View style={[
                            styles.sliderRange,
                            {
                                left: leftAnimValue,
                                width: Animated.subtract(rightAnimValue, leftAnimValue)
                            }
                        ]} />

                        {/* Left thumb */}
                        <Animated.View
                            style={[
                                styles.sliderThumb,
                                {
                                    left: Animated.add(leftAnimValue, -10)
                                },
                                isDragging === 0 && styles.sliderThumbActive
                            ]}
                            {...leftPanResponder.panHandlers}
                        />

                        {/* Right thumb */}
                        <Animated.View
                            style={[
                                styles.sliderThumb,
                                {
                                    left: Animated.add(rightAnimValue, -10)
                                },
                                isDragging === 1 && styles.sliderThumbActive
                            ]}
                            {...rightPanResponder.panHandlers}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const IngredientTag = ({ ingredient, isSelected, onPress }) => (
        <TouchableOpacity
            style={[
                styles.ingredientTag,
                isSelected && styles.ingredientTagSelected
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.ingredientText,
                isSelected && styles.ingredientTextSelected
            ]}>
                {ingredient}
            </Text>
            {isSelected && (
                <X size={16} color="#fff" style={styles.closeIcon} />
            )}
        </TouchableOpacity>
    )

    const DifficultyButton = ({ difficulty, isSelected, onPress }) => (
        <TouchableOpacity
            style={[
                styles.difficultyButton,
                isSelected && styles.difficultyButtonSelected
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.difficultyText,
                isSelected && styles.difficultyTextSelected
            ]}>
                {difficulty}
            </Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.goBack()}
                >
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Contains products */}
                <Text style={styles.sectionTitle}>Contains products</Text>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={colors.textSecondary}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* Ingredients Tags */}
                <View style={styles.tagsContainer}>
                    {ingredients.map((ingredient) => (
                        <IngredientTag
                            key={ingredient}
                            ingredient={ingredient}
                            isSelected={selectedIngredients.includes(ingredient)}
                            onPress={() => toggleIngredient(ingredient)}
                        />
                    ))}
                </View>

                {/* Difficulty */}
                <Text style={styles.sectionTitle}>Difficulty</Text>
                <View style={styles.difficultyContainer}>
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                        <DifficultyButton
                            key={difficulty}
                            difficulty={difficulty}
                            isSelected={selectedDifficulty === difficulty}
                            onPress={() => setSelectedDifficulty(difficulty)}
                        />
                    ))}
                </View>

                {/* Cooking Time */}
                <Text style={styles.sectionTitle}>Cooking time</Text>
                <CustomRangeSlider
                    values={cookingTime}
                    onValuesChange={setCookingTime}
                    min={5}
                    max={120}
                    step={5}
                    formatLabel={(min, max) => `${formatTime(min)} - ${formatTime(max)}`}
                    sliderWidth={timeSliderWidth}
                    onLayout={(event) => setTimeSliderWidth(event.nativeEvent.layout.width)}
                />

                {/* Dish Calories */}
                <Text style={styles.sectionTitle}>Dish calories</Text>
                <CustomRangeSlider
                    values={calories}
                    onValuesChange={setCalories}
                    min={100}
                    max={500}
                    step={10}
                    formatLabel={(min, max) => `${min} - ${max} kcal`}
                    sliderWidth={calorieSliderWidth}
                    onLayout={(event) => setCalorieSliderWidth(event.nativeEvent.layout.width)}
                />
            </ScrollView>

            {/* Show Results Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.showResultsButton}
                    onPress={() => {
                        // Handle filter application
                        navigation.goBack()
                    }}
                >
                    <Text style={styles.showResultsText}>Show 256 dishes</Text>
                    <ChevronRight size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
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
        iconButton: {
            padding: 8
        },
        scrollView: {
            flex: 1,
            paddingHorizontal: 20,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textSecondary || '#666',
            marginTop: 24,
            marginBottom: 16,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card || '#F5F5F5',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
        },
        searchIcon: {
            marginRight: 12,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 8,
        },
        ingredientTag: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card || '#F5F5F5',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border || '#E5E5E5',
        },
        ingredientTagSelected: {
            backgroundColor: colors.secondary || '#00B894',
            borderColor: colors.secondary || '#00B894',
        },
        ingredientText: {
            fontSize: 14,
            color: colors.text,
        },
        ingredientTextSelected: {
            color: '#fff',
        },
        closeIcon: {
            marginLeft: 6,
        },
        difficultyContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 8,
        },
        difficultyButton: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: colors.card || '#F5F5F5',
            borderWidth: 1,
            borderColor: colors.border || '#E5E5E5',
            alignItems: 'center',
        },
        difficultyButtonSelected: {
            backgroundColor: colors.secondary || '#00B894',
            borderColor: colors.secondary || '#00B894',
        },
        difficultyText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
        },
        difficultyTextSelected: {
            color: '#fff',
        },
        sliderContainer: {
            marginBottom: 8,
        },
        customSliderContainer: {
            marginBottom: 24,
        },
        sliderLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 16,
        },
        sliderWrapper: {
            paddingHorizontal: 16,
            marginBottom: 16,
            height: 20,
            justifyContent: 'center',
        },
        sliderTrack: {
            height: 4,
            backgroundColor: colors.border || '#E5E5E5',
            borderRadius: 2,
            position: 'relative',
            width: '100%',
        },
        sliderRange: {
            position: 'absolute',
            height: 4,
            backgroundColor: colors.secondary || '#00B894',
            borderRadius: 2,
            top: 0,
        },
        sliderThumb: {
            position: 'absolute',
            width: 20,
            height: 20,
            backgroundColor: colors.secondary || '#00B894',
            borderRadius: 10,
            top: -8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
            zIndex: 2,
        },
        sliderThumbActive: {
            transform: [{ scale: 1.2 }],
            shadowOpacity: 0.3,
            elevation: 5,
        },
        bottomContainer: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: 16,
            backgroundColor: colors.background,
        },
        showResultsButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.secondary || '#00B894',
            paddingVertical: 16,
            borderRadius: 12,
            gap: 8,
        },
        showResultsText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#fff',
        },
    })