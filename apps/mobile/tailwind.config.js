/** @type {import('tailwindcss').Config} */
// Atlas palette mirrored from src/theme/tokens.ts — keep in sync.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        black: '#030303',
        background: '#030303',
        'background-elevated': '#08080D',
        card: '#121216',
        'card-elevated': '#17171C',
        border: '#25252D',
        atlas: {
          DEFAULT: '#0404FA',
          glow: '#3D5BFF',
        },
        playoff: {
          DEFAULT: '#FB6119',
          glow: '#FF8A4C',
        },
        foreground: '#F5F5F5',
        muted: '#A1A1AA',
        'muted-weak': '#71717A',
        success: '#34D399',
        danger: '#F87171',
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '24px',
        '2xl': '30px',
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
