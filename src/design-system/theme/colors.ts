export const colors = {
  // Primary colors - Black & White only
  primary: {
    black: '#000000',
    white: '#FFFFFF',
  },
  // Grayscale for subtle variations
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
  // Semantic colors - Using grayscale
  semantic: {
    success: '#000000',
    warning: '#424242',
    error: '#000000',
    info: '#616161',
  },
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    dark: '#000000',
  },
  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#000000',
  },
} as const;

export type ColorKeys = keyof typeof colors;