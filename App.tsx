import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

function App(): React.JSX.Element {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Initialize app
    const setupApp = async () => {
      try {
        // Add any initialization logic here
        setIsAppReady(true);
      } catch (error) {
        console.error('Failed to setup app:', error);
        setIsAppReady(true); // Allow app to continue
      }
    };

    setupApp();
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