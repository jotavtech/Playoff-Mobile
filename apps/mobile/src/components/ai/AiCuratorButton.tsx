import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

type AiCuratorButtonProps = {
  onPress: () => void;
  variant?: 'pill' | 'icon';
};

/** Entry point to the Atlas AI Curator. */
export function AiCuratorButton({ onPress, variant = 'pill' }: AiCuratorButtonProps) {
  if (variant === 'icon') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Atlas AI Curator"
        className="border-atlas/40 bg-atlas/15 h-11 w-11 items-center justify-center rounded-full border active:opacity-80"
      >
        <Icon name="sparkles" size={20} color={palette.blueGlow} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="border-atlas/40 bg-atlas/10 flex-row items-center gap-2 rounded-2xl border px-4 py-3 active:opacity-90"
    >
      <View className="bg-atlas/20 h-8 w-8 items-center justify-center rounded-full">
        <Icon name="sparkles" size={18} color={palette.blueGlow} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">Atlas AI Curator</Text>
        <Text variant="caption">Monte uma rodada com IA</Text>
      </View>
      <Icon name="arrow-right" size={16} color={palette.gray} />
    </Pressable>
  );
}
