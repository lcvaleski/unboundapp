import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PracticeCard } from '../design-system/components/PracticeCard';
import { SimpleCard } from '../design-system/components/SimpleCard';
import { colors, spacing, typography } from '../design-system/theme';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const handleViewOnboarding = () => {
    // Navigate to onboarding without changing the stored preference
    navigation.navigate('Onboarding');
  };

  const handleStartExercise = () => {
    navigation.navigate('ExerciseCards');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PracticeCard
          title="Labeling the phone as object"
          subtitle="Why Unbound picked this"
          description="Understanding what drives your compulsive phone use could help you develop a healthier relationship with your device."
          buttonText="Begin"
          onPress={handleStartExercise}
        />

        <Text style={styles.sectionTitle}>YOUR PROGRESS</Text>

        <SimpleCard
          title="Yesterday's Reflection"
          description="You identified anxiety as a trigger for phone use. Let's explore coping strategies."
          buttonText="Review"
          onPress={() => console.log('Review')}
        />

        <SimpleCard
          title="Weekly Check-in"
          description="Track your progress and see how your screen time has changed this week."
          buttonText="View Stats"
          onPress={() => console.log('Stats')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
  },
});