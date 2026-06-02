import { View } from 'react-native';

type GradientOrbProps = {
  color: string;
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  opacity?: number;
};

/**
 * A soft, blurred color orb used for ambient Atlas glow. Implemented as a
 * heavily-rounded translucent view so it stays cheap on low-end devices.
 */
export function GradientOrb({
  color,
  size,
  top,
  bottom,
  left,
  right,
  opacity = 0.5,
}: GradientOrbProps) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        top,
        bottom,
        left,
        right,
      }}
    />
  );
}
