import { type ReactNode } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/theme/tokens';
import { AtlasBackground } from './AtlasBackground';

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  tone?: 'atlas' | 'playoff';
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Extra bottom padding so content clears the tab bar. */
  contentBottomPadding?: number;
};

/** Standard screen shell: Atlas backdrop + safe-area aware padded content. */
export function ScreenContainer({
  children,
  scroll = true,
  tone = 'atlas',
  onRefresh,
  refreshing = false,
  contentBottomPadding = 92,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + 12;
  const paddingBottom = contentBottomPadding + insets.bottom;

  if (!scroll) {
    return (
      <AtlasBackground tone={tone}>
        <View style={{ flex: 1, paddingTop, paddingHorizontal: 20, paddingBottom }}>
          {children}
        </View>
      </AtlasBackground>
    );
  }

  return (
    <AtlasBackground tone={tone}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingHorizontal: 20, paddingBottom, gap: 20 }}
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
    </AtlasBackground>
  );
}
