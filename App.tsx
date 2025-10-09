import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import remoteNotificationService from './src/services/remoteNotificationService';
import notifee from '@notifee/react-native';

function App(): React.JSX.Element {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Initialize app
    const setupApp = async () => {
      try {
        // Initialize remote notification service
        await remoteNotificationService.initialize();

        // Subscribe to remote content updates
        const unsubscribe = remoteNotificationService.subscribeToUpdates();

        // Don't auto-schedule notifications on app start
        // Let user explicitly enable them via notification cards
        // Or check if they've already been scheduled
        const scheduledInfo = await remoteNotificationService.getScheduledInfo();
        if (Object.keys(scheduledInfo).length === 0) {
          console.log('No notifications scheduled yet. User needs to enable them.');
        } else {
          console.log('Notifications already scheduled:', scheduledInfo);
        }

        setIsAppReady(true);

        // Cleanup on unmount
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error('Failed to setup app:', error);
        setIsAppReady(true); // Allow app to continue
      }
    };

    setupApp();
  }, []);

  useEffect(() => {
    // Handle notification press events
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1) { // PRESSED
        remoteNotificationService.handleNotificationPress(detail.notification);
      }
    });

    return unsubscribe;
  }, []);

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default App;