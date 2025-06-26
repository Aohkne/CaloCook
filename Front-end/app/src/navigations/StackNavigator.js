import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/contexts/AuthContext';

//TAB
import TabNavigator from '@navigations/TabNavigator';

//AUTH
import LoginScreen from '@screens/(auth)/LoginScreen';
import SignUpScreen from '@screens/(auth)/SignUpScreen';

//SCREEN
import FilterScreen from '@screens/FilterScreen';
import ChangePasswordScreen from '@screens/ChangePasswordScreen';
import Detail from '@screens/Detail';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name='MainTabs' component={TabNavigator} options={{ animationEnabled: false }} />
          <Stack.Screen name='Detail' component={Detail} />
          <Stack.Screen name='FilterScreen' component={FilterScreen} />
          <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
