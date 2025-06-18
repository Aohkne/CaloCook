import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { ThemeProvider } from '@contexts/ThemeProvider';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from '@navigations/StackNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
