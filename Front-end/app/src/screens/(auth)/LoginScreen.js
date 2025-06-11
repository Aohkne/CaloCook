import React, { useReducer } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@contexts/ThemeProvider'
import { useNavigation } from '@react-navigation/native'

export default function LoginScreen() {
  const { colors, toggleTheme } = useTheme()
  const styles = createStyles(colors)

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calocook App</Text>
        <Button title='Toggle Theme' onPress={toggleTheme} color={colors.primary} />
      </View>
      <Button title='Login' onPress={() => navigation.navigate('MainTabs')} color={colors.secondary} />
    </SafeAreaView>
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
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.secondary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text
    }
  })
