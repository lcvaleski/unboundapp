import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


interface ChallengeCard {
  id: number;
  type: 'intro' | 'instruction' | 'notification' | 'why';
  title?: string;
  content: string;
  buttonText?: string;
}

const challengeCards: Record<number, ChallengeCard[]> = {
  1: [
    {
      id: 1,
      type: 'intro',
      title: 'Labeling the phone as object',
      content: "Today, you'll learn to see your phone for what it really is—just an object, not an extension of yourself.",
    },
    {
      id: 2,
      type: 'instruction',
      title: 'How it works',
      content: "Throughout the day, we'll send you gentle reminders to notice your phone as a physical object. When you pick it up, feel its weight. Notice its edges. See it as a tool, not a companion.",
    },
    {
      id: 3,
      type: 'notification',
      title: 'Reminders',
      content: "We'll send you 3-4 mindful moments today. Each one takes just 10 seconds—a brief pause to recenter.",
      buttonText: 'Enable Reminders',
    },
    {
      id: 4,
      type: 'why',
      title: 'Why this works',
      content: 'When we label our phones as objects, we break the emotional attachment. Research shows that creating cognitive distance from our devices reduces compulsive checking by up to 40%.',
    },
  ],
  2: [
    {
      id: 1,
      type: 'intro',
      title: 'Bathroom Break',
      content: "Our phones feel like extensions of ourselves, which is why it's important to remember what it's like to be physically away from them. Your bathroom is the easiest place to start.",
    },
    {
      id: 2,
      type: 'instruction',
      title: 'How it works',
      content: "Today, make an effort to leave your phone outside of the door every time you enter your bathroom. If you forget, don't beat yourself up, just try to remember for next time. We'll send you some reminders throughout the day.",
    },
    {
      id: 3,
      type: 'notification',
      title: 'Reminders',
      content: "We'll remind you throughout the day to leave your phone outside when using the bathroom.",
      buttonText: 'Enable Reminders',
    },
    {
      id: 4,
      type: 'why',
      title: 'Why this works',
      content: "When you pair your phone with routine habits, it strengthens compulsive & mindless use. By making your bathroom a phone-free space, you'll start to gain insight into this pattern—the first step to breaking it.",
    },
  ],
};

export const ChallengeFlowScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { dayNumber = 1 } = route.params || {};
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const modalAnimation = useRef(new Animated.Value(0)).current;

  const cards = challengeCards[dayNumber] || challengeCards[1];
  const currentCard = cards[currentCardIndex];

  React.useEffect(() => {
    // Animate in on mount
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      // Fade out current card
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        // Fade in new card
        Animated.timing(modalAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Complete the challenge flow
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Navigate back or to exercise
    navigation.goBack();
  };

  const handleNotificationSetup = () => {
    // Setup notifications
    console.log('Setting up notifications');
    handleNext();
  };

  // Show the full-screen card flow directly
  return (
      <SafeAreaView style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.fullScreenCard,
            {
              opacity: modalAnimation,
              transform: [
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Progress dots */}
          <View style={styles.progressContainer}>
            {cards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentCardIndex && styles.progressDotActive,
                  index < currentCardIndex && styles.progressDotComplete,
                ]}
              />
            ))}
          </View>

          {/* Card content */}
          <View style={styles.cardContent}>
            {currentCard.title && (
              <Text style={styles.contentTitle}>{currentCard.title}</Text>
            )}
            <Text style={styles.contentText}>{currentCard.content}</Text>
          </View>

          {/* Action button */}
          <View style={styles.actionContainer}>
            {currentCard.type === 'notification' ? (
              <>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleNotificationSetup}
                >
                  <Text style={styles.primaryButtonText}>
                    {currentCard.buttonText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleNext}
                >
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>
                  {currentCardIndex === cards.length - 1 ? 'Start Challenge' : 'Continue'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9F6F2',
  },
  fullScreenCard: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: '#2C4F4A',
  },
  progressDotComplete: {
    backgroundColor: '#2C4F4A',
    opacity: 0.5,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  contentTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C4F4A',
    marginBottom: 24,
    textAlign: 'center',
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#3A3A3A',
    textAlign: 'center',
  },
  actionContainer: {
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2C4F4A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#F5E6D3',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#999',
    fontSize: 14,
  },
});