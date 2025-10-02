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
  Alert,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../design-system/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-nitro-sound';
import { ENDPOINTS } from '../config/api';

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
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

      // Send to transcription API
      await transcribeAudio(result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop recording');
    }
  };

  const analyzeTranscription = async (transcription: string) => {
    try {
      console.log('Getting AI analysis...');
      setIsAnalyzing(true);
      setAiAnalysis(''); // Clear any previous analysis

      // Get exercise cards up to the journal card (card 9)
      const exerciseCards = cards
        .slice(0, 9)
        .map(card => card.content);

      const response = await fetch(ENDPOINTS.analyze, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription,
          exerciseCards,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('AI Analysis:', data.analysis);
        setAiAnalysis(data.analysis);
      } else {
        console.error('Analysis failed:', data.message);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Don't show alert - analysis is optional enhancement
    } finally {
      setIsAnalyzing(false);
    }
  };

  const transcribeAudio = async (audioPath: string) => {
    try {
      console.log('Transcribing audio from:', audioPath);

      // Create form data
      const formData = new FormData();
      formData.append('audio', {
        uri: Platform.OS === 'ios' ? audioPath : `file://${audioPath}`,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      // Send to backend
      const response = await fetch(ENDPOINTS.transcribe, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Transcription result:', data.text);
        // Update journal text with transcription
        setJournalText(data.text);
        setModalText(data.text);

        // Now get AI analysis
        await analyzeTranscription(data.text);
      } else {
        throw new Error(data.message || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      Alert.alert('Transcription Error', 'Failed to transcribe audio. Please try again.');
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
              <View style={styles.inputModeContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    styles.dictateButton,
                    isRecording && styles.modeButtonRecording,
                  ]}
                  onPress={() => {
                    if (!isRecording) {
                      handleStartRecording();
                    } else {
                      handleStopRecording();
                    }
                  }}
                >
                  <Text style={styles.dictateButtonText}>
                    {isRecording ? 'Recording...' : 'Dictate'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modeButton}
                  onPress={() => {
                    setModalText(journalText);
                    setShowTypeModal(true);
                  }}
                >
                  <Text style={styles.modeButtonText}>
                    Type
                  </Text>
                </TouchableOpacity>
              </View>

              {journalText ? (
                <View style={styles.transcriptionContainer}>
                  <Text style={[styles.transcriptionText, { color: textColor }]}>
                    {journalText}
                  </Text>
                  {(isAnalyzing || aiAnalysis) ? (
                    <View style={styles.analysisContainer}>
                      <Text style={[styles.analysisText, { color: textColor }]}>
                        {isAnalyzing ? 'Analyzing your reflection...' : aiAnalysis}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
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

      <Modal
        visible={showTypeModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowTypeModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTypeModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Type Your Reflection</Text>
            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={async () => {
                setJournalText(modalText);
                setShowTypeModal(false);
                // Get AI analysis for typed text too
                if (modalText.trim()) {
                  // Don't await here so modal closes immediately
                  analyzeTranscription(modalText);
                }
              }}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TextInput
              style={styles.modalTextInput}
              placeholder="What came up for you in that one minute?"
              placeholderTextColor="#999"
              multiline
              value={modalText}
              onChangeText={setModalText}
              autoFocus
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
    marginTop: spacing.xl * 2,
    width: '100%',
    maxWidth: 350,
  },
  inputModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  modeButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dictateButton: {
    backgroundColor: '#5A7A5A',
    borderColor: '#5A7A5A',
  },
  modeButtonRecording: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  modeButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary.black,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  dictateButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary.white,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  // Custom microphone icon
  micIconContainer: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIconBody: {
    width: 20,
    height: 28,
    backgroundColor: colors.primary.white,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.primary.white,
  },
  micIconDot: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: 8,
    backgroundColor: colors.primary.white,
    borderRadius: 4,
  },
  // Custom type/edit icon
  typeIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIconLine1: {
    width: 24,
    height: 3,
    backgroundColor: colors.primary.black,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  typeIconLine2: {
    width: 8,
    height: 8,
    backgroundColor: colors.primary.black,
    position: 'absolute',
    bottom: -2,
    right: 0,
    transform: [{ rotate: '45deg' }],
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.primary.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.primary.black,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  modalCloseText: {
    fontSize: typography.fontSize.md,
    color: colors.primary.black,
  },
  modalDoneButton: {
    padding: spacing.xs,
  },
  modalDoneText: {
    fontSize: typography.fontSize.md,
    color: '#5A7A5A',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalTextInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg * 1.5,
    color: colors.primary.black,
    textAlignVertical: 'top',
    padding: spacing.md,
  },
  // Transcription display
  transcriptionContainer: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: 350,
    width: '100%',
  },
  transcriptionText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md * 1.4,
    textAlign: 'center',
  },
  analysisContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
  },
  analysisText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm * 1.4,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});