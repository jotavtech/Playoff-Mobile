import { BlurView } from 'expo-blur';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@playoff/ui';
import { Icon, type IconName } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Home', icon: 'home' },
  vote: { label: 'Votar', icon: 'vote' },
  ranking: { label: 'Ranking', icon: 'trophy' },
  history: { label: 'Histórico', icon: 'history' },
  profile: { label: 'Perfil', icon: 'user' },
};

/** Minimal subset of the react-navigation tab bar props we consume. */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

/**
 * Translucent Atlas bottom bar. Adds the safe-area inset so labels are never
 * clipped on devices with a home indicator (iPhone 11 included).
 */
export function BottomNavigation({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View
      className="border-border bg-background/95 absolute bottom-0 left-0 right-0 border-t"
      style={{ paddingBottom: bottomPad, paddingTop: 10 }}
    >
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={40}
          tint="dark"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : null}
      <View className="flex-row items-start justify-around px-2">
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const color = focused ? palette.orange : palette.grayWeak;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              className="flex-1 items-center gap-1 py-1"
            >
              <Icon name={meta.icon} size={23} color={color} filled={focused} />
              <Text
                numberOfLines={1}
                style={{ color, fontSize: 11 }}
                className={focused ? 'font-bold' : 'font-medium'}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
