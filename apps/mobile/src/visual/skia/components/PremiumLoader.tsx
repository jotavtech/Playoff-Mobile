import { ActivityIndicator, View } from 'react-native';
import { useSettingsStore } from '@/store/settings.store';

type Props = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = { sm: 'small' as const, md: 'large' as const, lg: 'large' as const };

/**
 * Skia loader — placeholder com ActivityIndicator.
 * Substituir por Canvas Skia quando `@shopify/react-native-skia` estiver validado no device.
 */
export function PremiumLoader({ size = 'md' }: Props) {
  const lowEndMode = useSettingsStore((s) => s.lowEndMode);

  return (
    <View className="items-center justify-center p-4" accessibilityRole="progressbar">
      <ActivityIndicator size={sizeMap[size]} color={lowEndMode ? '#888' : '#a855f7'} />
    </View>
  );
}
