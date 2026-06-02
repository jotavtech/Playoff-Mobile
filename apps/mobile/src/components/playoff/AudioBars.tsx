import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings.store';
import { palette } from '@/theme/tokens';

const BARS = [0.4, 0.85, 0.55, 1, 0.7];

function Bar({ index, active, color }: { index: number; active: boolean; color: string }) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const peak = BARS[index % BARS.length] ?? 0.6;
  const scale = useSharedValue(0.4);

  useEffect(() => {
    if (!active || reducedMotion) {
      scale.value = withTiming(active ? peak : 0.3, { duration: 200 });
      return;
    }
    scale.value = withRepeat(withTiming(peak, { duration: 380 + index * 90 }), -1, true);
  }, [active, reducedMotion, peak, index, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: scale.value }] }));

  return (
    <Animated.View
      style={[{ width: 3, height: 22, borderRadius: 3, backgroundColor: color }, style]}
    />
  );
}

type AudioBarsProps = {
  active?: boolean;
  color?: string;
};

/** Decorative equalizer used in the leader player. */
export function AudioBars({ active = true, color = palette.orange }: AudioBarsProps) {
  return (
    <View className="flex-row items-center gap-1" pointerEvents="none">
      {BARS.map((_, i) => (
        <Bar key={i} index={i} active={active} color={color} />
      ))}
    </View>
  );
}
