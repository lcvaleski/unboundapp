import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';

interface StartHereCardProps {
  onPress: () => void;
  freezeFrameUri?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const StartHereCard: React.FC<StartHereCardProps> = ({
  onPress,
  freezeFrameUri
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
              <View style={styles.playIconContainer}>
                <View style={styles.playIcon}>
                  <Text style={styles.playIconText}>▶</Text>
                </View>
              </View>
              <Text style={styles.startText}>Begin Here</Text>
              <Text style={styles.subtitle}>Meet your CBT expert guide</Text>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.placeholderContainer}>
          <View style={styles.content}>
            <View style={styles.playIconContainer}>
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶</Text>
              </View>
            </View>
            <Text style={styles.startText}>Begin Here</Text>
            <Text style={styles.subtitle}>Meet your CBT expert guide</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2C4F4A',
    borderWidth: 3,
    borderColor: '#8B4444',
    elevation: 8,
    shadowColor: '#8B4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  backgroundImage: {
    width: '100%',
    height: 180,
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
    height: 180,
    backgroundColor: '#2C4F4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  playIconContainer: {
    marginBottom: 16,
  },
  playIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    fontSize: 24,
    color: '#2C4F4A',
    marginLeft: 4,
  },
  startText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#F5E6D3',
    fontWeight: '500',
  },
});