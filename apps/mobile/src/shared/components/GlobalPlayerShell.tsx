import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { usePlayerUiStore } from '@/store/player-ui.store';

/** Placeholder — Phase 4 implements full player */
export function GlobalPlayerShell() {
  const isExpanded = usePlayerUiStore((s) => s.isExpanded);

  return (
    <View
      className={`absolute bottom-0 left-0 right-0 border-t border-border bg-card/90 px-4 py-3 ${isExpanded ? 'h-full' : ''}`}
      accessibilityRole="toolbar"
    >
      <Text variant="caption">Player global — implementar na Phase 4</Text>
    </View>
  );
}
