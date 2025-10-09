import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';

interface ReflectionCardProps {
  onPress: () => void;
  freezeFrameUri?: string;
  dayNumber: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const ReflectionCard: React.FC<ReflectionCardProps> = ({
  onPress,
  freezeFrameUri,
  dayNumber
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {freezeFrameUri ? (
        <ImageBackground
          source={{ uri: freezeFrameUri }}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.content}>
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.reflectionText}>Reflection</Text>
                <Text style={styles.subtitle}>Day {dayNumber} check-in</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.placeholderContainer}>
          <View style={styles.content}>
            <View style={styles.playIcon}>
              <Text style={styles.playIconText}>▶</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.reflectionText}>Reflection</Text>
              <Text style={styles.subtitle}>Day {dayNumber} check-in</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 32, // Increased margin for narrower card
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2C4F4A',
    borderWidth: 2,
    borderColor: '#8B4444',
    elevation: 5,
    shadowColor: '#8B4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backgroundImage: {
    width: '100%',
    height: 90, // Reduced height
  },
  imageStyle: {
    opacity: 0.65,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 79, 74, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    height: 90, // Reduced height
    backgroundColor: '#2C4F4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 16,
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    fontSize: 16,
    color: '#2C4F4A',
    marginLeft: 2,
  },
  reflectionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#F5E6D3',
    fontWeight: '500',
    marginTop: 2,
  },
});