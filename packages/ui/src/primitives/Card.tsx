import { View, type ViewProps } from 'react-native';

type CardProps = ViewProps & {
  glass?: boolean;
};

export function Card({ glass = false, className, children, ...props }: CardProps) {
  return (
    <View
      className={`border-border rounded-xl border p-4 ${glass ? 'bg-card/70' : 'bg-card'} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
