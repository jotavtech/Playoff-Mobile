import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { palette } from '@/theme/tokens';

type AtlasBadgeProps = {
  label?: string;
  tone?: 'atlas' | 'playoff';
  status?: string;
};

/** Technical Atlas badge used across Playoff surfaces. */
export function AtlasBadge({
  label = 'ATLAS',
  tone = 'atlas',
  status = 'ONLINE',
}: AtlasBadgeProps) {
  const accent = tone === 'playoff' ? palette.orange : palette.gray;

  return (
    <View
      className="flex-row items-center gap-2 self-start px-2 py-1"
      style={{
        borderWidth: 1,
        borderColor: 'rgba(242,238,231,0.1)',
        backgroundColor: 'rgba(7,7,7,0.62)',
        borderRadius: 2,
      }}
    >
      <View style={{ width: 6, height: 6, backgroundColor: accent, borderRadius: 3 }} />
      <Text
        className="font-mono text-[10px] uppercase"
        style={{ color: accent, letterSpacing: 3.2 }}
      >
        {label}
      </Text>
      <Text
        className="font-mono text-[9px] uppercase"
        style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
      >
        {status}
      </Text>
    </View>
  );
}
