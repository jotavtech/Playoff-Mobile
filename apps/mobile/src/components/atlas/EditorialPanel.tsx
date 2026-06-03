import { type ReactNode, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@playoff/ui';
import { useSettingsStore } from '@/store/settings.store';
import { palette } from '@/theme/tokens';

type EditorialPanelProps = {
  index: string;
  eyebrow: string;
  title?: string;
  children: ReactNode;
  accent?: string;
};

export function EditorialPanel({
  index,
  eyebrow,
  title,
  children,
  accent = palette.orange,
}: EditorialPanelProps) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const entrance = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    entrance.value = withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) });
  }, [entrance]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 14 }],
  }));

  return (
    <Animated.View
      style={[
        {
          borderWidth: 1,
          borderColor: 'rgba(232,230,221,0.26)',
          backgroundColor: 'rgba(13,13,16,0.86)',
          borderRadius: 6,
        },
        animatedStyle,
      ]}
    >
      <View
        className="flex-row items-center justify-between border-b px-3 py-2"
        style={{ borderBottomColor: 'rgba(232,230,221,0.18)' }}
      >
        <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: accent }}>
          {index}
        </Text>
        <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: palette.gray }}>
          {eyebrow}
        </Text>
      </View>
      <View className="gap-3 p-3">
        {title ? (
          <Text className="text-lg font-black uppercase leading-5" style={{ color: palette.paper }}>
            {title}
          </Text>
        ) : null}
        {children}
      </View>
    </Animated.View>
  );
}
