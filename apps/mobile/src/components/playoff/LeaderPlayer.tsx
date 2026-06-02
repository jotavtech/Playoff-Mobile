import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { RoundSong } from '@playoff/types';
import { AudioBars } from './AudioBars';
import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

type LeaderPlayerProps = {
  song: RoundSong;
  isPlaying: boolean;
  onTogglePreview: () => void;
};

/** Immersive player card for the song currently leading the round. */
export function LeaderPlayer({ song, isPlaying, onTogglePreview }: LeaderPlayerProps) {
  return (
    <View className="border-border bg-card-elevated overflow-hidden rounded-3xl border">
      <View className="flex-row items-center gap-4 p-4">
        <View>
          <Image
            source={{ uri: song.coverUrl }}
            style={{ width: 84, height: 84, borderRadius: 18 }}
            contentFit="cover"
            transition={250}
          />
        </View>
        <View className="flex-1">
          <Text className="text-playoff text-[11px] font-bold uppercase tracking-[3px]">
            Liderando agora
          </Text>
          <Text className="text-foreground mt-1 text-lg font-bold" numberOfLines={1}>
            {song.title}
          </Text>
          <Text variant="caption" numberOfLines={1}>
            {song.artist}
          </Text>
          <View className="mt-2 flex-row items-center gap-3">
            <AudioBars active={isPlaying} />
            <Text className="text-foreground text-sm font-semibold">{song.percentage}%</Text>
          </View>
        </View>
        <Pressable
          onPress={onTogglePreview}
          className="bg-playoff h-12 w-12 items-center justify-center rounded-full active:opacity-90"
          accessibilityRole="button"
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={22} color={palette.white} />
        </Pressable>
      </View>
    </View>
  );
}
