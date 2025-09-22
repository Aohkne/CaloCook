import { useState } from 'react';
import { ChevronLeft, Eye, EyeClosed, Moon, Sun } from 'lucide-react-native';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { register } from '@/redux/slices/authSlice';
import { useTheme } from '@/contexts/ThemeProvider';

export default function SignUpScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const styles = createStyles(colors);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userData = {
        username: username.trim(),
        email: email.trim(),
        password: password
      };

      await dispatch(register(userData)).unwrap();

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Sign up failed', error.message || 'Unable to log in');
    }
  };
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
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Image style={styles.logo} source={require('@assets/login/logo-removebg-preview 2.png')} />
          <Text style={[styles.bigText, { marginBottom: 10 }]}>Create a meal plan on the go</Text>
          <Text style={[styles.smallText, { marginBottom: 40 }]}>
            Choose dishes, view recipes, add to favorites, and create a meal plan
          </Text>

          <TextInput
            style={[styles.input, { marginBottom: 10 }]}
            placeholder='Email'
            placeholderTextColor={colors.inputPlaceHolder}
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
          />
          <TextInput
            style={[styles.input, { marginBottom: 10 }]}
            placeholder='Username'
            placeholderTextColor={colors.inputPlaceHolder}
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
          />
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.input, { paddingRight: 50, marginBottom: 10 }]}
              placeholder='Password'
              placeholderTextColor={colors.inputPlaceHolder}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              textContentType='password'
            />
            {showPassword ? (
              <Eye
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '40%',
                  transform: [{ translateY: '-50%' }]
                }}
                color={colors.inputText}
                size={24}
                onPress={handleShowPassword}
              />
            ) : (
              <EyeClosed
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '40%',
                  transform: [{ translateY: '-50%' }]
                }}
                color={colors.inputText}
                size={24}
                onPress={handleShowPassword}
              />
            )}
          </View>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.input, { paddingRight: 50, marginBottom: 10 }]}
              placeholder='Confirm Password'
              placeholderTextColor={colors.inputPlaceHolder}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              textContentType='password'
            />
            {showConfirmPassword ? (
              <Eye
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '40%',
                  transform: [{ translateY: '-50%' }]
                }}
                color={colors.inputText}
                size={24}
                onPress={handleShowConfirmPassword}
              />
            ) : (
              <EyeClosed
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '40%',
                  transform: [{ translateY: '-50%' }]
                }}
                color={colors.inputText}
                size={24}
                onPress={handleShowConfirmPassword}
              />
            )}
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              width: '100%'
            }}
          ></View>
          <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* <View style={styles.lineContainer}>
          <View style={styles.line}></View>
          <Text style={{ opacity: 0.6, fontSize: 16 }}>OR</Text>
          <View style={styles.line}></View>
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity> */}
        </KeyboardAvoidingView>
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
      width: 100,
      height: 100
    },
    bigText: {
      fontSize: 32,
      fontWeight: 700,
      textAlign: 'center',
      color: colors.title
    },
    smallText: {
      fontSize: 16,
      color: colors.description,
      width: 343,
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
    },
    googleButton: {
      width: 343,
      height: 60,
      backgroundColor: 'rgba(8, 14, 45, 0.04)',
      borderColor: 'rgba(8, 14, 45, 0.06)',
      borderWidth: 1,
      borderRadius: 76,
      justifyContent: 'center',
      marginBottom: 20
    },
    googleButtonText: {
      fontWeight: 600,
      textAlign: 'center'
    },
    line: {
      width: 144.5,
      height: 2,
      borderColor: 'rgba(8, 14, 45, 0.06)',
      borderWidth: 1
    },
    lineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      marginVertical: 15
    },
    link: {
      color: colors.secondary,
      fontWeight: 900
    }
  });
