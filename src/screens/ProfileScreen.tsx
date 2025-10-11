import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../design-system/components/Button';
import { colors, typography, spacing } from '../design-system/theme';
import remoteNotificationService from '../services/remoteNotificationService';
import analytics from '@react-native-firebase/analytics';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut, deleteAccount } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    loadScheduledNotifications();

    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadScheduledNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  const loadScheduledNotifications = async () => {
    try {
      setLoadingNotifications(true);

      // Log analytics event for loading notifications
      await analytics().logEvent('notifications_load_start', {
        screen: 'ProfileScreen'
      });

      const scheduled = await remoteNotificationService.getFormattedScheduledNotifications();
      setNotifications(scheduled);

      // Log success with count
      await analytics().logEvent('notifications_loaded', {
        count: scheduled.length,
        screen: 'ProfileScreen',
        hasNotifications: scheduled.length > 0
      });

      console.log('Loaded notifications:', scheduled.length);
    } catch (error) {
      console.error('Error loading notifications:', error);

      // Log error event
      await analytics().logEvent('notifications_load_error', {
        error: String(error),
        screen: 'ProfileScreen'
      });
    } finally {
      setLoadingNotifications(false);
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
      <ScrollView style={styles.scrollView}>
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

          <View style={styles.notificationsCard}>
            <Text style={styles.cardTitle}>Scheduled Notifications</Text>
            {loadingNotifications ? (
              <ActivityIndicator size="small" color={colors.primary.oak} />
            ) : notifications.length > 0 ? (
              <View>
                <Text style={styles.notificationCount}>
                  {notifications.length} upcoming reminder{notifications.length !== 1 ? 's' : ''}
                </Text>
                {notifications.slice(0, 5).map((notification, index) => (
                  <View key={notification.id || index} style={styles.notificationItem}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationDay}>Day {notification.dayNumber}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    <Text style={styles.notificationDate}>{notification.dateString}</Text>
                    <Text style={styles.notificationBody}>{notification.body}</Text>
                  </View>
                ))}
                {notifications.length > 5 && (
                  <Text style={styles.moreNotifications}>
                    +{notifications.length - 5} more notification{notifications.length - 5 !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.noNotifications}>No notifications scheduled</Text>
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
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  notificationsCard: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
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
    width: '100%',
    marginBottom: spacing.md,
  },
  notificationCount: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  notificationItem: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  notificationDay: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.oak,
  },
  notificationTime: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  notificationDate: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  notificationBody: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    lineHeight: 18,
  },
  noNotifications: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  moreNotifications: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});