import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button';
import { colors, typography, spacing } from '../../design-system/theme';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  const isFormValid =
    !!email &&
    !!password &&
    !!confirmPassword &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleSignUp = async () => {
    console.log('[SignUpScreen] Starting handleSignUp');
    console.log('[SignUpScreen] Email:', email);
    console.log('[SignUpScreen] Password length:', password?.length);

    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
    } catch (err: any) {
      console.error('[SignUpScreen] Caught error:', err);
      console.error('[SignUpScreen] Error message:', err?.message);
      console.error('[SignUpScreen] Error code:', err?.code);

      const errorMessage = err?.message || 'Sign up failed. Please try again.';
      setError(errorMessage);
      Alert.alert('Sign Up Error', errorMessage);
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
      setError('Google sign up failed');
      Alert.alert('Sign Up Error', 'Google sign up failed');
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
      setError('Apple sign up failed');
      Alert.alert('Sign Up Error', 'Apple sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.formFields}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter your email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          {email && !validateEmail(email) && <Text style={styles.errorText}>Please enter a valid email</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            editable={!loading}
          />
          {password && password.length < 6 && <Text style={styles.errorText}>Password must be at least 6 characters</Text>}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            editable={!loading}
          />
          {confirmPassword && password !== confirmPassword && <Text style={styles.errorText}>Passwords do not match</Text>}
        </View>
        
        <Button
          title="Sign Up"
          onPress={handleSignUp}
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
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.socialButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Login</Text></Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    marginBottom: spacing.xl * 2,
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.primary.black,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.primary.black,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  loginTextBold: {
    color: colors.primary.black,
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
  formFields: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: 'rgba(0, 0, 0, 0.6)',
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
  },
  socialButtonsContainer: {
    marginTop: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingVertical: spacing.md,
    width: '100%',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  socialButtonText: {
    color: colors.primary.black,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.black,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.primary.black,
    backgroundColor: colors.primary.white,
    marginBottom: spacing.xs,
  },
});