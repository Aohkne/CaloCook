import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Compass, User, Heart, Soup } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '@contexts/ThemeProvider';

// Screens
import ExploreScreen from '@screens/ExploreScreen';
import FavoritesScreen from '@screens/FavoritesScreen';
import DishScreen from '@screens/DishScreen';
import ProfileScreen from '@screens/ProfileScreen';

import ChatBotModal from '@components/ChatBot';
import CenterNavigator from '@/navigations/CenterNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [openChat, setOpenChat] = useState(false);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleCenterTabChange = (tabName) => {
    navigation.navigate(tabName);
  };

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
              case 'Center':
                return null;
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
          tabBarInactiveTintColor: colors.description + '80',
          tabBarLabelActiveTintColor: colors.secondary,
          tabBarLabelInactiveTintColor: colors.description + '80',
          tabBarStyle: {
            height: 80,
            paddingBottom: 10,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: colors.border + '20',
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
        <Tab.Screen
          name='Center'
          component={''}
          options={{
            tabBarLabel: '',
            tabBarButton: () => null
          }}
        />
        <Tab.Screen name='Dish' component={DishScreen} options={{ tabBarLabel: 'Dish' }} />
        <Tab.Screen name='Profile' component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
      </Tab.Navigator>

      {/* CENTER NAVIGATION */}
      <CenterNavigator onTabChange={handleCenterTabChange} />

      {/* CHAT BOT */}
      <TouchableWithoutFeedback style={styles.botButton} onPress={() => setOpenChat(true)}>
        <Image source={require('@assets/chat/bot.png')} style={styles.botImage} />
      </TouchableWithoutFeedback>

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
