import { View, type ViewProps } from 'react-native';

type GlassCardProps = ViewProps & {
  /** Highlight the card with a brand-tinted border. */
  highlight?: 'atlas' | 'playoff';
};

export function GlassCard({ highlight, className, children, ...props }: GlassCardProps) {
  const border =
    highlight === 'atlas'
      ? 'border-atlas/40'
      : highlight === 'playoff'
        ? 'border-playoff/40'
        : 'border-border';
  return (
    <View
      className={`rounded-2xl border ${border} bg-card-elevated/80 p-5 ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
