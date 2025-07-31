import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../constants/colors';
import { AntDesign, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const SigninScreen = ({ onLogin }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      setError('Invalid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (onLogin) {
      return onLogin(email, password);
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
      setError('');
    } catch (e) {
      setIsLoading(false);
      let code = e.code;
      console.log(code);
      switch (code) {
        case 'auth/invalid-email':
          setError('Invalid credentials.');
          break;
        case 'auth/wrong-password':
          setError('Invalid credentials.');
          break;
        case 'auth/user-not-found':
          setError('Incorrect email or password.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials.');
          break;
        case 'auth/network-request-failed':
          setError('Network request failed. Please check your connection.');
          break;
        case 'auth/too-many-requests':
          setError(
            'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or try again later.',
          );
          break;
        default:
          setError('There was a problem with your request.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AntDesign name="user" color={Colors.primary} size={60} />
            <Text style={styles.title} testID="signin-header">
              Sign In
            </Text>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            testID="email"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWithIconContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter your password"
              keyboardType="default"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              testID="password"
            />
            <Pressable
              testID="showPassword"
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.showPasswordBtn}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} color="#888" size={24} />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={handleLogin} testID="signinButton">
            <Text style={styles.buttonText}>{isLoading ? 'Signing in...' : 'Sign In'}</Text>
          </Pressable>

          <Pressable
            style={styles.signupLink}
            onPress={() => router.push('/(tabs)')}
            testID="signupLink">
            <Text style={styles.signupText}>
              Don&apos;t have an account? <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputWithIconContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  inputWithIcon: {
    flex: 1,
  },
  showPasswordBtn: {
    padding: 4,
    marginLeft: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: Colors.textInverse,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  error: {
    color: Colors.error,
    marginBottom: 8,
    fontSize: 15,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 8,
    color: Colors.primary,
  },
  signupText: {
    fontSize: 15,
  },
});

export default SigninScreen;
