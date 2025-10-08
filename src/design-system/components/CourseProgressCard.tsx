import React, { useState } from 'react';
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
  onCompleteToggle?: (completed: boolean) => void;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  day,
  title,
  description,
  isCompleted: propIsCompleted = false,
  isActive = false,
  isLocked = true,
  onPress,
  onCompleteToggle,
}) => {
  const [isCompleted, setIsCompleted] = useState(propIsCompleted);
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

  const handleCheckboxPress = (e: any) => {
    e.stopPropagation();
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    onCompleteToggle?.(newCompleted);
  };

  const canMarkComplete = !isLocked || isActive || day === 2 || day === 3; // Allow day 2 & 3 for testing

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLocked && !isActive && !canMarkComplete && styles.lockedContainer,
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      disabled={isLocked && !isActive && day !== 2 && day !== 3}
      activeOpacity={0.8}
    >
      <View style={styles.timelineContainer}>
        <View style={styles.timelineLine} />
        {getLockIcon()}
      </View>

      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <View style={styles.textContent}>
            <Text style={[
              styles.dayLabel,
              isLocked && !isActive && !canMarkComplete && styles.lockedText,
            ]}>
              DAY {day}
            </Text>
            <Text style={[
              styles.title,
              isLocked && !isActive && !canMarkComplete && styles.lockedText,
              isCompleted && styles.completedText,
            ]}>
              {title}
            </Text>
            <Text style={[
              styles.description,
              isLocked && !isActive && !canMarkComplete && styles.lockedText,
              isCompleted && styles.completedText,
            ]}>
              {description}
            </Text>
          </View>

          {canMarkComplete && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxPress}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}
        </View>
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
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2C4F4A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#2C4F4A',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});