export const colors = {
  // Primary colors - Rich oak wood tones
  primary: {
    oak: '#8B6F47',          // Rich oak wood
    oakDark: '#6B5637',      // Deep oak
    oakLight: '#A68B5B',     // Light oak
  },
  // Accent colors - Warm wood and earth tones
  accent: {
    walnut: '#5D4E37',       // Deep walnut brown
    chestnut: '#954535',     // Rich chestnut
    mahogany: '#C04000',     // Warm mahogany
    cream: '#F5E6D3',        // Warm cream
    ivory: '#FFFEF7',        // Soft ivory
    sand: '#D4B896',         // Warm sand
    peachLight: '#FFE5D1',   // Keep for compatibility
    lavenderLight: '#E8DEFF', // Keep for compatibility
  },
  // Neutral colors - Warm grays
  neutral: {
    white: '#FFFFFF',
    offWhite: '#FAF8F3',     // Warm off-white
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#A0A0A0',
    gray500: '#757575',
    gray600: '#4E4E4E',
    gray700: '#3A3A3A',
    gray800: '#2A2A2A',
    gray900: '#1A1A1A',
    black: '#000000',
  },
  // Semantic colors - Muted earth tones
  semantic: {
    success: '#8B7355',      // Warm brown
    warning: '#D4A574',      // Warm amber
    error: '#B85450',        // Muted brick red
    info: '#7A6F65',         // Soft gray-brown
  },
  // Background colors
  background: {
    default: '#FAF8F3',      // Warm off-white
    paper: '#FFFFFF',
    gradient: {
      start: '#8B6F47',      // Oak
      middle: '#6B5637',     // Deep oak
      end: '#5D4E37',        // Walnut
    },
  },
  // Border colors
  border: {
    light: '#E8E8E8',
    medium: '#D0D0D0',
    dark: '#A0A0A0',
  },
  // Text colors
  text: {
    primary: '#3A3A3A',
    secondary: '#5A5A5A',
    tertiary: '#7A7A7A',
    inverse: '#FFFFFF',
  },
} as const;

export type ColorKeys = keyof typeof colors;