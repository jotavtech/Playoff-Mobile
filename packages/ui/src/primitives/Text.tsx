import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type TextVariant = 'display' | 'title' | 'body' | 'caption' | 'label';

type TextProps = RNTextProps & {
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  display: 'text-3xl font-bold text-foreground',
  title: 'text-xl font-semibold text-foreground',
  body: 'text-base text-foreground',
  caption: 'text-sm text-muted-foreground',
  label: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
};

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return (
    <RNText className={`${variantClasses[variant]} ${className ?? ''}`} {...props} />
  );
}
