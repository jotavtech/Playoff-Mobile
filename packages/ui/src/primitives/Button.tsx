import { Pressable, type PressableProps } from 'react-native';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:opacity-90',
  secondary: 'bg-secondary active:opacity-90',
  ghost: 'bg-transparent active:bg-muted/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-4 py-3 rounded-xl',
  lg: 'px-6 py-4 rounded-2xl',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...props}
    >
      <Text variant="label" className={variant === 'ghost' ? 'text-foreground' : 'text-primary-foreground'}>
        {label}
      </Text>
    </Pressable>
  );
}
