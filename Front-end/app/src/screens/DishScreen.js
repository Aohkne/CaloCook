import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeProvider';
import { getAllDish } from '@services/dish';

export default function DishScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dish = await getAllDish();
      if (dish) setDishes(dish.data);
      console.log(dish.data);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dish</Text>
      </View>

      {dishes.map((dish, index) => (
        <Text key={index} style={{ color: colors.title }}>
          {dish.name}
        </Text>
      ))}
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 25,
      paddingHorizontal: 20,
      backgroundColor: colors.background
    },
    header: {
      marginBottom: 15
    },
    title: {
      color: colors.title,
      fontSize: 35,
      letterSpacing: 3,
      fontWeight: 700
    }
  });
