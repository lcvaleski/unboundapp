import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

interface Slide {
  id: number;
  subtitle: string;
  backgroundColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    subtitle: "You've been mislead about your phone addiction.",
    backgroundColor: '#FFFFFF',
  },
  {
    id: 2,
    subtitle: "It's no secret that phones are making us less happy.",
    backgroundColor: '#FFFFFF',
  },
  {
    id: 3,
    subtitle: "But the solutions you've been sold don't last.",
    backgroundColor: '#FFFFFF',
  },
  {
    id: 4,
    subtitle: "App blockers don't work—you just end up bypassing them.",
    backgroundColor: '#FFFFFF',
  },
  {
    id: 5,
    subtitle: "What we need is a fundamental change from within.",
    backgroundColor: '#FFFFFF',
  },
  {
    id: 6,
    subtitle: "Your journey to a healthier relationship with your phone begins now.",
    backgroundColor: '#FFFFFF',
  }
];

interface OnboardingScreenProps {
  navigation: any;
  onComplete?: () => void;
  isPreview?: boolean;
}

export default function OnboardingScreen({ navigation, onComplete, isPreview = false }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start with text visible on first slide
    fadeAnim.setValue(1);
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      // Fade out current text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        // After fade out, change slide
        const nextSlide = currentSlide + 1;
        scrollViewRef.current?.scrollTo({
          x: nextSlide * screenWidth,
          animated: false, // No slide animation, just instant change
        });
        setCurrentSlide(nextSlide);

        // Then fade in new text
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      // Call the onComplete callback to update the parent state
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={false} // Disable manual scrolling
        showsHorizontalScrollIndicator={false}
      >
        {slides.map((slide) => (
          <View
            key={slide.id}
            style={[
              styles.slide,
              { backgroundColor: slide.backgroundColor },
            ]}
          >
            <View style={styles.slideContent}>
              <Animated.Text
                style={[
                  styles.subtitle,
                  { opacity: fadeAnim }
                ]}
              >
                {slide.subtitle}
              </Animated.Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentSlide === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    opacity: 0.2,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    opacity: 1,
    width: 20,
  },
  nextButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});