import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface CourseProgressCardProps {
  day: number;
  title: string;
  description: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  onPress?: () => void;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  day,
  title,
  description,
  isCompleted = false,
  isActive = false,
  isLocked = true,
  onPress,
}) => {
  const getLockIcon = () => {
    if (isCompleted) {
      return (
        <View style={styles.iconContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      );
    }
    if (isLocked && !isActive) {
      return (
        <View style={[styles.iconContainer, styles.lockedIcon]}>
          <Text style={styles.lock}>🔒</Text>
        </View>
      );
    }
    return (
      <View style={[styles.iconContainer, styles.activeIcon]}>
        <View style={styles.activeDot} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLocked && !isActive && styles.lockedContainer,
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      disabled={isLocked && !isActive}
      activeOpacity={0.8}
    >
      <View style={styles.timelineContainer}>
        <View style={styles.timelineLine} />
        {getLockIcon()}
      </View>

      <View style={styles.content}>
        <Text style={[
          styles.dayLabel,
          isLocked && !isActive && styles.lockedText,
        ]}>
          DAY {day}
        </Text>
        <Text style={[
          styles.title,
          isLocked && !isActive && styles.lockedText,
          isCompleted && styles.completedText,
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.description,
          isLocked && !isActive && styles.lockedText,
          isCompleted && styles.completedText,
        ]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 0,
    paddingVertical: 16,
    paddingRight: 16,
  },
  lockedContainer: {
    opacity: 0.5,
  },
  completedContainer: {
    opacity: 0.8,
  },
  timelineContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    height: '120%',
    backgroundColor: '#3D5954',
    top: -10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C4F4A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  lockedIcon: {
    backgroundColor: '#E0E0E0',
  },
  activeIcon: {
    backgroundColor: '#2C4F4A',
    borderWidth: 3,
    borderColor: '#FAF8F3',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FAF8F3',
  },
  checkmark: {
    color: '#FAF8F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lock: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#5D4E37',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2C4F4A',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#757575',
    lineHeight: 18,
  },
  lockedText: {
    color: '#999999',
  },
  completedText: {
    color: '#666666',
  },
});