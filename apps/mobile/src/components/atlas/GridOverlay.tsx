import { View } from 'react-native';
import { palette } from '@/theme/tokens';

const VERTICAL_LINES = Array.from({ length: 6 }, (_, index) => index);
const HORIZONTAL_LINES = Array.from({ length: 9 }, (_, index) => index);
const NOISE_MARKS = [
  { top: '9%', left: '22%', width: 18 },
  { top: '14%', left: '74%', width: 6 },
  { top: '24%', left: '12%', width: 10 },
  { top: '31%', left: '88%', width: 20 },
  { top: '43%', left: '34%', width: 8 },
  { top: '52%', left: '62%', width: 14 },
  { top: '63%', left: '18%', width: 22 },
  { top: '76%', left: '82%', width: 12 },
  { top: '84%', left: '44%', width: 16 },
] as const;

type GridOverlayProps = {
  opacity?: number;
};

export function GridOverlay({ opacity = 0.18 }: GridOverlayProps) {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity }}
    >
      {VERTICAL_LINES.map((line) => (
        <View
          key={`v-${line}`}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(line / (VERTICAL_LINES.length - 1)) * 100}%`,
            width: 1,
            backgroundColor: palette.paper,
          }}
        />
      ))}
      {HORIZONTAL_LINES.map((line) => (
        <View
          key={`h-${line}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${(line / (HORIZONTAL_LINES.length - 1)) * 100}%`,
            height: 1,
            backgroundColor: palette.paper,
          }}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          width: 36,
          height: 1,
          backgroundColor: palette.orange,
          opacity: 0.8,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          width: 1,
          height: 36,
          backgroundColor: palette.orange,
          opacity: 0.8,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 20,
          bottom: 28,
          width: 44,
          height: 1,
          backgroundColor: palette.grayWeak,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 20,
          bottom: 28,
          width: 1,
          height: 44,
          backgroundColor: palette.grayWeak,
        }}
      />
      {NOISE_MARKS.map((mark) => (
        <View
          key={`${mark.top}-${mark.left}`}
          style={{
            position: 'absolute',
            top: mark.top,
            left: mark.left,
            width: mark.width,
            height: 1,
            backgroundColor: palette.paper,
            opacity: 0.32,
          }}
        />
      ))}
    </View>
  );
}
