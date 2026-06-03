import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settings.store';
import { palette } from '@/theme/tokens';

type AccentOrbProps = {
  color?: string;
  secondaryColor?: string;
  size?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  rotate?: string;
  opacity?: number;
};

export function AccentOrb({
  color = palette.blueGlow,
  secondaryColor = palette.orange,
  size = 260,
  top,
  bottom,
  left,
  right,
  rotate = '-12deg',
  opacity = 0.28,
}: AccentOrbProps) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    drift.value = withRepeat(
      withTiming(1, { duration: 6200, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, [drift, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 18 },
      { translateY: drift.value * -10 },
      { rotate },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top,
          bottom,
          left,
          right,
          width: size,
          height: Math.round(size * 0.58),
          opacity,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[color, 'rgba(255,255,255,0.08)', secondaryColor, 'rgba(3,3,3,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.18)',
        }}
      />
    </Animated.View>
  );
}
