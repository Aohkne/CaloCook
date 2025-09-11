import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearMessage } from '@/redux/slices/authSlice'; 
import logoFull from '@/assets/logo.png'; 
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeProvider';

export default function ForgotPasswordScreen() {
  const dispatch = useDispatch();
  const { colors, toggleTheme, isDark } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { isLoading, error, message } = useSelector((state) => state.auth);

  const handleSend = async () => {
    if (!email) {
      return Alert.alert('Validation Error', 'Please enter your email.');
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Validation Error', 'Please enter a valid email.');
    }
    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      navigation.navigate('ResetPassword', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  useEffect(() => {
    if (message) {
      setSent(true);
      dispatch(clearMessage());
    }
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [message, error]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
        {isDark ? <Moon size={24} color='#4A90E2' /> : <Sun size={24} color='#FFA500' />}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          flexDirection: 'row',
          alignItems: 'center'
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <ChevronLeft color={colors.secondary} />
        <Text style={{ fontSize: 14, color: colors.secondary, fontWeight: 600 }}>Back to Login</Text>
      </TouchableOpacity>
      <View style={styles.box}>
        <Image source={logoFull} style={styles.logo} resizeMode='contain' />
        {sent ? (
          <>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.description}>We've sent you an email to reset your password!</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Forgot Your Password?</Text>
            <Text style={styles.description}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            <TextInput
              placeholder='Email'
              placeholderTextColor={colors.inputPlaceHolder}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
              style={[styles.input, { marginBottom: 10 }]}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              onPress={handleSend}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color={'#ffffff'} /> : <Text style={styles.buttonText}>Send</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center'
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center'
    },
    box: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: 343
    },
    themeToggleButton: {
      position: 'absolute',
      top: 50,
      right: 20
    },
    logo: {
      width: 200,
      height: 80,
      marginBottom: 28
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
      color: colors.title
    },
    description: {
      fontSize: 14,
      color: colors.description,
      marginBottom: 24,
      textAlign: 'center'
    },
    input: {
      backgroundColor: colors.inputBg,
      borderColor: colors.inputBorder,
      borderWidth: 1,
      borderRadius: 16,
      width: 343,
      height: 51,
      paddingHorizontal: 10,
      color: colors.inputText
    },
    button: {
      backgroundColor: colors.secondary,
      width: 343,
      height: 49,
      justifyContent: 'center',
      borderRadius: 76
    },
    buttonText: {
      textAlign: 'center',
      color: colors.white,
      fontSize: 14,
      fontWeight: 600
    }
  });
