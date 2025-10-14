import React, { useState, useRef, useCallback, useMemo } from 'react'
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
import { X, Search, ChevronRight, RotateCcw } from 'lucide-react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    getFilteredDishes, resetDishes, getIngredients
} from '@redux/slices/dishSlice'

export default function FilterScreen({ navigation }) {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const dispatch = useDispatch()

    // Get user from Redux
    const { user } = useSelector(state => state.auth)

    const [searchText, setSearchText] = useState('')
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [selectedDifficulty, setSelectedDifficulty] = useState([])
    const [cookingTime, setCookingTime] = useState([5, 60]) // min - max in minutes
    const [calories, setCalories] = useState([5, 2000]) // THAY ĐỔI TỪ [140, 450] THÀNH [5, 2000]
    const [timeSliderWidth, setTimeSliderWidth] = useState(0)
    const [calorieSliderWidth, setCalorieSliderWidth] = useState(0)
    const [randomIngredients, setRandomIngredients] = useState([])
    const [showIngredientSuggestions, setShowIngredientSuggestions] = useState(false)
    const [ingredientSearchText, setIngredientSearchText] = useState('')

    // Static ingredients list
    const staticIngredients = [
        'Eggs', 'Chicken', 'Tomatoes', 'Rice', 'Pasta', 'Cream',
        'Beef', 'Pork', 'Fish', 'Shrimp', 'Cheese', 'Milk',
        'Onion', 'Garlic', 'Carrot', 'Potato', 'Mushroom', 'Spinach'
    ]

    const { ingredients, isLoadingIngredients } = useSelector(state => state.dish)

    // Memoize available ingredients to prevent unnecessary recalculations
    const availableIngredients = useMemo(() => {
        return ingredients.length > 0
            ? ingredients.map(ing => ing.name || ing).filter(Boolean)
            : staticIngredients
    }, [ingredients])

    // Filter ingredients based on search text
    const filteredIngredients = useMemo(() => {
        if (!ingredientSearchText.trim()) return []
        return availableIngredients.filter(ingredient =>
            ingredient.toLowerCase().includes(ingredientSearchText.toLowerCase()) &&
            !selectedIngredients.includes(ingredient)
        ).slice(0, 10) // Limit to 10 suggestions
    }, [availableIngredients, ingredientSearchText, selectedIngredients])

    // Function to get 5 random ingredients - memoized with useCallback
    const getRandomIngredients = useCallback((ingredientsList, count = 5) => {
        if (!ingredientsList || ingredientsList.length === 0) return []

        const shuffled = [...ingredientsList].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, Math.min(count, ingredientsList.length))
    }, [])

    // Load ingredients once when component mounts
    React.useEffect(() => {
        dispatch(getIngredients())
    }, [dispatch])

    // Set random ingredients when available ingredients change
    React.useEffect(() => {
        if (availableIngredients.length > 0) {
            const randomSelected = getRandomIngredients(availableIngredients, 5)
            setRandomIngredients(randomSelected)
        }
    }, [availableIngredients, getRandomIngredients])

    const toggleIngredient = useCallback((ingredient) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(item => item !== ingredient)
                : [...prev, ingredient]
        )
        // Clear ingredient search when adding
        setIngredientSearchText('')
        setShowIngredientSuggestions(false)
    }, [])

    const removeIngredient = useCallback((ingredientToRemove) => {
        setSelectedIngredients(prev => prev.filter(item => item !== ingredientToRemove))
    }, [])

    const toggleDifficulty = useCallback((difficulty) => {
        setSelectedDifficulty(prev =>
            prev.includes(difficulty)
                ? prev.filter(item => item !== difficulty)
                : [...prev, difficulty]
        )
    }, [])

    const formatTime = useCallback((minutes) => {
        if (minutes < 60) {
            return `${minutes} min`
        } else {
            const hours = Math.floor(minutes / 60)
            const mins = minutes % 60
            return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
        }
    }, [])

    // Function to refresh random ingredients
    const refreshRandomIngredients = useCallback(() => {
        const newRandomSelected = getRandomIngredients(availableIngredients, 5)
        setRandomIngredients(newRandomSelected)
        // Don't clear selected ingredients, just refresh the random suggestions
    }, [availableIngredients, getRandomIngredients])

    // Handle search text change
    const handleSearchTextChange = useCallback((text) => {
        setSearchText(text)

        // Extract potential ingredients from search text
        const words = text.split(/[,\s]+/).filter(word => word.trim().length > 0)
        const lastWord = words[words.length - 1]?.trim() || ''

        // If the last word might be an ingredient, show suggestions
        if (lastWord.length >= 2) {
            setIngredientSearchText(lastWord)
            setShowIngredientSuggestions(true)
        } else {
            setIngredientSearchText('')
            setShowIngredientSuggestions(false)
        }
    }, [])

    // Add ingredient from suggestion
    const addIngredientFromSuggestion = useCallback((ingredient) => {
        // Add to selected ingredients
        if (!selectedIngredients.includes(ingredient)) {
            setSelectedIngredients(prev => [...prev, ingredient])
        }

        // Update search text - remove the last word and add the ingredient
        const words = searchText.split(/[,\s]+/).filter(word => word.trim().length > 0)
        const newWords = words.slice(0, -1) // Remove last word
        const newSearchText = newWords.length > 0 ? newWords.join(' ') + ' ' : ''

        setSearchText(newSearchText)
        setIngredientSearchText('')
        setShowIngredientSuggestions(false)
    }, [searchText, selectedIngredients])

    const applyFilters = useCallback(async () => {
        try {
            dispatch(resetDishes())

            const filters = {
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                order: 'desc'
            }

            // User ID
            if (user?._id) {
                filters.userId = user._id;
            }

            // Xử lý search text và ingredients riêng biệt
            let cleanSearchText = '';
            if (searchText.trim()) {
                cleanSearchText = searchText.trim()

                // Remove selected ingredients from search text
                selectedIngredients.forEach(ingredient => {
                    const regex = new RegExp(`\\b${ingredient}\\b`, 'gi')
                    cleanSearchText = cleanSearchText.replace(regex, '').trim()
                })

                // Clean up extra spaces and commas
                cleanSearchText = cleanSearchText.replace(/[,\s]+/g, ' ').trim()
            }

            // Apply other filters to base filters
            if (cookingTime[0] !== 5 || cookingTime[1] !== 60) {
                filters.minCookingTime = cookingTime[0];
                filters.maxCookingTime = cookingTime[1];
            }
            // THAY ĐỔI ĐIỀU KIỆN KIỂM TRA CALORIES
            if (calories[0] !== 5 || calories[1] !== 2000) {
                filters.minCalorie = calories[0];
                filters.maxCalorie = calories[1];
            }
            if (selectedDifficulty.length > 0) {
                filters.difficulty = selectedDifficulty;
            }

            // Nếu có cả search text và ingredients
            if (cleanSearchText && selectedIngredients.length > 0) {
                // Tạo promise để gọi song song thay vì tuần tự
                const [nameResult, ingredientDishIds] = await Promise.all([
                    //Fetch dishes by name
                    dispatch(getFilteredDishes({
                        ...filters,
                        name: cleanSearchText
                    })),

                    //Get dish IDs from ingredients (không cần fetch full dishes)
                    Promise.resolve().then(() => {
                        if (ingredients.length > 0) {
                            const dishIds = new Set();
                            selectedIngredients.forEach(selectedIngredient => {
                                const foundIngredients = ingredients.filter(
                                    ingredient => (ingredient.name || ingredient) === selectedIngredient
                                );
                                foundIngredients.forEach(ingredient => {
                                    if (ingredient.dishId) {
                                        dishIds.add(ingredient.dishId);
                                    }
                                });
                            });
                            return Array.from(dishIds);
                        }
                        return [];
                    })
                ]);

                // Combine results
                const allDishIds = new Set();

                // Add dishes from name search
                if (nameResult.payload?.data) {
                    nameResult.payload.data.forEach(dish => {
                        allDishIds.add(dish.id || dish._id);
                    });
                }

                // Add dish IDs from ingredients
                ingredientDishIds.forEach(dishId => {
                    allDishIds.add(dishId);
                });

                // Fetch final filtered results với dishIds
                if (allDishIds.size > 0) {
                    filters.dishIds = Array.from(allDishIds);
                    const result = await dispatch(getFilteredDishes(filters));
                    navigation.goBack();
                    return;
                }
            }
            // Chỉ có search text
            else if (cleanSearchText) {
                filters.name = cleanSearchText;
            }
            // Chỉ có ingredients
            else if (selectedIngredients.length > 0) {
                if (ingredients.length > 0) {
                    const dishIds = new Set();

                    selectedIngredients.forEach(selectedIngredient => {
                        const foundIngredients = ingredients.filter(
                            ingredient => (ingredient.name || ingredient) === selectedIngredient
                        );

                        foundIngredients.forEach(ingredient => {
                            if (ingredient.dishId) {
                                dishIds.add(ingredient.dishId);
                            }
                        });
                    });

                    if (dishIds.size > 0) {
                        filters.dishIds = Array.from(dishIds);
                    }
                } else {
                    // Fallback: sử dụng ingredients như query parameter
                    filters.ingredients = selectedIngredients;
                }
            }

            const result = await dispatch(getFilteredDishes(filters));
            navigation.goBack();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }, [dispatch, user, searchText, selectedIngredients, ingredients, cookingTime, calories, selectedDifficulty, navigation])

    const clearAllFilters = useCallback(() => {
        setSearchText('')
        setSelectedIngredients([])
        setSelectedDifficulty([])
        setCookingTime([5, 60])
        setCalories([5, 2000]) // THAY ĐỔI RESET VALUE
        setIngredientSearchText('')
        setShowIngredientSuggestions(false)
        // Không refresh random ingredients khi clear all
    }, [])

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
            const thumbWidth = 20; // Thumb width from styles
            const availableWidth = sliderWidth - thumbWidth;
            return ((value - min) / (max - min)) * availableWidth
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

    const IngredientTag = React.memo(({ ingredient, isSelected, onPress, showRemove = false, onRemove }) => (
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
            {showRemove && isSelected && (
                <TouchableOpacity
                    style={styles.removeIngredientButton}
                    onPress={(e) => {
                        e.stopPropagation()
                        onRemove(ingredient)
                    }}
                >
                    <X size={14} color="#fff" />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    ))

    const DifficultyButton = React.memo(({ difficulty, isSelected, onPress }) => (
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
    ))

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearAllFilters}
                    >
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.goBack()}
                    >
                        <X size={24} color={colors.title} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Combined Search */}
                <Text style={styles.sectionTitle}>Search</Text>
                <View style={styles.searchContainer}>
                    <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search dish name or ingredients..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchText}
                        onChangeText={handleSearchTextChange}
                        onFocus={() => {
                            if (ingredientSearchText.length >= 2) {
                                setShowIngredientSuggestions(true)
                            }
                        }}
                    />
                </View>

                {/* Ingredient Suggestions */}
                {showIngredientSuggestions && filteredIngredients.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        <Text style={styles.suggestionsTitle}>Add ingredients:</Text>
                        <View style={styles.suggestionsWrapper}>
                            {filteredIngredients.map((ingredient, index) => (
                                <TouchableOpacity
                                    key={`suggestion-${ingredient}-${index}`}
                                    style={styles.suggestionItem}
                                    onPress={() => addIngredientFromSuggestion(ingredient)}
                                >
                                    <Text style={styles.suggestionText}>{ingredient}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Selected Ingredients Display */}
                {selectedIngredients.length > 0 && (
                    <View style={styles.selectedIngredientsContainer}>
                        <Text style={styles.selectedIngredientsTitle}>Selected Ingredients:</Text>
                        <View style={styles.selectedIngredientsWrapper}>
                            {selectedIngredients.map((ingredient, index) => (
                                <IngredientTag
                                    key={`selected-${ingredient}-${index}`}
                                    ingredient={ingredient}
                                    isSelected={true}
                                    onPress={() => { }}
                                    showRemove={true}
                                    onRemove={removeIngredient}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Contains products suggestions */}
                <View style={styles.containsProductsHeader}>
                    <Text style={styles.sectionTitle}>Quick ingredient suggestions</Text>

                </View>

                {/* Random 5 Ingredients */}
                <View style={styles.tagsContainer}>
                    {randomIngredients.map((ingredient, index) => (
                        <IngredientTag
                            key={`random-${ingredient}-${index}`}
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
                            isSelected={selectedDifficulty.includes(difficulty)}
                            onPress={() => toggleDifficulty(difficulty)}
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

                {/* Dish Calories - THAY ĐỔI MIN/MAX/STEP */}
                <Text style={styles.sectionTitle}>Dish calories</Text>
                <CustomRangeSlider
                    values={calories}
                    onValuesChange={setCalories}
                    min={5}
                    max={2000}
                    step={5}
                    formatLabel={(min, max) => `${min} - ${max} kcal`}
                    sliderWidth={calorieSliderWidth}
                    onLayout={(event) => setCalorieSliderWidth(event.nativeEvent.layout.width)}
                />
            </ScrollView>

            {/* Show Results Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.showResultsButton}
                    onPress={applyFilters}
                >
                    <Text style={styles.showResultsText}>Apply Filters</Text>
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
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        clearButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: colors.card || '#F5F5F5',
        },
        clearButtonText: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
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
        containsProductsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
            marginBottom: 16,
        },
        refreshButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.secondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        refreshButtonText: {
            fontSize: 12,
            color: '#fff',
            fontWeight: '500',
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
        suggestionsContainer: {
            backgroundColor: colors.card || '#F5F5F5',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
        },
        suggestionsTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
        },
        suggestionsWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        suggestionItem: {
            backgroundColor: colors.background,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.secondary,
        },
        suggestionText: {
            fontSize: 12,
            color: colors.secondary,
            fontWeight: '500',
        },
        selectedIngredientsContainer: {
            marginBottom: 16,
        },
        selectedIngredientsTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
        },
        selectedIngredientsWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
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
            backgroundColor: colors.secondary,
            borderColor: colors.secondary,
        },
        ingredientText: {
            fontSize: 14,
            color: colors.text,
        },
        ingredientTextSelected: {
            color: '#fff',
        },
        removeIngredientButton: {
            marginLeft: 6,
            padding: 2,
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
            backgroundColor: colors.secondary,
            borderColor: colors.secondary,
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
            backgroundColor: colors.secondary,
            borderRadius: 2,
            top: 0,
        },
        sliderThumb: {
            position: 'absolute',
            width: 20,
            height: 20,
            backgroundColor: colors.secondary,
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
            backgroundColor: colors.secondary,
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