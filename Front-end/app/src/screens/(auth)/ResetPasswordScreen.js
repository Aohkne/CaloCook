import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError, clearMessage } from '@/redux/slices/authSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeProvider';

export default function ResetPasswordScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState('');
  const { isLoading, error, message } = useSelector((state) => state.auth);
  const email = route.params?.email || '';
  const [otp, setOtp] = useState('');

  const handleReset = async () => {
    if (!password || password.length < 6) {
      return Alert.alert('Validation Error', 'Password must be at least 6 characters.');
    }
    try {
      const payloadPassword = password.trim();
      const result = await dispatch(resetPassword({ otp, email, password: payloadPassword })).unwrap();
      Alert.alert('Success', 'Password reset successful. Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to reset password.');
    }
  };

  useEffect(() => {
    if (message) {
      dispatch(clearMessage());
    }
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [message, error]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Login')} disabled={isLoading}>
        <Text style={styles.homeIcon}>🏠</Text>
      </TouchableOpacity>
      <View style={styles.box}>
        <Text style={styles.title}>Enter New Password</Text>

        <TextInput
          placeholder='OTP'
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
          keyboardType='numeric'
          style={styles.input}
        />
        <TextInput
          placeholder='New Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
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
      width: 355,
      padding: 35,
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
      width: 325,
      height: 51,
      borderRadius: 16,
      backgroundColor: '#F2F1EB',
      paddingHorizontal: 16,
      fontWeight: '500',
      marginBottom: 16
    },
    button: {
      backgroundColor: colors.secondary,
      width: 325,
      height: 51,
      borderRadius: 76,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonText: {
      color: colors.white,
      fontWeight: '600',
      fontSize: 16
    },
    buttonText: {
      color: colors.white,
      fontWeight: '600',
      fontSize: 16
    },
    // new home button (rounded with icon)
    homeButton: {
      position: 'absolute',
      top: 240,
      width: 55,
      height: 55,
      borderRadius: 27.5,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20
    },
    homeIcon: {
      color: colors.white,
      fontSize: 30,
      lineHeight: 30,
      textAlign: 'center'
    }
  });
