import React from 'react'

import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@contexts/ThemeProvider'

export default function DishScreen() {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dish</Text>
      </View>
    </SafeAreaView>
  )
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
  })
