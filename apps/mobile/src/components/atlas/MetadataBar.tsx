import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { palette } from '@/theme/tokens';

export type MetadataItem = {
  label: string;
  value: string;
  tone?: 'default' | 'live' | 'alert';
};

type MetadataBarProps = {
  items: MetadataItem[];
};

export function MetadataBar({ items }: MetadataBarProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => {
        const color =
          item.tone === 'live' ? palette.acid : item.tone === 'alert' ? palette.orange : palette.gray;
        return (
          <View
            key={`${item.label}-${item.value}`}
            className="flex-row items-center gap-2 px-2 py-1"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(232,230,221,0.2)',
              backgroundColor: 'rgba(8,8,13,0.76)',
              borderRadius: 4,
            }}
          >
            <Text className="font-mono text-[9px] font-bold uppercase" style={{ color: palette.grayWeak }}>
              {item.label}
            </Text>
            <Text className="font-mono text-[10px] font-bold uppercase" style={{ color }}>
              {item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
