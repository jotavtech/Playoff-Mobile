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
          item.tone === 'live'
            ? palette.paper
            : item.tone === 'alert'
              ? palette.orange
              : palette.gray;
        return (
          <View
            key={`${item.label}-${item.value}`}
            className="flex-row items-center gap-2 px-2 py-1"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(242,238,231,0.09)',
              backgroundColor: 'rgba(7,7,7,0.58)',
              borderRadius: 2,
            }}
          >
            <View
              style={{
                width: 4,
                height: 4,
                backgroundColor: item.tone === 'alert' ? palette.orange : palette.grayWeak,
              }}
            />
            <Text
              className="font-mono text-[9px] uppercase"
              style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
            >
              {item.label}
            </Text>
            <Text className="font-mono text-[10px] uppercase" style={{ color, letterSpacing: 2.2 }}>
              {item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
