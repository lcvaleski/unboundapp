import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRemoteContent } from '../hooks/useRemoteContent';
import { ContentService } from '../services/contentService';
import remoteNotificationService from '../services/remoteNotificationService';

export const ChallengeFlowScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { dayNumber = 1 } = route.params || {};
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { challenges, loading } = useRemoteContent(true); // Real-time updates

  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Get challenge data from remote or fallback to defaults
  const challenge = challenges[dayNumber] || ContentService.getDefaultChallenges()[dayNumber];
  const cards = challenge?.cards || [];
  const currentCard = cards[currentCardIndex];
  const finalButtonText = challenge?.finalButtonText || 'Start Challenge';

  React.useEffect(() => {
    // Animate in on mountui
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

  const handleNotificationSetup = async () => {
    // Setup notifications
    console.log(`Setting up notifications for day ${dayNumber}`);

    // Request permission and schedule notifications for TODAY only
    const granted = await remoteNotificationService.requestPermission();

    if (granted) {
      // Schedule notifications ONLY for the current day
      // User will enable notifications each day as they progress
      await remoteNotificationService.scheduleDayNotifications(dayNumber);

      console.log(`Scheduled notifications for day ${dayNumber} only`);
    } else {
      console.log('Notification permission denied');
    }

    handleNext();
  };

  // Show loading while fetching content
  if (loading && !challenge) {
    return (
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C4F4A" />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if no content available
  if (!currentCard) {
    return (
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Challenge content not available</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show the full-screen card flow directly
  return (
      <SafeAreaView style={styles.modalContainer}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

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
            {currentCard.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentCard.imageUrl }}
                  style={styles.challengeImage}
                  resizeMode="contain"
                />
              </View>
            )}
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
                    {currentCard.buttonText || 'Enable Reminders'}
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
                  {currentCardIndex === cards.length - 1 ? finalButtonText : currentCard.buttonText || 'Continue'}
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
    paddingHorizontal: 24,
  },
  contentTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C4F4A',
    marginBottom: 24,
    textAlign: 'left',
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#3A3A3A',
    textAlign: 'left',
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  challengeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
});