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
          borderColor: 'rgba(242,238,231,0.12)',
          backgroundColor: 'rgba(7,7,7,0.72)',
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    >
      <View
        className="flex-row items-center justify-between border-b px-3 py-2"
        style={{ borderBottomColor: 'rgba(242,238,231,0.08)' }}
      >
        <Text className="font-mono text-[10px] uppercase" style={{ color: accent, letterSpacing: 2.8 }}>
          {index}
        </Text>
        <Text className="font-mono text-[10px] uppercase" style={{ color: palette.grayWeak, letterSpacing: 2.8 }}>
          {eyebrow}
        </Text>
      </View>
      <View className="gap-3 p-3">
        {title ? (
          <Text className="text-base font-black uppercase leading-5" style={{ color: palette.paper }}>
            {title}
          </Text>
        ) : null}
        {children}
      </View>
    </Animated.View>
  );
}
