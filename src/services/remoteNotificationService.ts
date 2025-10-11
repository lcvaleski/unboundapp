import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentService } from './contentService';
import { Challenge, NotificationMessage } from '../types/content.types';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

const NOTIFICATION_CHANNEL_ID = 'daily-challenges';
const LAST_SCHEDULED_DAY_KEY = '@last_scheduled_day';
const SCHEDULED_NOTIFICATIONS_KEY = '@scheduled_notifications';

class RemoteNotificationService {
  private challenges: Record<number, Challenge> = {};

  /**
   * Initialize notification channel for Android
   */
  async initialize() {
    // Create a channel for Android
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Daily Challenges',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    // Load remote challenges
    await this.loadChallenges();
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
   * Request notification permissions
   */
  async requestPermission() {
    const settings = await notifee.requestPermission();
    const granted = settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL

    // Log to Crashlytics for instant feedback
    crashlytics().log(`Notification permission requested: ${granted ? 'GRANTED' : 'DENIED'}`);
    crashlytics().log(`Auth status: ${settings.authorizationStatus}`);

    // Log permission request result
    await analytics().logEvent('notification_permission_requested', {
      granted,
      status: settings.authorizationStatus
    });

    return granted;
  }

  /**
   * Schedule notifications for a specific day using remote content
   */
  async scheduleDayNotifications(dayNumber: number, startDate: Date = new Date()) {
    // Log to Crashlytics
    crashlytics().log(`Starting scheduleDayNotifications for day ${dayNumber}`);

    // Make sure we have the latest challenges
    await this.loadChallenges();

    const challenge = this.challenges[dayNumber];
    crashlytics().log(`Challenge loaded: ${challenge ? 'YES' : 'NO'}`);
    crashlytics().log(`Notifications count: ${challenge?.notifications?.length || 0}`);

    if (!challenge || !challenge.notifications || challenge.notifications.length === 0) {
      console.log(`No notifications configured for day ${dayNumber}`);
      crashlytics().log(`FAILED: No notifications configured for day ${dayNumber}`);
      await analytics().logEvent('notification_schedule_failed', {
        dayNumber,
        reason: 'no_notifications_configured'
      });
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
            smallIcon: 'ic_launcher', // Make sure you have this icon
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
      crashlytics().log(`Scheduled: Day ${dayNumber} - ${notification.time} at ${scheduleDate}`);
    }

    // Save scheduled notifications info
    const scheduled = await this.getScheduledInfo();
    scheduled[dayNumber] = {
      date: startDate.toISOString(),
      notifications: challenge.notifications.length,
      enabled: true,
    };
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduled));

    // Log success to Crashlytics
    crashlytics().log(`SUCCESS: Scheduled ${challenge.notifications.length} notifications for day ${dayNumber}`);

    // Log analytics event for successful scheduling
    await analytics().logEvent('notifications_scheduled', {
      dayNumber,
      count: challenge.notifications.length,
      date: startDate.toISOString()
    });

    return true;
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
   * Get formatted scheduled notifications for display
   */
  async getFormattedScheduledNotifications() {
    const notifications = await notifee.getTriggerNotifications();

    // Log to Crashlytics for debugging
    crashlytics().log(`Raw notifications from Notifee: ${notifications.length}`);

    // Log raw notification count
    await analytics().logEvent('notifications_raw_check', {
      totalCount: notifications.length,
      source: 'notifee'
    });

    const formatted = notifications
      .filter(n => n.notification.data?.type === 'daily-challenge')
      .map(n => {
        const timestamp = n.trigger.type === TriggerType.TIMESTAMP
          ? n.trigger.timestamp
          : 0;

        return {
          id: n.notification.id,
          title: n.notification.title || 'Challenge Reminder',
          body: n.notification.body || '',
          date: new Date(timestamp),
          dayNumber: parseInt(String(n.notification.data?.dayNumber || '0'), 10),
          time: new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          dateString: new Date(timestamp).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Log to Crashlytics
    crashlytics().log(`Formatted notifications: ${formatted.length}`);
    if (formatted.length > 0) {
      crashlytics().log(`Days with notifications: ${formatted.map(n => n.dayNumber).join(', ')}`);
    }

    // Log formatted notification details
    await analytics().logEvent('notifications_formatted', {
      formattedCount: formatted.length,
      dayNumbers: formatted.map(n => n.dayNumber).join(','),
      source: 'notifee'
    });

    return formatted;
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