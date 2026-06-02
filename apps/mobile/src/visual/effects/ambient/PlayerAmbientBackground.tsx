import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '@/store/settings.store';

type Props = {
  colors?: [string, string, string];
};

/** Fallback-first ambient background — upgrade to Skia in Phase 4 */
export function PlayerAmbientBackground({ colors = ['#1a0a2e', '#0a0a0f', '#0f172a'] }: Props) {
  const lowEndMode = useSettingsStore((s) => s.lowEndMode);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);

  if (lowEndMode) {
    return <View className="bg-background absolute inset-0" />;
  }

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ position: 'absolute', inset: 0, opacity: reducedMotion ? 0.6 : 1 }}
    />
  );
}
