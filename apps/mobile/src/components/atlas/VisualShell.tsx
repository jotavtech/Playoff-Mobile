import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/settings.store';
import { accentPalettes, palette } from '@/theme/tokens';
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
  const horizontalPadding = width >= 520 ? 24 : 18;
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
        colors={[palette.black, theme.surface, palette.black2, palette.black]}
        locations={[0, 0.34, 0.72, 1]}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <AccentOrb
        color={theme.accent}
        secondaryColor={theme.accentAlt}
        size={360}
        top={-72}
        right={-150}
        opacity={lowEndMode ? 0.12 : 0.28}
      />
      <AccentOrb
        color={theme.accentAlt}
        secondaryColor={palette.paper}
        size={280}
        bottom={112}
        left={-156}
        rotate="18deg"
        opacity={lowEndMode ? 0.1 : 0.2}
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
          borderColor: 'rgba(232,230,221,0.18)',
          backgroundColor: 'rgba(255,255,255,0.025)',
          transform: [{ rotate: '-8deg' }],
        }}
      />
      <GridOverlay opacity={lowEndMode ? 0.08 : 0.14} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: lowEndMode ? 0.03 : 0.07,
          backgroundColor: palette.paper,
        }}
      />
    </View>
  );

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.black }}>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.gray} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}
