import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { Song } from '@playoff/types';
import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

type MusicCardProps = {
  song: Song;
  selected?: boolean;
  isPlaying?: boolean;
  onPress?: () => void;
  onTogglePreview?: () => void;
  trailing?: 'add' | 'check' | 'none';
};

/** Generic track row used in search and AI suggestions. */
export function MusicCard({
  song,
  selected = false,
  isPlaying = false,
  onPress,
  onTogglePreview,
  trailing = 'add',
}: MusicCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${song.title} — ${song.artist}`}
      className={`flex-row items-center gap-3 rounded-2xl border p-3 active:opacity-90 ${selected ? 'border-playoff bg-playoff/10' : 'border-border bg-card'}`}
    >
      <Pressable
        onPress={onTogglePreview}
        accessibilityRole="button"
        accessibilityLabel={`${isPlaying ? 'Pausar' : 'Reproduzir'} prévia de ${song.title}`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="active:opacity-80"
      >
        <Image
          source={{ uri: song.coverUrl }}
          style={{ width: 48, height: 48, borderRadius: 10 }}
          contentFit="cover"
          transition={200}
        />
        {song.previewUrl ? (
          <View className="absolute inset-0 items-center justify-center rounded-[10px] bg-black/35">
            <Icon name={isPlaying ? 'pause' : 'play'} size={16} color={palette.white} />
          </View>
        ) : null}
      </Pressable>

      <View className="flex-1">
        <Text className="text-foreground font-medium" numberOfLines={1}>
          {song.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {song.artist}
        </Text>
      </View>

      {trailing !== 'none' ? (
        <View
          className={`h-9 w-9 items-center justify-center rounded-full ${selected ? 'bg-playoff' : 'bg-card-elevated border-border border'}`}
        >
          <Icon
            name={selected || trailing === 'check' ? 'check' : 'plus'}
            size={18}
            color={selected ? palette.white : palette.gray}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
