import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PracticeCard } from '../design-system/components/PracticeCard';
import { CourseProgressCard } from '../design-system/components/CourseProgressCard';
import { StartHereCard } from '../design-system/components/StartHereCard';
import { colors, spacing, typography } from '../design-system/theme';
import { useRemoteContent } from '../hooks/useRemoteContent';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const currentDay = 1; // This would come from user's progress data
  const [weeklyChecks, setWeeklyChecks] = useState([false, false, false, false, false, false, false]);
  const { courseContent, challenges, loading } = useRemoteContent(true); // Real-time updates

  const handleStartExercise = () => {
    navigation.navigate('ChallengeFlow', { dayNumber: currentDay });
  };

  const handleStartHere = () => {
    // Navigate to intro video or onboarding flow
    console.log('Start Here pressed - will play intro video');
    // TODO: Implement video playback or navigation to intro screen
  };

  const toggleWeeklyCheck = (index: number) => {
    const newChecks = [...weeklyChecks];
    newChecks[index] = !newChecks[index];
    setWeeklyChecks(newChecks);
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get current challenge for today's card
  const currentChallenge = challenges[currentDay];

  // Merge challenge data with course content for complete info
  const displayContent = courseContent.length > 0 ?
    courseContent.map(content => {
      const challenge = challenges[content.day];
      return challenge ? {
        ...content,
        title: challenge.title,  // Use title from challenges (always up-to-date)
        description: challenge.description  // Use description from challenges
      } : content;
    }) :
    Object.values(challenges).length > 0 ?
    Object.values(challenges).map(ch => ({
      day: ch.day,
      title: ch.title,
      description: ch.description,
      enabled: ch.enabled,
      order: ch.order
    })).sort((a, b) => a.order - b.order) :
    [
      { day: 1, title: "Labeling the phone as object", description: "Reframe how you see the phone and the world around you.", enabled: true, order: 1 },
      { day: 2, title: "Bathroom Break", description: "Create your first phone-free space.", enabled: true, order: 2 },
      { day: 3, title: "One Word Check-In", description: "Start to identify how your phone makes you feel.", enabled: true, order: 3 },
    ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.appTitle}>Unbound</Text>

        {/* Weekly checkboxes */}
        <View style={styles.weeklyContainer}>
          <View style={styles.weeklyCheckboxes}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.dayCheckContainer}>
                <Text style={styles.dayLabel}>{day}</Text>
                <TouchableOpacity
                  style={styles.weeklyCheckbox}
                  onPress={() => toggleWeeklyCheck(index)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    weeklyChecks[index] && styles.checkboxChecked
                  ]}>
                    {weeklyChecks[index] && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Start Here Card */}
        <StartHereCard
          onPress={handleStartHere}
          freezeFrameUri="https://firebasestorage.googleapis.com/v0/b/unboundapp-2a86c.firebasestorage.app/o/CleanShot%202025-10-09%20at%2011.56.59%402x.png?alt=media&token=279ec504-eb71-4e0e-b14f-ca5a2cc81503"
        />

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>TODAY'S CHALLENGE</Text>
          {loading && !currentChallenge ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#2C4F4A" />
            </View>
          ) : (
            <PracticeCard
              title={currentChallenge?.title || "Today's Challenge"}
              subtitle={`Day ${currentDay} of 30`}
              description={currentChallenge?.description || "Complete today's mindfulness exercise."}
              buttonText="Begin"
              onPress={handleStartExercise}
            />
          )}
        </View>

        <View style={styles.journeySection}>
          <Text style={styles.sectionTitle}>YOUR JOURNEY</Text>
        </View>

        <View style={styles.timelineContainer}>
          {displayContent.map((content, index) => (
            <CourseProgressCard
              key={content.day}
              day={content.day}
              title={content.title}
              description={content.description}
              isActive={content.day === currentDay}
              isCompleted={content.day < currentDay}
              isLocked={false} // All days are unlocked and clickable
              onPress={() => {
                navigation.navigate('ChallengeFlow', { dayNumber: content.day });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2A2A2A',
    textAlign: 'center',
    marginBottom: 24,
  },
  todaySection: {
    marginBottom: 8,
  },
  journeySection: {
    marginTop: 0,
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
  timelineContainer: {
    marginTop: 8,
  },
  weeklyContainer: {
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  weeklyCheckboxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCheckContainer: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B0B0B0',
    marginBottom: 6,
  },
  weeklyCheckbox: {
    padding: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#2C4F4A',
    borderColor: '#2C4F4A',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingCard: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
  },
});