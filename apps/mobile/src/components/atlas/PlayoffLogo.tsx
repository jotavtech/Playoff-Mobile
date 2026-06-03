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
      <View className="mb-2 flex-row items-center justify-between">
        <Text
          className="font-mono text-[10px] font-bold uppercase"
          style={{ color: palette.acid, letterSpacing: 2 }}
        >
          {kicker}
        </Text>
        <Text className="font-mono text-[10px] font-bold" style={{ color: palette.grayWeak }}>
          00:PLF
        </Text>
      </View>
      <Text
        className={`${compact ? 'text-[34px]' : 'text-[52px]'} font-black uppercase leading-none`}
        style={{ color: palette.paper, letterSpacing: 1 }}
      >
        PLAYOFF
      </Text>
      <View className="mt-1 flex-row items-end justify-between">
        <Text
          className={`${compact ? 'text-[18px]' : 'text-[26px]'} font-black uppercase leading-none`}
          style={{ color: palette.orange, letterSpacing: 5 }}
        >
          MOBILE
        </Text>
        <View
          style={{
            width: compact ? 78 : 104,
            height: 8,
            backgroundColor: palette.blueGlow,
            borderWidth: 1,
            borderColor: palette.paper,
          }}
        />
      </View>
    </View>
  );
}
