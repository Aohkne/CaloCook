import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useTheme } from '@contexts/ThemeProvider'
import { Search } from 'lucide-react-native'
import DishCard from '../components/Card'

export default function DishScreen({ navigation }) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: 'CHICKEN WITH EGG',
      time: '10 min',
      calories: '220 kcal',
      difficulty: 'Easy',
      ingredients: 'Egg, chicken, tomatoes, salad +1',
      image: require('../assets/img/testImage.png'),
      isLiked: false
    },
    {
      id: 2,
      name: 'VEGGIE SCRAMBLE',
      time: '15 min',
      calories: '180 kcal',
      difficulty: 'Medium',
      ingredients: 'Eggs, vegetables, herbs, cheese',
      image: require('../assets/img/testImage.png'),
      isLiked: false
    },
    {
      id: 3,
      name: 'VEGGIE SCRAMBLE',
      time: '15 min',
      calories: '180 kcal',
      difficulty: 'Hard',
      ingredients: 'Eggs, vegetables, herbs, cheese',
      image: require('../assets/img/testImage.png'),
      isLiked: false
    }
  ])

  // Xử lý khi nhấn vào icon heart
  const handleHeartPress = (dishId) => {
    setDishes(prevDishes =>
      prevDishes.map(dish =>
        dish.id === dishId
          ? { ...dish, isLiked: !dish.isLiked }
          : dish
      )
    )
  }

  // Xử lý khi nhấn vào card - Navigate to Detail
  const handleCardPress = (dish) => {
    navigation.navigate('Detail', { dish })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dish</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('FilterScreen')}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onHeartPress={handleHeartPress}
            onCardPress={handleCardPress}
          />
        ))}
      </ScrollView>
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
    scrollView: {
      flex: 1,
      paddingHorizontal: 20
    },
    scrollContent: {
      paddingTop: 0,
      paddingBottom: 20,
    }
  })