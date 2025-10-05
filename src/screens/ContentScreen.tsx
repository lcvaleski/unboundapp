import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from 'react-native';
import { ContentCard } from '../design-system/components/ContentCard';
import { colors, spacing, typography } from '../design-system/theme';

export const ContentScreen = () => {
  const contentByCategory = {
    'Insights': [
      {
        id: '5',
        title: 'The Power of Boredom',
        category: 'Insight',
        duration: '7 min',
        description: 'Why embracing empty moments can transform your relationship with technology.',
      },
    ],
    'Awareness': [
      {
        id: '1',
        title: 'Understanding Digital Habits',
        category: 'Awareness',
        duration: '5 min',
        description: 'Learn to recognize your phone usage patterns and triggers.',
      },
    ],
    'Science': [
      {
        id: '2',
        title: 'The Dopamine Connection',
        category: 'Science',
        duration: '8 min',
        description: 'Explore how your brain responds to digital stimulation.',
      },
    ],
    'Practices': [
      {
        id: '3',
        title: 'Mindful Phone Checking',
        category: 'Practice',
        duration: '3 min',
        description: 'A simple exercise to break automatic phone-checking behavior.',
      },
      {
        id: '6',
        title: 'Alternative Rewards',
        category: 'Practice',
        duration: '4 min',
        description: 'Replace digital rewards with more fulfilling alternatives.',
      },
    ],
    'Strategies': [
      {
        id: '4',
        title: 'Creating Phone-Free Zones',
        category: 'Strategy',
        duration: '6 min',
        description: 'Design physical spaces that naturally reduce phone dependency.',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Content Library</Text>
        <Text style={styles.subtitle}>
          Explore insights and practices to transform your digital habits
        </Text>

        {Object.entries(contentByCategory).map(([categoryName, items]) => (
          <View key={categoryName}>
            <Text style={styles.categoryHeader}>{categoryName.toUpperCase()}</Text>
            {items.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                category={item.category}
                duration={item.duration}
                description={item.description}
                onPress={() => console.log(`Pressed ${item.title}`)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.offWhite || '#FAF8F3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colors.neutral.gray600,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: colors.neutral.gray600,
    lineHeight: 24,
  },
});