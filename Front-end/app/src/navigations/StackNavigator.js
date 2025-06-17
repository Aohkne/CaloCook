import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '@screens/(auth)/LoginScreen'
import TabNavigator from '@navigations/TabNavigator'
import FilterScreen from '@screens/FilterScreen'
import ChangePasswordScreen from '@screens/ChangePasswordScreen'
import Detail from '@screens/Detail'

const Stack = createNativeStackNavigator()

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='MainTabs' component={TabNavigator} />
      <Stack.Screen name='FilterScreen' component={FilterScreen} />
      <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
      <Stack.Screen name='Detail' component={Detail} />
    </Stack.Navigator>
  )
}