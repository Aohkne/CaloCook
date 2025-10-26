import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/contexts/AuthContext';

//TAB
import TabNavigator from '@navigations/TabNavigator';

//AUTH
import LoginScreen from '@screens/(auth)/LoginScreen';
import SignUpScreen from '@screens/(auth)/SignUpScreen';
import ForgotPasswordScreen from '@/screens/(auth)/ForgotPasswordScreen';

//SCREEN
import OnboardingScreen from '@/screens/OnboardingScreen';
import FilterScreen from '@screens/FilterScreen';
import ChangePasswordScreen from '@screens/ChangePasswordScreen';
import HistoryScreen from '@screens/HistoryScreen';
import Detail from '@screens/Detail';
import ResetPasswordScreen from '@/screens/(auth)/ResetPasswordScreen';
import ChatScreen from '@/screens/ChatScreen';
import NutritionAnalyzeScreen from '@/screens/NutritionAnalyzeScreen';
import LeaderboardScreen from '@/screens/LeaderBoardScreen';
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isAuthenticated, hasSeenOnboarding } = useAuth();

  if (hasSeenOnboarding === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name='MainTabs' component={TabNavigator} options={{ animationEnabled: false }} />
          <Stack.Screen name='Detail' component={Detail} />
          <Stack.Screen name='FilterScreen' component={FilterScreen} />
          <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
          <Stack.Screen name='History' component={HistoryScreen} />
          <Stack.Screen name='Chat' component={ChatScreen} />
          <Stack.Screen name='Nutrition' component={NutritionAnalyzeScreen} />
          <Stack.Screen name='Leaderboard' component={LeaderboardScreen} />
        </>
      ) : hasSeenOnboarding ? (
        //  onboarding seen
        <>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
          <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
        </>
      ) : (
        // onboarding not seen
        <>
          <Stack.Screen name='Onboarding' component={OnboardingScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
          <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
