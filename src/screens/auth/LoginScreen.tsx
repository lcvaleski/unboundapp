import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../design-system/components/Button';
import { colors, typography, spacing } from '../../design-system/theme';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();

  const isFormValid = !!email && !!password && validateEmail(email);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError('Login failed. Please check your credentials.');
      Alert.alert('Login Error', 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError('Google sign in failed');
      Alert.alert('Login Error', 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithApple();
    } catch (err: any) {
      setError('Apple sign in failed');
      Alert.alert('Login Error', 'Apple sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.formFields}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor={colors.text.tertiary}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.tertiary}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordLink}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
      </View>

      <Button
        title="Sign In"
        onPress={handleLogin}
        variant="primary"
        size="large"
        loading={loading}
        style={{ width: '100%' }}
        disabled={!isFormValid || loading}
      />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleSignIn}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>Sign in with Apple</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log('Sign up link pressed, navigating to SignUp');
              navigation.navigate('SignUp');
            }}
            style={styles.signUpLink}
            disabled={loading}
          >
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text>
            </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700',
    marginBottom: spacing.xl * 2,
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.text.primary,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    textDecorationLine: 'underline',
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500',
  },
  signUpLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  signUpTextBold: {
    color: colors.text.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: colors.semantic.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral.gray300,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.neutral.gray600,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
  },
  formFields: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  socialButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: spacing.md + 2,
    
    width: '100%',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  googleButton: {
    backgroundColor: '#F0F0F0',
  },
  socialButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '600',
    color: colors.text.primary,
  },
  appleButtonText: {
    color: colors.text.inverse,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    backgroundColor: '#FFFFFF',
    marginBottom: spacing.md,
  },
});