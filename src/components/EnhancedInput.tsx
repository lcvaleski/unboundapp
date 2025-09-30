import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { colors, spacing, typography } from '../design-system/theme';

interface EnhancedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showClearButton?: boolean;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  icon,
  showClearButton = false,
  style,
  value,
  onChangeText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.staticLabel}>{label}</Text>
      )}
      <View style={[
        styles.container,
        isFocused && styles.focused,
        error && styles.errorBorder,
      ]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            showClearButton && value && styles.inputWithClear,
            style
          ]}
          placeholderTextColor={colors.neutral.gray400}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showClearButton && value && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

EnhancedInput.displayName = 'EnhancedInput';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.sm,
  },
  staticLabel: {
    color: colors.primary.black,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'relative',
    minHeight: 56,
  },
  focused: {
    borderColor: colors.primary.black,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorBorder: {
    borderColor: colors.semantic.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.primary.black,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    ...Platform.select({
      ios: {
        paddingTop: spacing.md + 2,
        paddingBottom: spacing.md - 2,
      },
    }),
  },
  inputWithIcon: {
    paddingLeft: spacing.md,
  },
  inputWithClear: {
    paddingRight: spacing.xs,
  },
  icon: {
    marginLeft: spacing.lg,
  },
  clearButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  clearButtonText: {
    color: colors.primary.black,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
  },
  error: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
});