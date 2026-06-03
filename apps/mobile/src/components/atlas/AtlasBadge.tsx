import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { palette } from '@/theme/tokens';

type AtlasBadgeProps = {
  label?: string;
  tone?: 'atlas' | 'playoff';
  status?: string;
};

/** Technical Atlas badge used across Playoff surfaces. */
export function AtlasBadge({ label = 'ATLAS', tone = 'atlas', status = 'ONLINE' }: AtlasBadgeProps) {
  const accent = tone === 'playoff' ? palette.orange : palette.cyan;

  return (
    <View
      className="self-start flex-row items-center gap-2 px-2 py-1"
      style={{
        borderWidth: 1,
        borderColor: 'rgba(232,230,221,0.24)',
        backgroundColor: 'rgba(8,8,13,0.78)',
        borderRadius: 4,
      }}
    >
      <View style={{ width: 6, height: 6, backgroundColor: accent, borderRadius: 3 }} />
      <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: accent, letterSpacing: 2 }}>
        {label}
      </Text>
      <Text className="font-mono text-[9px] font-bold uppercase" style={{ color: palette.grayWeak }}>
        {status}
      </Text>
    </View>
  );
}
