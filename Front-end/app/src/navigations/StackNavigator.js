import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@screens/(auth)/LoginScreen';
import SignUpScreen from '@screens/(auth)/SignUpScreen';
import TabNavigator from '@navigations/TabNavigator';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='MainTabs' component={TabNavigator} />
    </Stack.Navigator>
  );
}
