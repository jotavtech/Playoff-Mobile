import { View } from 'react-native';
import { Text } from '@playoff/ui';

type AtlasBadgeProps = {
  label?: string;
  tone?: 'atlas' | 'playoff';
};

/** The small brand chip — blue "ATLAS" by default. */
export function AtlasBadge({ label = 'ATLAS', tone = 'atlas' }: AtlasBadgeProps) {
  return (
    <View
      className={`self-start rounded-full px-3 py-1 ${tone === 'playoff' ? 'bg-playoff/20' : 'bg-atlas/20'}`}
    >
      <Text
        className={`text-[11px] font-bold uppercase tracking-[3px] ${tone === 'playoff' ? 'text-playoff-glow' : 'text-atlas-glow'}`}
      >
        {label}
      </Text>
    </View>
  );
}
