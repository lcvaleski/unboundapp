import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, colors, typography } from '../theme';

interface LogoProps {
  size?: number;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({ size = 60, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoPlaceholder, { width: size, height: size }]}>
        <Text style={styles.logoText}>MVP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  logoPlaceholder: {
    backgroundColor: colors.primary.orchid,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
  },
});