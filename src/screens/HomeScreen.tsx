import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../design-system/components/Button';
import { colors, typography, spacing } from '../design-system/theme';

export const HomeScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleViewOnboarding = () => {
    // Navigate to onboarding without changing the stored preference
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {user?.email && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfoText}>{user.email}</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          <Button
            title="View Onboarding"
            onPress={handleViewOnboarding}
            variant="primary"
            size="large"
            style={styles.button}
          />
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="secondary"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.white,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    width: '100%',
  },
  userInfoLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary.black,
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  userInfoText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary.black,
  },
  actions: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: spacing.md,
  },
});