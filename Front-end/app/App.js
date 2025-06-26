import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { store } from '@redux/store';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from '@navigations/StackNavigator';

import { ThemeProvider } from '@contexts/ThemeProvider';
import { AuthProvider } from '@contexts/AuthContext';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
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
