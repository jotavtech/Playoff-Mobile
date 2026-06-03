/**
 * Atlas Playoff — design tokens (source of truth).
 * Dark, premium, futuristic. Atlas blue + Playoff orange on near-black.
 * Hex values are mirrored in tailwind.config.js — keep them in sync.
 */

export const palette = {
  /** Deepest background. */
  black: '#030303',
  /** Secondary background / sheet. */
  black2: '#08080D',
  /** Default card surface. */
  card: '#121216',
  /** Elevated card / hover surface. */
  cardElevated: '#17171C',
  /** Hairline borders. */
  border: '#25252D',
  /** Atlas brand blue. */
  blue: '#0404FA',
  /** Brighter blue for glows / accents. */
  blueGlow: '#3D5BFF',
  /** Playoff brand orange. */
  orange: '#FB6119',
  /** Soft orange glow. */
  orangeGlow: '#FF8A4C',
  /** Editorial cyan accent for technical UI. */
  cyan: '#37F5FF',
  /** Acid green accent for live/status details. */
  acid: '#D7FF3F',
  /** Magenta accent for social/music energy. */
  magenta: '#FF3DB8',
  /** Ink surface used by brutalist panels. */
  ink: '#0D0D10',
  /** Washed white for high-contrast editorial blocks. */
  paper: '#E8E6DD',
  /** Primary text. */
  white: '#F5F5F5',
  /** Secondary text. */
  gray: '#A1A1AA',
  /** Muted / tertiary text. */
  grayWeak: '#71717A',
  success: '#34D399',
  danger: '#F87171',
} as const;

export const visualTheme = {
  surface: palette.ink,
  surfaceElevated: palette.cardElevated,
  border: '#34343D',
  borderStrong: palette.paper,
  muted: palette.gray,
  glow: palette.blueGlow,
  accent: palette.orange,
  accentAlt: palette.cyan,
  live: palette.acid,
} as const;

export const accentPalettes = {
  atlas: {
    accent: palette.blueGlow,
    accentAlt: palette.cyan,
    glow: 'rgba(61, 91, 255, 0.34)',
    surface: palette.ink,
  },
  playoff: {
    accent: palette.orange,
    accentAlt: palette.acid,
    glow: 'rgba(251, 97, 25, 0.32)',
    surface: palette.black2,
  },
  social: {
    accent: palette.magenta,
    accentAlt: palette.cyan,
    glow: 'rgba(255, 61, 184, 0.26)',
    surface: palette.card,
  },
} as const;

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
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 30,
  full: 9999,
} as const;

export const motion = {
  fast: 150,
  normal: 250,
  slow: 420,
  spring: { damping: 18, stiffness: 180 },
} as const;

export const blur = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 48,
} as const;
