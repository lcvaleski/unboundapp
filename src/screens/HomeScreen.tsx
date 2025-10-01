import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../design-system/components/Button';
import { colors, spacing } from '../design-system/theme';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const handleViewOnboarding = () => {
    // Navigate to onboarding without changing the stored preference
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.actions}>
          <Button
            title="View Onboarding"
            onPress={handleViewOnboarding}
            variant="primary"
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
  actions: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: spacing.md,
  },
});