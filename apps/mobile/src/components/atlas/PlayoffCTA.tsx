import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';
import { Text } from '@playoff/ui';
import { Icon, type IconName } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

type CTAProps = PressableProps & {
  label: string;
  icon?: IconName;
  loading?: boolean;
};

export function PrimaryCTA({ label, icon = 'arrow-right', loading, disabled, ...props }: CTAProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        minHeight: 54,
        opacity: isDisabled ? 0.52 : pressed ? 0.86 : 1,
        transform: [{ translateY: pressed ? 1 : 0 }],
      })}
    >
      <View
        className="h-full flex-row items-center justify-between px-4"
        style={{
          borderRadius: 6,
          backgroundColor: palette.paper,
          borderWidth: 1,
          borderColor: palette.black,
        }}
      >
        <View className="flex-row items-center gap-3">
          {loading ? <ActivityIndicator color={palette.black} /> : <Icon name={icon} size={20} color={palette.black} />}
          <Text className="text-sm font-black uppercase" style={{ color: palette.black, letterSpacing: 1.6 }}>
            {label}
          </Text>
        </View>
        <Text className="font-mono text-[10px] font-bold" style={{ color: palette.black }}>
          ENTER
        </Text>
      </View>
    </Pressable>
  );
}

export function SecondaryCTA({ label, icon = 'external', disabled, ...props }: CTAProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        minHeight: 48,
        opacity: disabled ? 0.52 : pressed ? 0.82 : 1,
        transform: [{ translateY: pressed ? 1 : 0 }],
      })}
    >
      <View
        className="h-full flex-row items-center justify-between px-4"
        style={{
          borderRadius: 6,
          backgroundColor: 'rgba(8,8,13,0.72)',
          borderWidth: 1,
          borderColor: 'rgba(232,230,221,0.28)',
        }}
      >
        <View className="flex-row items-center gap-3">
          <Icon name={icon} size={18} color={palette.cyan} />
          <Text className="text-xs font-bold uppercase" style={{ color: palette.paper, letterSpacing: 1.4 }}>
            {label}
          </Text>
        </View>
        <View style={{ width: 34, height: 1, backgroundColor: palette.cyan }} />
      </View>
    </Pressable>
  );
}
