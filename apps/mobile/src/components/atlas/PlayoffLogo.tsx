import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { palette } from '@/theme/tokens';

type PlayoffLogoProps = {
  compact?: boolean;
  kicker?: string;
};

export function PlayoffLogo({ compact = false, kicker = 'ATLAS ECOSYSTEM' }: PlayoffLogoProps) {
  return (
    <View accessibilityRole="header">
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          className="font-mono text-[10px] uppercase"
          style={{ color: palette.gray, letterSpacing: 3.2 }}
        >
          {kicker}
        </Text>
        <Text
          className="font-mono text-[10px]"
          style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
        >
          NODE_27.12
        </Text>
      </View>
      <Text
        className={`${compact ? 'text-[42px]' : 'text-[68px]'} font-black uppercase leading-none`}
        style={{
          color: palette.paper,
          letterSpacing: 0,
          textShadowColor: 'rgba(242,238,231,0.22)',
          textShadowOffset: { width: 0, height: 8 },
          textShadowRadius: 18,
        }}
      >
        PLAYOFF
      </Text>
      <View className="mt-2 flex-row items-end justify-between">
        <Text
          className={`${compact ? 'text-[22px]' : 'text-[34px]'} font-black uppercase leading-none`}
          style={{ color: palette.paper, letterSpacing: 0 }}
        >
          MOBILE
        </Text>
        <View
          style={{
            width: compact ? 64 : 96,
            height: 4,
            backgroundColor: palette.orange,
          }}
        />
      </View>
    </View>
  );
}
