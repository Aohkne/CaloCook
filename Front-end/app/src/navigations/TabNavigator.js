import React, { useState } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Compass, User, Heart, Soup } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import { useTheme } from '@contexts/ThemeProvider';

// Import screens
import ExploreScreen from '@screens/ExploreScreen';
import FavoritesScreen from '@screens/FavoritesScreen';
import DishScreen from '@screens/DishScreen';
import Detail from '@screens/Detail';
import ProfileScreen from '@screens/ProfileScreen';
import ChangePasswordScreen from '@screens/ChangePasswordScreen'
import FilterScreen from '@screens/FilterScreen'

import ChatBotModal from '@components/ChatBot';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator()

export default function TabNavigator() {
  const [openChat, setOpenChat] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  const { colors } = useTheme();

  // Favorites Stack Navigator - Thêm stack navigator cho Favorites
  function FavoritesStackNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            }
          },
        }}
      >
        <Stack.Screen
          name="FavoritesMain"
          component={FavoritesScreen}
          listeners={{
            focus: () => setShowChatbot(true),
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          listeners={{
            focus: () => setShowChatbot(false),
            blur: () => setShowChatbot(true),
          }}
        />
      </Stack.Navigator>
    )
  }

  // Dish Stack Navigator
  function DishStackNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            }
          },
        }}
      >
        <Stack.Screen
          name="DishMain"
          component={DishScreen}
          listeners={{
            focus: () => setShowChatbot(true),
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          listeners={{
            focus: () => setShowChatbot(false),
            blur: () => setShowChatbot(true),
          }}
        />
        <Stack.Screen
          name="FilterScreen"
          component={FilterScreen}
          listeners={{
            focus: () => setShowChatbot(false),
            blur: () => setShowChatbot(true),
          }}
        />
      </Stack.Navigator>
    )
  }

  // Profile Stack Navigator
  function ProfileStackNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            }
          },
        }}
      >
        <Stack.Screen
          name="ProfileMain"
          component={ProfileScreen}
          listeners={{
            focus: () => setShowChatbot(true),
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          listeners={{
            focus: () => setShowChatbot(false),
            blur: () => setShowChatbot(true),
          }}
        />
      </Stack.Navigator>
    )
  }

  // Function to get tab bar visibility for Favorites stack
  function getFavoritesTabBarVisibility(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'FavoritesMain'
    return routeName !== 'Detail'
  }

  // Function to get tab bar visibility for Profile stack
  function getProfileTabBarVisibility(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileMain'
    return routeName !== 'ChangePassword'
  }

  // Function to get tab bar visibility for Dish stack
  function getDishTabBarVisibility(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'DishMain'
    return routeName !== 'FilterScreen' && routeName !== 'Detail'
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let IconComponent;

            switch (route.name) {
              case 'Explore':
                IconComponent = Compass;
                break;
              case 'Favorites':
                IconComponent = Heart;
                break;
              case 'Dish':
                IconComponent = Soup;
                break;
              case 'Profile':
                IconComponent = User;
                break;
              default:
                IconComponent = Compass;
            }

            const fillColor = () => {
              if ((route.name === 'Favorites' || route.name === 'Dish' || route.name === 'Profile') && focused) {
                return color;
              }
              return 'transparent';
            };

            return <IconComponent size={25} color={color} fill={fillColor()} />;
          },
          tabBarActiveTintColor: colors.secondary,
          tabBarInactiveTintColor: colors.black + '80',
          tabBarLabelActiveTintColor: colors.secondary,
          tabBarLabelActiveTintColor: colors.black + '80',
          tabBarStyle: {
            height: 80,
            paddingBottom: 10,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: colors.black + '20',
            backgroundColor: colors.background,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          },

          tabBarIconStyle: {
            marginBottom: 5
          },

          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: '500'
          },

          headerShown: false
        })}
      >
        <Tab.Screen
          name='Explore'
          component={ExploreScreen}
          options={{ tabBarLabel: 'Explore' }}
          listeners={{
            focus: () => setShowChatbot(true),
          }}
        />
        <Tab.Screen
          name='Favorites'
          component={FavoritesStackNavigator}
          options={({ route }) => ({
            tabBarLabel: 'Favorites',
            tabBarStyle: {
              display: getFavoritesTabBarVisibility(route) ? 'flex' : 'none',
              height: 80,
              paddingBottom: 10,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: colors.black + '20',
              backgroundColor: colors.background,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }
          })}
        />
        <Tab.Screen name='Dish'
          component={DishStackNavigator}
          options={({ route }) => ({
            tabBarLabel: 'Dish',
            tabBarStyle: {
              display: getDishTabBarVisibility(route) ? 'flex' : 'none',
              height: 80,
              paddingBottom: 10,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: colors.black + '20',
              backgroundColor: colors.background,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }
          })} />
        <Tab.Screen name='Profile'
          component={ProfileStackNavigator}
          options={({ route }) => ({
            tabBarLabel: 'Profile',
            tabBarStyle: {
              display: getProfileTabBarVisibility(route) ? 'flex' : 'none',
              height: 80,
              paddingBottom: 10,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: colors.black + '20',
              backgroundColor: colors.background,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }
          })} />
      </Tab.Navigator>

      {/* Chỉ hiển thị chatbot khi showChatbot = true */}
      {showChatbot && (
        <TouchableWithoutFeedback style={styles.botButton} onPress={() => setOpenChat(true)}>
          <Image source={require('@assets/chat/bot.png')} style={styles.botImage} />
        </TouchableWithoutFeedback>
      )}

      <ChatBotModal visible={openChat} onClose={() => setOpenChat(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  botImage: {
    position: 'absolute',
    bottom: 65,
    right: 10,
    width: 80,
    height: 85,
    zIndex: 10,
    opacity: 0.5
  }
});