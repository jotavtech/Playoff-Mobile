/** @type {import('tailwindcss').Config} */
// Atlas palette mirrored from src/theme/tokens.ts - keep in sync.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // App is dark-only (userInterfaceStyle: "dark"). Class-based dark mode lets
  // NativeWind set the scheme instead of throwing on the 'media' default.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#070707',
        background: '#070707',
        'background-elevated': '#0A0908',
        card: '#0E0D0C',
        'card-elevated': '#151311',
        border: '#23211E',
        atlas: {
          DEFAULT: '#2C2A27',
          glow: '#5C554D',
        },
        playoff: {
          DEFAULT: '#FF3B1F',
          glow: '#A33A24',
        },
        foreground: '#F2EEE7',
        muted: '#BDB5AA',
        'muted-weak': '#736C63',
        success: '#BDB5AA',
        danger: '#FF3B1F',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
