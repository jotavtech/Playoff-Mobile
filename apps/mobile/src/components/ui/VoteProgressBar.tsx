import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings.store';

type VoteProgressBarProps = {
  /** 0–100 */
  percentage: number;
  tone?: 'atlas' | 'playoff';
};

export function VoteProgressBar({ percentage, tone = 'playoff' }: VoteProgressBarProps) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const width = useSharedValue(reducedMotion ? percentage : 0);

  useEffect(() => {
    width.value = reducedMotion ? percentage : withTiming(percentage, { duration: 600 });
  }, [percentage, reducedMotion, width]);

  const style = useAnimatedStyle(() => ({ width: `${Math.min(100, Math.max(0, width.value))}%` }));

  return (
    <View className="bg-border h-2 w-full overflow-hidden rounded-full">
      <Animated.View
        style={style}
        className={`h-full rounded-full ${tone === 'atlas' ? 'bg-atlas' : 'bg-playoff'}`}
      />
    </View>
  );
}
