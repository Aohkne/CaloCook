import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { changePassword } from '@/services/auth'; // ✅ Adjust path as needed
import { useTheme } from '@/contexts/ThemeProvider';

export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params; // Token passed via navigation params
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 6) {
      return Alert.alert('Validation Error', 'Password must be at least 6 characters.');
    }

    try {
      setLoading(true);
      await changePassword({ token, password });
      Alert.alert('Success', 'Password reset successful. Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Enter New Password</Text>

        <TextInput
          placeholder='New Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Reset Password</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center'
    },
    box: {
      width: 343,
      padding: 32,
      borderRadius: 16,
      backgroundColor: colors.white,
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 5
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center'
    },
    input: {
      width: 343,
      height: 51,
      borderRadius: 16,
      backgroundColor: '#F2F1EB',
      paddingHorizontal: 16,
      fontWeight: '500',
      marginBottom: 16
    },
    button: {
      backgroundColor: colors.secondary,
      width: 343,
      height: 51,
      borderRadius: 76,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonText: {
      color: colors.white,
      fontWeight: '600',
      fontSize: 16
    }
  });
