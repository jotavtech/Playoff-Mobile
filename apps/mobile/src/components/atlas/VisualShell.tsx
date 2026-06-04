import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/settings.store';
import { accentPalettes, palette, withAlpha } from '@/theme/tokens';
import { AccentOrb } from './AccentOrb';
import { GridOverlay } from './GridOverlay';

type VisualShellProps = {
  children: ReactNode;
  tone?: keyof typeof accentPalettes;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentBottomPadding?: number;
  maxContentWidth?: number;
};

export function VisualShell({
  children,
  tone = 'atlas',
  scroll = true,
  refreshing = false,
  onRefresh,
  contentBottomPadding = 92,
  maxContentWidth = 460,
}: VisualShellProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const lowEndMode = useSettingsStore((s) => s.lowEndMode);
  const theme = accentPalettes[tone];
  // Defensive fallback: never crash if the theme module is momentarily undefined.
  const black = palette?.black ?? '#070707';
  const horizontalPadding = width >= 520 ? 24 : 20;
  const contentStyle = {
    width: '100%' as const,
    maxWidth: maxContentWidth,
    alignSelf: 'center' as const,
    paddingTop: insets.top + 14,
    paddingHorizontal: horizontalPadding,
    paddingBottom: contentBottomPadding + insets.bottom,
  };

  const background = (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}
    >
      <LinearGradient
        colors={[black, black, theme?.surface ?? black, black]}
        locations={[0, 0.3, 0.68, 1]}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <AccentOrb
        color={withAlpha(palette.orange, 0.24)}
        secondaryColor={withAlpha(palette.orange, 0.04)}
        size={520}
        top={118}
        right={-180}
        opacity={lowEndMode ? 0.08 : 0.2}
      />
      <AccentOrb
        color={withAlpha(palette.paper, 0.04)}
        secondaryColor={withAlpha(palette.orange, 0.08)}
        size={420}
        bottom={68}
        left={-220}
        rotate="10deg"
        opacity={lowEndMode ? 0.04 : 0.1}
      />
      <View
        style={{
          position: 'absolute',
          left: -80,
          right: -80,
          top: 190,
          height: 76,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: withAlpha(palette.paper, 0.055),
          backgroundColor: withAlpha(palette.paper, 0.012),
          transform: [{ rotate: '-4deg' }],
        }}
      />
      <GridOverlay opacity={lowEndMode ? 0.045 : 0.075} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: lowEndMode ? 0.015 : 0.026,
          backgroundColor: palette.grayWeak,
        }}
      />
    </View>
  );

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: black }}>
        {background}
        <View style={[contentStyle, { flex: 1 }]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.black }}>
      {background}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...contentStyle, gap: 18 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={palette.gray}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}
