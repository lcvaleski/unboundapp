import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../design-system/components/Button';
import { colors, typography, spacing } from '../design-system/theme';
import notifee, { TriggerNotification } from '@notifee/react-native';
import remoteNotificationService from '../services/remoteNotificationService';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut, deleteAccount } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState<string>('Unknown');
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<TriggerNotification[]>([]);

  useEffect(() => {
    checkNotificationStatus();
    loadScheduledNotifications();
  }, []);

  const checkNotificationStatus = async () => {
    const settings = await notifee.getNotificationSettings();
    console.log('Notification settings:', settings);

    // Check iOS authorization status (0=NotDetermined, 1=Denied, 2=Authorized, 3=Provisional)
    // On iOS 12+, also check if any alert types are enabled
    const isAuthorized = settings.authorizationStatus >= 2 ||
                        (settings.ios?.alert || settings.ios?.badge || settings.ios?.sound);

    if (isAuthorized) {
      setNotificationStatus('Authorized');
    } else if (settings.authorizationStatus === 1) {
      setNotificationStatus('Denied');
    } else {
      setNotificationStatus('Not Determined');
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const notifications = await remoteNotificationService.getScheduledNotifications();
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await notifee.displayNotification({
        title: 'Test Notification 🔔',
        body: 'This is a test notification from Unbound. Your notifications are working!',
        ios: {
          sound: 'default',
        },
        android: {
          channelId: 'daily-challenges',
          pressAction: {
            id: 'default',
          },
        },
      });
      Alert.alert('Test Sent', 'Check your notification panel!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
      console.error('Test notification error:', error);
    }
  };

  const formatNotificationDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
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
          [{ text: 'OK', onPress: () => {
            checkNotificationStatus();
            loadScheduledNotifications();
          }}]
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
              disabled={isCheckingPermission}
              style={styles.notificationButton}
            />
          )}

          <View style={styles.buttonRow}>
            <Button
              title="Test Notification"
              onPress={sendTestNotification}
              variant="secondary"
              size="small"
              style={styles.testButton}
            />
            <Button
              title="Refresh Status"
              onPress={() => {
                checkNotificationStatus();
                loadScheduledNotifications();
              }}
              variant="secondary"
              size="small"
              style={styles.refreshButton}
            />
          </View>

          {notificationStatus === 'Denied' && (
            <Text style={styles.deniedText}>
              Please enable notifications in your device settings
            </Text>
          )}
        </View>

        <View style={styles.scheduledCard}>
          <Text style={styles.cardTitle}>Scheduled Notifications</Text>

          {scheduledNotifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications scheduled yet</Text>
          ) : (
            <View>
              <Text style={styles.scheduledCount}>
                {scheduledNotifications.length} notification{scheduledNotifications.length !== 1 ? 's' : ''} scheduled
              </Text>
              {scheduledNotifications.slice(0, 5).map((notification, index) => (
                <View key={notification.notification.id || index} style={styles.scheduledItem}>
                  <Text style={styles.scheduledTitle}>{notification.notification.title}</Text>
                  <Text style={styles.scheduledBody}>{notification.notification.body}</Text>
                  {notification.trigger?.type === 1 && notification.trigger.timestamp && (
                    <Text style={styles.scheduledTime}>
                      {formatNotificationDate(notification.trigger.timestamp)}
                    </Text>
                  )}
                </View>
              ))}
              {scheduledNotifications.length > 5 && (
                <Text style={styles.moreText}>
                  ...and {scheduledNotifications.length - 5} more
                </Text>
              )}
            </View>
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
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
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
  scheduledCard: {
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
    marginTop: spacing.xl,
  },
  actionButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  deleteButton: {
    width: '100%',
    marginBottom: spacing.md,
    backgroundColor: '#8B4444', // Muted red that fits the palette
  },
  notificationButton: {
    marginTop: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  testButton: {
    flex: 1,
  },
  refreshButton: {
    flex: 1,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  scheduledCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  scheduledItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  scheduledTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  scheduledBody: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  scheduledTime: {
    fontSize: typography.fontSize.xs,
    color: colors.text.primary,
    opacity: 0.6,
    marginTop: spacing.xs,
  },
  moreText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
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