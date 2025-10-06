import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PracticeCard } from '../design-system/components/PracticeCard';
import { CourseProgressCard } from '../design-system/components/CourseProgressCard';
import { colors, spacing, typography } from '../design-system/theme';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const currentDay = 2; // This would come from user's progress data - set to 2 for testing

  const handleStartExercise = () => {
    navigation.navigate('ChallengeFlow', { dayNumber: currentDay });
  };

  // Generate 30 days of course content
  const courseContent = [
    { day: 1, title: "Labeling the phone as object", description: "Reframe how you see the phone and the world around you." },
    { day: 2, title: "Bathroom Break", description: "Create your first phone-free space." },
    { day: 3, title: "3 Meals, No Phone", description: "Explore how it feels to eat without any screentime at all" },
    { day: 4, title: "The Cost of Distraction", description: "Spend the day quantifying who you let down due to your screentime." },
    { day: 5, title: "Mindful Observation", description: "Watch your habits without judgment." },
    { day: 6, title: "Creating Friction", description: "Make phone use less automatic." },
    { day: 7, title: "Weekly Reflection", description: "Review your progress and insights." },
    { day: 8, title: "Emotional Regulation", description: "Managing feelings without digital escape." },
    { day: 9, title: "The Reset", description: "Breaking the instant gratification cycle." },
    { day: 10, title: "Alternative Activities", description: "Replacing screen time with fulfilling actions." },
    { day: 11, title: "Social Media Audit", description: "Evaluate your digital relationships." },
    { day: 12, title: "Notification Detox", description: "Reclaim your attention from alerts." },
    { day: 13, title: "Morning Routines", description: "Start your day without screens." },
    { day: 14, title: "Two Week Check-in", description: "Assess your transformation journey." },
    { day: 15, title: "Deep Work Practice", description: "Building focus in a distracted world." },
    { day: 16, title: "Digital Boundaries", description: "Setting limits that stick." },
    { day: 17, title: "The Power of Boredom", description: "Embracing empty moments." },
    { day: 18, title: "Stress Without Scrolling", description: "New coping mechanisms." },
    { day: 19, title: "Reclaiming Evenings", description: "Wind down without devices." },
    { day: 20, title: "Weekend Warriors", description: "Maintaining progress on days off." },
    { day: 21, title: "Three Week Milestone", description: "Celebrating your progress." },
    { day: 22, title: "Building New Habits", description: "Replace old patterns with better ones." },
    { day: 23, title: "Connection Without Clicks", description: "Real relationships in digital age." },
    { day: 24, title: "Creative Expression", description: "Rediscover your creative side." },
    { day: 25, title: "Physical Movement", description: "Using your body to calm your mind." },
    { day: 26, title: "Mindful Technology", description: "Using devices with intention." },
    { day: 27, title: "Future Proofing", description: "Maintaining long-term balance." },
    { day: 28, title: "Community Support", description: "Finding others on similar journeys." },
    { day: 29, title: "Personal Philosophy", description: "Defining your relationship with technology." },
    { day: 30, title: "Course Complete", description: "Your new beginning starts here." },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.appTitle}>Unbound</Text>

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>TODAY'S CHALLENGE</Text>
          <PracticeCard
            title="Labeling the phone as object"
            subtitle="Day 1 of 30"
            description="Throughout the day we will send you simple reminders to remember that the world is out there, not in there."
            buttonText="Begin"
            onPress={handleStartExercise}
          />
        </View>

        <View style={styles.journeySection}>
          <Text style={styles.sectionTitle}>YOUR JOURNEY</Text>
        </View>

        <View style={styles.timelineContainer}>
          {courseContent.map((content, index) => (
            <CourseProgressCard
              key={content.day}
              day={content.day}
              title={content.title}
              description={content.description}
              isActive={content.day === currentDay}
              isCompleted={content.day < currentDay}
              isLocked={content.day > currentDay && content.day !== 2} // Allow day 2 to be clickable
              onPress={() => {
                if (content.day === currentDay || content.day === 2) {
                  navigation.navigate('ChallengeFlow', { dayNumber: content.day });
                } else if (content.day < currentDay) {
                  console.log(`Review day ${content.day}`);
                }
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
});