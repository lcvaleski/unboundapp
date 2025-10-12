import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../design-system/components/Button';
import { colors, typography, spacing } from '../design-system/theme';
import notifee from '@notifee/react-native';
import remoteNotificationService from '../services/remoteNotificationService';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut, deleteAccount } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState<string>('Unknown');
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const settings = await notifee.getNotificationSettings();
    switch (settings.authorizationStatus) {
      case 0:
        setNotificationStatus('Not Determined');
        break;
      case 1:
        setNotificationStatus('Denied');
        break;
      case 2:
        setNotificationStatus('Authorized');
        break;
      case 3:
        setNotificationStatus('Provisional');
        break;
      default:
        setNotificationStatus('Unknown');
    }
  };

  const handleRequestNotificationPermission = async () => {
    setIsCheckingPermission(true);
    try {
      const hasPermission = await remoteNotificationService.requestPermission();

      if (hasPermission) {
        Alert.alert(
          'Notifications Enabled',
          'You will now receive daily challenge reminders!',
          [{ text: 'OK', onPress: checkNotificationStatus }]
        );
        // Schedule notifications for current day if user is on a challenge
        // You might want to track the current day in AsyncStorage or context
      } else {
        Alert.alert(
          'Notifications Disabled',
          'You can enable notifications in your device settings.',
          [{ text: 'OK', onPress: checkNotificationStatus }]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert('Error', 'Failed to request notification permission');
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleViewOnboarding = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.userCard}>
          <Text style={styles.cardTitle}>Account Information</Text>
          
          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}
          
          {user?.uid && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue}>{user.uid.substring(0, 8)}...</Text>
            </View>
          )}
          
          {user?.metadata?.creationTime && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member since:</Text>
              <Text style={styles.infoValue}>
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.notificationCard}>
          <Text style={styles.cardTitle}>Notifications</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[
              styles.infoValue,
              notificationStatus === 'Authorized' && styles.statusAuthorized,
              notificationStatus === 'Denied' && styles.statusDenied,
            ]}>
              {notificationStatus}
            </Text>
          </View>

          {notificationStatus !== 'Authorized' && (
            <Button
              title={isCheckingPermission ? 'Checking...' : 'Enable Notifications'}
              onPress={handleRequestNotificationPermission}
              variant="primary"
              size="medium"
              disabled={isCheckingPermission || notificationStatus === 'Denied'}
              style={styles.notificationButton}
            />
          )}

          {notificationStatus === 'Denied' && (
            <Text style={styles.deniedText}>
              Please enable notifications in your device settings
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title="View Onboarding"
            onPress={handleViewOnboarding}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />

          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />

          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            variant="primary"
            size="large"
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
  },
  actions: {
    marginTop: 'auto',
  },
  actionButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  deleteButton: {
    backgroundColor: '#8B4444', // Muted red that fits the palette
  },
  notificationButton: {
    marginTop: spacing.md,
  },
  statusAuthorized: {
    color: '#4A7862', // Green that fits the palette
  },
  statusDenied: {
    color: '#8B4444', // Red that fits the palette
  },
  deniedText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    opacity: 0.6,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});