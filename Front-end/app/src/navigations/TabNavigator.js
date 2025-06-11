import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Compass, User, Heart, Soup } from 'lucide-react-native'

import { useTheme } from '@contexts/ThemeProvider'

// Import screens
import ExploreScreen from '@screens/ExploreScreen'
import FavoritesScreen from '@screens/FavoritesScreen'
import DishScreen from '@screens/DishScreen'
import ProfileScreen from '@screens/ProfileScreen'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent

          switch (route.name) {
            case 'Explore':
              IconComponent = Compass
              break
            case 'Favorites':
              IconComponent = Heart
              break
            case 'Dish':
              IconComponent = Soup
              break
            case 'Profile':
              IconComponent = User
              break
            default:
              IconComponent = Compass
          }

          const fillColor = () => {
            if ((route.name === 'Favorites' || route.name === 'Dish' || route.name === 'Profile') && focused) {
              return color
            }
            return 'transparent'
          }

          return <IconComponent size={25} color={color} fill={fillColor()} />
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
      <Tab.Screen name='Explore' component={ExploreScreen} options={{ tabBarLabel: 'Explore' }} />
      <Tab.Screen name='Favorites' component={FavoritesScreen} options={{ tabBarLabel: 'Favorites' }} />
      <Tab.Screen name='Dish' component={DishScreen} options={{ tabBarLabel: 'Dish' }} />
      <Tab.Screen name='Profile' component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  )
}
