import notifee, {
  TriggerType,
  AndroidImportance,
  AuthorizationStatus,
  IOSNotificationCategory,
  IOSNotificationCategoryAction
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentService } from './contentService';
import { Challenge, NotificationMessage } from '../types/content.types';

const NOTIFICATION_CHANNEL_ID = 'daily-challenges';
const LAST_SCHEDULED_DAY_KEY = '@last_scheduled_day';
const SCHEDULED_NOTIFICATIONS_KEY = '@scheduled_notifications';

class RemoteNotificationService {
  private challenges: Record<number, Challenge> = {};

  /**
   * Initialize notification channel for Android and categories for iOS
   */
  async initialize() {
    try {
      // Create a channel for Android
      await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'Daily Challenges',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
      });

      // Register iOS notification categories for better interaction
      await notifee.setNotificationCategories([
        {
          id: 'daily-challenge',
          actions: [
            {
              id: 'view',
              title: 'View Challenge',
              foreground: true,
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true,
            },
          ],
        },
      ]);

      // Load remote challenges
      await this.loadChallenges();
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  /**
   * Load challenges from remote/cache
   */
  async loadChallenges() {
    this.challenges = await ContentService.fetchChallenges();
  }

  /**
   * Subscribe to real-time challenge updates
   */
  subscribeToUpdates() {
    return ContentService.subscribeToChallenges((challenges) => {
      this.challenges = challenges;
      // Reschedule notifications when content updates
      this.rescheduleNotifications();
    });
  }

  /**
   * Request notification permissions with specific options
   */
  async requestPermission() {
    try {
      const settings = await notifee.requestPermission({
        alert: true,
        badge: true,
        sound: true,
        announcement: false,
        carPlay: false,
        provisional: false,
        criticalAlert: false,
      });

      // Check if authorized (AUTHORIZED = 2, PROVISIONAL = 3)
      return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * Schedule notifications for a specific day using remote content
   */
  async scheduleDayNotifications(dayNumber: number, startDate: Date = new Date()) {
    try {
      // Make sure we have the latest challenges
      await this.loadChallenges();

    const challenge = this.challenges[dayNumber];
    if (!challenge || !challenge.notifications || challenge.notifications.length === 0) {
      console.log(`No notifications configured for day ${dayNumber}`);
      return false;
    }

    // Cancel any existing notifications for this day
    await this.cancelDayNotifications(dayNumber);

    // Schedule each notification from remote config
    for (const notification of challenge.notifications) {
      const scheduleDate = new Date(startDate);
      scheduleDate.setHours(notification.hour, 0, 0, 0);

      // For TODAY's notifications only - skip if time has already passed
      if (scheduleDate <= new Date()) {
        console.log(`Skipping ${notification.time} notification - time already passed`);
        continue;
      }

      const notificationId = `day-${dayNumber}-${notification.time}`;

      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: notification.title,
          body: notification.body,
          android: {
            channelId: NOTIFICATION_CHANNEL_ID,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            smallIcon: 'ic_launcher', // Using default launcher icon for notifications
          },
          ios: {
            sound: 'default',
            categoryId: 'daily-challenge',
          },
          data: {
            dayNumber: dayNumber.toString(),
            type: 'daily-challenge',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: scheduleDate.getTime(),
        }
      );

      console.log(`Scheduled ${notification.time} notification for day ${dayNumber} at ${scheduleDate}`);
    }

    // Save scheduled notifications info
    const scheduled = await this.getScheduledInfo();
    scheduled[dayNumber] = {
      date: startDate.toISOString(),
      notifications: challenge.notifications.length,
      enabled: true,
    };
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduled));

    return true;
    } catch (error) {
      console.error(`Failed to schedule notifications for day ${dayNumber}:`, error);
      return false;
    }
  }

  /**
   * Get info about scheduled notifications
   */
  async getScheduledInfo() {
    try {
      const info = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
      return info ? JSON.parse(info) : {};
    } catch {
      return {};
    }
  }

  /**
   * Schedule all notifications for the current user's journey
   */
  async scheduleAllNotifications(currentDay: number = 1, daysToSchedule: number = 7) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    // Make sure we have the latest challenges
    await this.loadChallenges();

    const today = new Date();
    const maxDay = Math.max(...Object.keys(this.challenges).map(Number));

    for (let i = 0; i < daysToSchedule; i++) {
      const dayToSchedule = currentDay + i;
      if (dayToSchedule > maxDay) break;

      const scheduleDate = new Date(today);
      scheduleDate.setDate(scheduleDate.getDate() + i);

      await this.scheduleDayNotifications(dayToSchedule, scheduleDate);
    }

    // Save the last scheduled day
    await AsyncStorage.setItem(LAST_SCHEDULED_DAY_KEY, (currentDay + daysToSchedule - 1).toString());

    return true;
  }

  /**
   * Reschedule notifications (called when content updates)
   */
  async rescheduleNotifications() {
    try {
      const lastScheduledDay = await AsyncStorage.getItem(LAST_SCHEDULED_DAY_KEY);
      if (lastScheduledDay) {
        const currentDay = parseInt(lastScheduledDay, 10) - 6; // Approximate current day
        await this.scheduleAllNotifications(Math.max(1, currentDay));
      }
    } catch (error) {
      console.log('Error rescheduling notifications:', error);
    }
  }

  /**
   * Cancel notifications for a specific day
   */
  async cancelDayNotifications(dayNumber: number) {
    const times = ['morning', 'afternoon', 'evening'];
    for (const time of times) {
      await notifee.cancelNotification(`day-${dayNumber}-${time}`);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
    await AsyncStorage.multiRemove([LAST_SCHEDULED_DAY_KEY, SCHEDULED_NOTIFICATIONS_KEY]);
  }

  /**
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications() {
    return await notifee.getTriggerNotifications();
  }

  /**
   * Update notifications when user progresses to next day
   */
  async updateForNextDay(newDay: number) {
    // Cancel yesterday's notifications
    if (newDay > 1) {
      await this.cancelDayNotifications(newDay - 1);
    }

    // Schedule notifications for the new week ahead
    await this.scheduleAllNotifications(newDay);
  }

  /**
   * Handle notification press (when user taps a notification)
   */
  async handleNotificationPress(notification: any) {
    const dayNumber = notification?.data?.dayNumber;

    if (dayNumber) {
      // You can navigate to the specific day's challenge here
      console.log(`Opening challenge for day ${dayNumber}`);
      // navigation.navigate('ChallengeFlow', { dayNumber: parseInt(dayNumber, 10) });
    }
  }
}

export default new RemoteNotificationService();