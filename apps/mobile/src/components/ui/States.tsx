import { ActivityIndicator, Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { palette } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Real empty state — never fake data. */
export function EmptyState({
  icon = 'sparkles',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center gap-3 px-6 py-12">
      <View className="border-border bg-card mb-1 h-14 w-14 items-center justify-center rounded-2xl border">
        <Icon name={icon} size={26} color={palette.gray} />
      </View>
      <Text variant="title" className="text-center">
        {title}
      </Text>
      {message ? (
        <Text variant="caption" className="text-center leading-5">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="bg-playoff mt-2 rounded-xl px-5 py-3 active:opacity-90"
          accessibilityRole="button"
        >
          <Text className="text-sm font-bold uppercase tracking-widest text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LoadingState({ message = 'Carregando…' }: { message?: string }) {
  return (
    <View className="items-center justify-center gap-3 py-12">
      <ActivityIndicator color={palette.blueGlow} />
      <Text variant="caption">{message}</Text>
    </View>
  );
}

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = 'Algo deu errado. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="items-center justify-center gap-3 px-6 py-12">
      <Text variant="title" className="text-danger text-center">
        Ops
      </Text>
      <Text variant="caption" className="text-center leading-5">
        {message}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="border-border bg-card-elevated mt-2 rounded-xl border px-5 py-3 active:opacity-80"
          accessibilityRole="button"
        >
          <Text className="text-foreground text-sm font-bold uppercase tracking-widest">
            Tentar novamente
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
