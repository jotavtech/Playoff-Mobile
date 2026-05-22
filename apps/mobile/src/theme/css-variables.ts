import { colors, radius } from './tokens';

/** HSL CSS variables consumed by NativeWind / tailwind.config */
export const cssVariables = `
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --card: ${colors.card};
  --card-foreground: ${colors.foreground};
  --primary: ${colors.primary};
  --primary-foreground: 255 255 255;
  --secondary: ${colors.secondary};
  --secondary-foreground: ${colors.foreground};
  --muted: ${colors.muted};
  --muted-foreground: 160 160 180;
  --accent: ${colors.accent};
  --accent-foreground: 255 255 255;
  --border: ${colors.border};
  --destructive: ${colors.destructive};
  --radius-lg: ${radius.lg}px;
  --radius-xl: ${radius.xl}px;
  --radius-2xl: ${radius['2xl']}px;
`;
