// Soft pastel + neutral system from design.md, adapted for Spirit of the City
export const Colors = {
  // Primary (Lavender)
  primary: '#B9A7F6',
  primaryLight: '#C4B5F7',
  primaryMuted: '#9B87F5',
  accent: '#F4DE9E',        // Soft yellow (secondary)
  accentLight: '#D4C8FC',
  accentSurface: '#F0ECFF', // Very light lavender tint

  // Neutrals
  background: '#F8F7FB',    // Surface Light
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#8E8E98',
  textLight: '#B0B0BA',
  border: '#E8E8ED',
  borderLight: '#F3F4F6',
  divider: '#E8E8ED',
  inputBg: '#F1F1F4',       // Input background (borderless style)

  // Semantic
  success: '#34C759',
  warning: '#FFCC00',
  danger: '#FF3B30',

  // XP
  xpBar: '#B9A7F6',
  xpBarBg: '#E8E8ED',

  // Tab bar (dark surface)
  tabBar: '#1E1F23',
  tabActive: '#FFFFFF',
  tabInactive: 'rgba(255,255,255,0.4)',

  // Category colors (vibrant pastels)
  ecology: '#34C759',
  social: '#FF6B8A',
  animals: '#F59E0B',
  education: '#5AC8FA',

  // Overlay
  overlay: 'rgba(26, 26, 26, 0.5)',
};

export const CategoryIconNames: Record<string, string> = {
  all: 'list',
  ecology: 'leaf',
  social: 'heart-handshake',
  animals: 'paw-print',
  education: 'book-open',
};

export const CategoryLabels: Record<string, string> = {
  all: 'Все',
  ecology: 'Экология',
  social: 'Социальные',
  animals: 'Животные',
  education: 'Образование',
};

export const CategoryColors: Record<string, string> = {
  ecology: Colors.ecology,
  social: Colors.social,
  animals: Colors.animals,
  education: Colors.education,
};

// Spacing tokens (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Radius tokens (generous rounding per design)
export const Radius = {
  sm: 12,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  full: 999,
};

// Shadow presets (very soft elevation)
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 6,
  },
};
