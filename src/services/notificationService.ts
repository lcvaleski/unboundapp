
 import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = '@fcm_token';
const NOTIFICATION_PERMISSION_KEY = '@notification_permission';

class NotificationService {
  /**
   * Request notification permissions from the user
   */
  async requestUserPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('iOS Notification permission granted:', authStatus);
        await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');
      }
      return enabled;
    } else {
      // Android 13+ requires explicit permission
      const androidVersion = typeof Platform.Version === 'string'
        ? parseInt(Platform.Version, 10)
        : Platform.Version;

      if (androidVersion >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        const enabled = result === 'granted';
        if (enabled) {
          await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');
        }
        return enabled;
      }
      // Android < 13 doesn't need explicit permission
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');
      return true;
    }
  }

  /**
   * Get the FCM token for the device
   */
  async getFCMToken(): Promise<string | null> {
    try {
      // Check if we already have a token stored
      const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (storedToken) {
        return storedToken;
      }

      // Request a new token
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        console.log('FCM Token:', token);
        return token;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
    return null;
  }

  /**
   * Initialize notification handlers
   */
  async initialize() {
    try {
      // Check permission status
      const permissionGranted = await this.checkPermission();

      if (!permissionGranted) {
        console.log('Notifications not permitted, skipping initialization');
        return;
      }

      // Get FCM token
      await this.getFCMToken();

      // Handle token refresh
      messaging().onTokenRefresh(async (token) => {
        console.log('FCM Token refreshed:', token);
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        // TODO: Send updated token to your backend server
      });

      // Handle foreground messages
      messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground notification:', remoteMessage);
        this.handleForegroundNotification(remoteMessage);
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Background notification:', remoteMessage);
        // Handle background notification
      });

      // Handle notification opened from quit state
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('App opened from quit state by notification:', remoteMessage);
            this.handleNotificationOpen(remoteMessage);
          }
        });

      // Handle notification opened from background state
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('App opened from background by notification:', remoteMessage);
        this.handleNotificationOpen(remoteMessage);
      });

    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  /**
   * Check if notification permission is granted
   */
  async checkPermission(): Promise<boolean> {
    const permission = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
    if (permission === 'granted') {
      return true;
    }

    if (Platform.OS === 'ios') {
      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }

    return true; // Android < 13 doesn't need explicit permission
  }

  /**
   * Handle notifications when app is in foreground
   */
  private handleForegroundNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    const { notification, data } = remoteMessage;

    if (notification) {
      // Show an in-app alert for foreground notifications
      Alert.alert(
        notification.title || 'Notification',
        notification.body || '',
        [
          { text: 'Dismiss', style: 'cancel' },
          {
            text: 'View',
            onPress: () => this.handleNotificationAction(data)
          }
        ]
      );
    }
  }

  /**
   * Handle notification when opened
   */
  private handleNotificationOpen(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    const { data } = remoteMessage;
    this.handleNotificationAction(data);
  }

  /**
   * Handle notification action based on data
   */
  private handleNotificationAction(data: any) {
    console.log('Handling notification action with data:', data);

    // Navigate based on notification data
    if (data?.screen) {
      // TODO: Navigate to specific screen
      // You'll need to pass navigation ref or use a navigation service
      console.log('Navigate to:', data.screen);
    }
  }

  /**
   * Schedule a local notification (for reminders)
   */
  async scheduleLocalNotification(title: string, body: string, scheduledTime: Date) {
    // For local notifications, you'll need to add @notifee/react-native
    // This is just a placeholder for the structure
    console.log('Local notification scheduling not yet implemented');
    // TODO: Implement with Notifee for local notifications
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    // TODO: Implement with Notifee
    console.log('Cancel notifications not yet implemented');
  }

  /**
   * Clear stored FCM token (useful for logout)
   */
  async clearToken() {
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    await AsyncStorage.removeItem(NOTIFICATION_PERMISSION_KEY);
  }
}

export default new NotificationService();