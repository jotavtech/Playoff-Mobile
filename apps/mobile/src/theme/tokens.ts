/** Design tokens — source of truth for spacing, motion, blur, typography */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const motion = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: { damping: 18, stiffness: 180 },
} as const;

export const blur = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const colors = {
  background: '10 10 15',
  foreground: '245 245 250',
  card: '18 18 28',
  primary: '168 85 247',
  secondary: '39 39 58',
  muted: '30 30 45',
  accent: '236 72 153',
  border: '45 45 68',
  destructive: '239 68 68',
} as const;
