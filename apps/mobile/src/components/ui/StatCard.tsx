import { View } from 'react-native';
import { Text } from '@playoff/ui';

type StatCardProps = {
  value: number | string;
  label: string;
  tone?: 'atlas' | 'playoff' | 'neutral';
};

export function StatCard({ value, label, tone = 'neutral' }: StatCardProps) {
  const valueColor =
    tone === 'atlas' ? 'text-atlas-glow' : tone === 'playoff' ? 'text-playoff' : 'text-foreground';
  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      className="border-border bg-card flex-1 items-center rounded-2xl border px-3 py-4"
    >
      <Text className={`text-2xl font-extrabold ${valueColor}`}>{value}</Text>
      <Text className="text-muted mt-1 text-center text-[11px] font-medium uppercase tracking-wider">
        {label}
      </Text>
    </View>
  );
}
