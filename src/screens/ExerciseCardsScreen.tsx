import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../design-system/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-nitro-sound';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CardData {
  id: string;
  content: string;
  isInverted?: boolean;
  hasJournal?: boolean;
}

const cards: CardData[] = [
  {
    id: '1',
    content: "We're about to invite you to try something that might feel uncomfortable…",
  },
  {
    id: '2',
    content: "When your phone use becomes compulsive, you often don't recognize the patterns that hook you in.",
  },
  {
    id: '3',
    content: 'This exercise will help you become aware of the cravings that drive mindless phone use.',
  },
  {
    id: '4',
    content: "In a moment, we're going to ask you to turn your phone all the way off, and do nothing, for one minute.",
  },
  {
    id: '5',
    content: "If you don't have a clock nearby, you can count to 60 in your head.",
  },
  {
    id: '6',
    content: 'It may seem trivial, but committing to this 60 seconds is a crucial start to your journey.',
  },
  {
    id: '7',
    content: 'Once you start, really take stock of what it feels like to sit for one minute with your phone off.',
  },
  {
    id: '8',
    content: 'Turn your phone all the way off now. Return to Unbound and continue once the minute is up.',
    isInverted: true,
  },
  {
    id: '9',
    content: 'What came up for you in that one minute?',
    hasJournal: true,
  },
  {
    id: '10',
    content: "If you noticed feelings of boredom, and cravings to do anything other than sit in silence, that's normal.",
  },
  {
    id: '11',
    content: "In fact, they're signals, and they show you where you've been living on autopilot.",
  },
  {
    id: '12',
    content: "For the rest of the day, when you find yourself reaching for your phone when you don't actually need it, ask yourself:",
  },
  {
    id: '13',
    content: '"What am I really feeling right now?"',
  },
  {
    id: '14',
    content: "Don't fight the urge to use your phone. Simply name the underlying feeling.",
  },
  {
    id: '15',
    content: 'For example, you could say (out loud) "I\'m bored," or "I\'m anxious."',
  },
  {
    id: '16',
    content: 'Whatever it is, naming it is the first step to loosening its grip.',
  },
  {
    id: '17',
    content: 'This is how you begin to replace your compulsions with awareness.',
  },
  {
    id: '18',
    content: 'Congratulations on taking your first step towards a healthier relationship with your phone.',
  },
];

export const ExerciseCardsScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const ITEM_HEIGHT = screenHeight * 0.8;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offset = event.nativeEvent.contentOffset.y;
        const newIndex = Math.round(offset / ITEM_HEIGHT);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
          setCurrentIndex(newIndex);
        }
      },
    }
  );

  const handleComplete = async () => {
    if (journalText.trim()) {
      await AsyncStorage.setItem('exercise_journal_' + Date.now(), journalText);
    }
    await AsyncStorage.setItem('hasCompletedExercise', 'true');
    navigation.goBack();
  };

  const handleStartRecording = async () => {
    try {
      const result = await Sound.startRecorder();
      console.log('Recording started:', result);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await Sound.stopRecorder();
      console.log('Recording stopped, file path:', result);
      setIsRecording(false);
      // For now, just log the result
      // Later we'll send this to transcription API
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // All cards are overlaid at the same position
  const renderOverlayCards = () => {
    return cards.map((card, index) => {
      const isInverted = card.isInverted;
      const textColor = isInverted ? colors.primary.white : colors.primary.black;

      // Fade timing
      const fadeInStart = (index - 0.8) * ITEM_HEIGHT;
      const fadeInEnd = (index - 0.1) * ITEM_HEIGHT;
      const fadeOutStart = (index + 0.3) * ITEM_HEIGHT;
      const fadeOutEnd = (index + 0.6) * ITEM_HEIGHT;

      // Much slower fade in for new text
      const opacity = scrollY.interpolate({
        inputRange: [
          fadeInStart,    // Start fading in early
          fadeInEnd,      // Fully visible just before center
          index * ITEM_HEIGHT,  // Center position
          fadeOutStart,   // Start fading out
          fadeOutEnd,     // Fully faded out
        ],
        outputRange: [0, 1, 1, 1, 0],
        extrapolate: 'clamp',
      });

      // Slide up animation - only moves when scrolling away
      const translateY = scrollY.interpolate({
        inputRange: [
          (index - 0.5) * ITEM_HEIGHT,
          index * ITEM_HEIGHT,
          (index + 0.5) * ITEM_HEIGHT,
        ],
        outputRange: [0, 0, -100],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={card.id}
          style={[
            styles.overlayCard,
            isInverted && styles.invertedCard,
            {
              opacity,
              transform: [{ translateY }]
            }
          ]}
          pointerEvents={currentIndex === index ? 'box-none' : 'none'}
        >
          {isInverted && currentIndex === index && (
            <View style={styles.invertedBackground} pointerEvents="none" />
          )}
          <Text style={[styles.cardText, { color: textColor }]}>
            {card.content}
          </Text>

          {card.hasJournal && currentIndex === index && (
            <View style={styles.journalContainer}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.journalInput, { color: textColor, borderColor: textColor }]}
                  placeholder="Write your reflection here..."
                  placeholderTextColor={isInverted ? '#999' : '#666'}
                  multiline
                  value={journalText}
                  onChangeText={setJournalText}
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[styles.microphoneButton, {
                    borderColor: textColor,
                    backgroundColor: isRecording ? 'rgba(255, 0, 0, 0.1)' : 'transparent'
                  }]}
                  onPress={() => {
                    if (isRecording) {
                      handleStopRecording();
                    } else {
                      handleStartRecording();
                    }
                  }}
                >
                  <Text style={[styles.microphoneIcon, { color: isRecording ? '#ff0000' : textColor }]}>
                    {isRecording ? '⏹️' : '🎙️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {index === cards.length - 1 && currentIndex === index && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>
                Complete
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Transparent scroll view for scrolling */}
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="normal"
        snapToAlignment="start"
        disableIntervalMomentum={true}
      >
        {cards.map((_, index) => (
          <View key={index} style={{ height: ITEM_HEIGHT, backgroundColor: 'transparent' }} />
        ))}
      </Animated.ScrollView>

      {/* Fixed overlay with all cards */}
      <View style={styles.contentContainer} pointerEvents="box-none">
        {renderOverlayCards()}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray100,
  },
  header: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.primary.black,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCard: {
    position: 'absolute',
    width: screenWidth,
    paddingHorizontal: spacing.xl * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invertedCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  invertedBackground: {
    position: 'absolute',
    top: -screenHeight,
    left: -screenWidth,
    right: -screenWidth,
    bottom: -screenHeight,
    backgroundColor: colors.primary.black,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardText: {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight['2xl'],
    fontWeight: '400',
    textAlign: 'center',
  },
  journalContainer: {
    marginTop: spacing.xl,
    width: '100%',
    maxWidth: 350,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  journalInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 120,
    fontSize: typography.fontSize.md,
    textAlignVertical: 'top',
  },
  microphoneButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  microphoneIcon: {
    fontSize: 24,
  },
  completeButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 1.5,
    backgroundColor: colors.primary.black,
    borderRadius: 6,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.primary.white,
  },
  progressContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary.black,
    borderRadius: 2,
  },
});