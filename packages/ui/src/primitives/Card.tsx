import { View, type ViewProps } from 'react-native';

type CardProps = ViewProps & {
  glass?: boolean;
};

export function Card({ glass = false, className, children, ...props }: CardProps) {
  return (
    <View
      className={`rounded-2xl border border-border p-4 ${glass ? 'bg-card/60' : 'bg-card'} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
