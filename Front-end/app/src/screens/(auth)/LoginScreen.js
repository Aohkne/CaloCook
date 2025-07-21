import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeClosed, Moon, Sun } from 'lucide-react-native';

import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import { useTheme } from '@/contexts/ThemeProvider';

export default function LoginScreen() {
  // Theme
  const { colors, toggleTheme, isDark } = useTheme();
  const styles = createStyles(colors);

  // Inputs
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Navigation
  const navigation = useNavigation();

  // Redux
  const dispatch = useDispatch();

  // Handlers
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        emailOrUsername: email.trim(),
        password: password
      };

      await dispatch(login(credentials)).unwrap();
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Unable to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
        {isDark ? <Moon size={24} color='#4A90E2' /> : <Sun size={24} color='#FFA500' />}
      </TouchableOpacity>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('@assets/login/logo-removebg-preview 2.png')} />
        <Text style={[styles.bigText, { marginBottom: 10 }]}>Create a meal plan on the go</Text>
        <Text style={[styles.smallText, { marginBottom: 40 }]}>
          Choose dishes, view recipes, add to favorites, and create a meal plan
        </Text>

        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder='Email or Username'
          placeholderTextColor={'rgba(8, 14, 45, 0.6)'}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
        />
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder='Password'
            placeholderTextColor={'rgba(8, 14, 45, 0.6)'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCompleteType='password'
          />
          {showPassword ? (
            <Eye
              style={{
                position: 'absolute',
                right: 15,
                top: '50%',
                transform: [{ translateY: '-50%' }]
              }}
              color='black'
              size={24}
              onPress={handleShowPassword}
            />
          ) : (
            <EyeClosed
              style={{
                position: 'absolute',
                right: 15,
                top: '50%',
                transform: [{ translateY: '-50%' }]
              }}
              color='black'
              size={24}
              onPress={handleShowPassword}
            />
          )}
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            width: '100%'
          }}
        >
          <Text onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
            Forgot Password
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Login...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.lineContainer}>
          <View style={styles.line}></View>
          <Text style={{ opacity: 0.6, fontSize: 16 }}>OR</Text>
          <View style={styles.line}></View>
        </View>

        {/* <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={styles.smallText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
      textAlign: 'center',
      color: colors.description
    },
    input: {
      backgroundColor: colors.inputBg,
      borderColor: colors.inputBorder,
      borderWidth: 1,
      borderRadius: 16,
      width: 343,
      height: 51,
      paddingHorizontal: 10
    },
    forgotPassword: {
      fontSize: 13,
      color: colors.secondary,
      marginVertical: 10
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
      backgroundColor: colors.inputBg,
      borderColor: colors.inputBorder,
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
