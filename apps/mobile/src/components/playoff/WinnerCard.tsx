import { Image } from 'expo-image';
import { Linking, Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { RoundSong } from '@playoff/types';
import { Icon } from '@/components/ui/Icon';
import { formatVotes } from '@/utils/round';
import { palette } from '@/theme/tokens';

type WinnerCardProps = {
  song: RoundSong;
  /** When false, the round is still running — shown as "liderando". */
  finished: boolean;
};

export function WinnerCard({ song, finished }: WinnerCardProps) {
  return (
    <View className="border-atlas/40 bg-card-elevated items-center overflow-hidden rounded-3xl border p-6">
      <View className="mb-3 flex-row items-center gap-2">
        <Icon name="trophy" size={18} color={palette.blueGlow} />
        <Text className="text-atlas-glow text-[11px] font-bold uppercase tracking-[4px]">
          {finished ? 'Vencedora' : 'Liderando'}
        </Text>
      </View>

      <Image
        source={{ uri: song.coverUrl }}
        style={{ width: 200, height: 200, borderRadius: 24 }}
        contentFit="cover"
        transition={300}
      />

      <Text variant="display" className="mt-5 text-center" numberOfLines={2}>
        {song.title}
      </Text>
      <Text variant="caption" className="mt-1 text-center">
        {song.artist}
      </Text>

      <View className="mt-5 flex-row items-center gap-8">
        <View className="items-center">
          <Text className="text-foreground text-2xl font-extrabold">{formatVotes(song.votes)}</Text>
          <Text className="text-muted text-[11px] uppercase tracking-wider">Votos</Text>
        </View>
        <View className="items-center">
          <Text className="text-playoff text-2xl font-extrabold">{song.percentage}%</Text>
          <Text className="text-muted text-[11px] uppercase tracking-wider">Da rodada</Text>
        </View>
      </View>

      <Pressable
        onPress={() => void Linking.openURL(song.externalUrl)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${song.title} no Spotify`}
        className="mt-6 h-12 flex-row items-center justify-center gap-2 self-stretch rounded-2xl bg-[#1DB954] active:opacity-90"
      >
        <Icon name="spotify" size={18} color={palette.white} />
        <Text className="text-sm font-bold uppercase tracking-widest text-white">
          Abrir no Spotify
        </Text>
      </Pressable>
    </View>
  );
}
