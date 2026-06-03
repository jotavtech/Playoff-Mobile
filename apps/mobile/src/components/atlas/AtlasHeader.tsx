import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasBadge } from './AtlasBadge';

type AtlasHeaderProps = {
  /** Optional element rendered on the right (e.g. avatar, AI button). */
  right?: React.ReactNode;
  subtitle?: string;
};

/** Brand header: "ATLAS" chip over the "PLAYOFF MOBILE" wordmark. */
export function AtlasHeader({ right, subtitle = 'PLAYOFF MOBILE' }: AtlasHeaderProps) {
  return (
    <View className="flex-row items-start justify-between">
      <View className="gap-2">
        <AtlasBadge />
        <Text className="text-foreground text-base font-extrabold uppercase tracking-[4px]">
          {subtitle}
        </Text>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}
