import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { useSettingsStore } from '@/store/settings.store';
import { palette } from '@/theme/tokens';
import { GradientOrb } from './GradientOrb';

type AtlasBackgroundProps = {
  children?: ReactNode;
  /** Tint the ambient glow toward blue (default) or orange. */
  tone?: 'atlas' | 'playoff';
};

/**
 * The signature Atlas backdrop: near-black base, a vertical gradient and two
 * blurred brand orbs. Honors lowEndMode (drops the blur) for performance.
 */
export function AtlasBackground({ children, tone = 'atlas' }: AtlasBackgroundProps) {
  const lowEndMode = useSettingsStore((s) => s.lowEndMode);
  const orbColor = tone === 'playoff' ? palette.orange : palette.blue;

  return (
    <View className="bg-background flex-1">
      <View pointerEvents="none" className="absolute inset-0">
        <LinearGradient
          colors={[palette.black, palette.black2, palette.black]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <GradientOrb color={orbColor} size={320} top={-120} right={-80} opacity={0.28} />
        <GradientOrb color={palette.orange} size={260} bottom={40} left={-110} opacity={0.16} />
        {!lowEndMode && (
          <BlurView
            intensity={70}
            tint="dark"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
      </View>
      {children}
    </View>
  );
}
