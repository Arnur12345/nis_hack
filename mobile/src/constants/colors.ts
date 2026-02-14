// Single cohesive forest-green palette, minimal and clean
export const Colors = {
  // Primary
  primary: '#1B4332',
  primaryLight: '#2D6A4F',
  primaryMuted: '#40916C',
  accent: '#52B788',
  accentLight: '#95D5B2',
  accentSurface: '#D8F3DC',

  // Neutrals
  background: '#F7F8F7',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',

  // Semantic (muted, consistent)
  success: '#40916C',
  warning: '#B45309',
  danger: '#DC2626',

  // XP
  xpBar: '#52B788',
  xpBarBg: '#E5E7EB',

  // Tab bar
  tabBar: '#1B4332',
  tabActive: '#FFFFFF',
  tabInactive: 'rgba(255,255,255,0.4)',

  // Category colors (all derived from same warmth)
  ecology: '#2D6A4F',
  social: '#92400E',
  animals: '#854D0E',
  education: '#1E40AF',

  // Overlay
  overlay: 'rgba(17, 24, 39, 0.5)',
};

// Category icon names (lucide icon names)
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

// Spacing tokens
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Radius tokens
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// Shadow presets
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
