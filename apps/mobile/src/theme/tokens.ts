/**
 * Atlas Playoff visual tokens (source of truth).
 * Technical noir: absolute black, warm off-white, low-contrast grid, signal red.
 * Hex values are mirrored in tailwind.config.js - keep them in sync.
 */

export const palette = {
  /** Deepest background. */
  black: '#070707',
  /** Secondary background / sheet. */
  black2: '#0A0908',
  /** Default panel surface. */
  card: '#0E0D0C',
  /** Elevated panel surface. */
  cardElevated: '#151311',
  /** Hairline borders. */
  border: '#23211E',
  /** Legacy Atlas neutral. */
  blue: '#2C2A27',
  /** Legacy Atlas glow neutral. */
  blueGlow: '#5C554D',
  /** Playoff signal red. */
  orange: '#FF3B1F',
  /** Soft red haze. */
  orangeGlow: '#A33A24',
  /** Technical neutral accent. */
  cyan: '#BDB5AA',
  /** High-contrast status text. */
  acid: '#F2EEE7',
  /** Muted red alternate. */
  magenta: '#8F2B1F',
  /** Ink surface used by dossier panels. */
  ink: '#090807',
  /** Warm paper white. */
  paper: '#F2EEE7',
  /** Primary text. */
  white: '#F2EEE7',
  /** Secondary text. */
  gray: '#BDB5AA',
  /** Muted / tertiary text. */
  grayWeak: '#736C63',
  success: '#BDB5AA',
  danger: '#FF3B1F',
} as const;

export const visualTheme = {
  surface: palette.ink,
  surfaceElevated: palette.cardElevated,
  border: '#2B2824',
  borderStrong: palette.paper,
  muted: palette.gray,
  glow: palette.orangeGlow,
  accent: palette.orange,
  accentAlt: palette.paper,
  live: palette.paper,
} as const;

export const accentPalettes = {
  atlas: {
    accent: palette.orange,
    accentAlt: palette.paper,
    glow: 'rgba(255, 59, 31, 0.16)',
    surface: palette.ink,
  },
  playoff: {
    accent: palette.orange,
    accentAlt: palette.paper,
    glow: 'rgba(255, 59, 31, 0.18)',
    surface: palette.black2,
  },
  social: {
    accent: palette.orange,
    accentAlt: palette.gray,
    glow: 'rgba(255, 59, 31, 0.14)',
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
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  '2xl': 12,
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
