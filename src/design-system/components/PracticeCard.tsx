import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface PracticeCardProps {
  title: string;
  subtitle?: string;
  description: string;
  buttonText?: string;
  onPress: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  subtitle,
  description,
  buttonText = 'Begin',
  onPress,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (isFlipped) return;

    setIsFlipped(true);

    // Start flip animation
    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Navigate immediately as flip starts
    setTimeout(() => {
      onPress();
      // Reset for next time
      setTimeout(() => {
        setIsFlipped(false);
        flipAnimation.setValue(0);
      }, 1000);
    }, 50); // Just 50ms delay to see the flip start
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
    backfaceVisibility: 'hidden' as const,
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  return (
    <View style={styles.cardContainer}>
      {/* Front of card */}
      <Animated.View
        style={[
          styles.cardFace,
          frontAnimatedStyle
        ]}
      >
        <LinearGradient
          colors={['#2C4F4A', '#1A3A36', '#0F2622']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <Text style={styles.label}>TODAY'S CHALLENGE</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            <Text style={styles.description}>{description}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Back of card - only visible when flipped */}
      {isFlipped && (
        <Animated.View
          style={[
            styles.cardFace,
            backAnimatedStyle
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={['#F5E6D3', '#E8D4BC', '#D4B896']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              <Text style={styles.backTitle}>Opening Challenge...</Text>
              <View style={styles.loadingDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    height: 280,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: 24,
    paddingBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F5E6D3',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 80,
    alignSelf: 'center',
    minWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(44, 79, 74, 0.1)',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A3A36',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  backTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C4F4A',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2C4F4A',
    opacity: 0.3,
  },
});