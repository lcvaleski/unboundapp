import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button';
import { colors, typography, spacing } from '../../design-system/theme';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Success',
        'Password reset email sent. Please check your inbox.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          placeholder="Enter your email"
          placeholderTextColor={colors.neutral.gray400}
        />
        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          variant="primary"
          size="large"
          style={styles.button}
          loading={loading}
          disabled={!email || loading}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.neutral.black,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.black,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.regular,
  },
  label: {
    color: colors.neutral.black,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  input: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.neutral.black,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    minHeight: 56,
  },
  button: {
    marginTop: spacing.md,
  },
  backLink: {
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
  backLinkText: {
    color: colors.neutral.black,
    fontSize: typography.fontSize.sm,
    textDecorationLine: 'underline',
    fontFamily: typography.fontFamily.medium,
  },
});