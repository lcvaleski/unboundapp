import { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { Alert } from 'react-native';

export const useNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const hasPermission = await notificationService.checkPermission();
    setIsEnabled(hasPermission);

    if (hasPermission) {
      const token = await notificationService.getFCMToken();
      setFcmToken(token);
    }
  };

  const requestPermission = async () => {
    const granted = await notificationService.requestUserPermission();

    if (granted) {
      setIsEnabled(true);
      const token = await notificationService.getFCMToken();
      setFcmToken(token);

      Alert.alert(
        'Notifications Enabled',
        'You will now receive daily reminders for your challenges.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Notifications Disabled',
        'You can enable notifications later in your device settings.',
        [{ text: 'OK' }]
      );
    }

    return granted;
  };

  const scheduleDailyReminder = async (hour: number = 9, minute: number = 0) => {
    if (!isEnabled) {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    // Calculate next occurrence of the time
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await notificationService.scheduleLocalNotification(
      'Daily Challenge Reminder',
      "It's time for today's mindfulness challenge!",
      scheduledTime
    );

    return true;
  };

  const cancelNotifications = async () => {
    await notificationService.cancelAllNotifications();
  };

  return {
    isEnabled,
    fcmToken,
    requestPermission,
    scheduleDailyReminder,
    cancelNotifications,
    checkNotificationStatus,
  };
};