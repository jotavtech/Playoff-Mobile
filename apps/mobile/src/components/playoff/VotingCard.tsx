import { Image } from 'expo-image';
import { Linking, Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { RoundSong } from '@playoff/types';
import { Icon } from '@/components/ui/Icon';
import { VoteProgressBar } from '@/components/ui/VoteProgressBar';
import { formatVotes } from '@/utils/round';
import { palette } from '@/theme/tokens';

type VotingCardProps = {
  song: RoundSong;
  selected: boolean;
  /** Reveal vote tallies (after voting or when round finished). */
  showResults: boolean;
  isPlaying: boolean;
  disabled?: boolean;
  onVote: () => void;
  onTogglePreview: () => void;
};

export function VotingCard({
  song,
  selected,
  showResults,
  isPlaying,
  disabled,
  onVote,
  onTogglePreview,
}: VotingCardProps) {
  const highlight = selected
    ? 'border-playoff bg-playoff/10'
    : song.isWinner
      ? 'border-atlas/50 bg-atlas/5'
      : 'border-border bg-card';

  return (
    <View className={`rounded-2xl border p-3 ${highlight}`}>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onTogglePreview}
          accessibilityRole="button"
          accessibilityLabel={`${isPlaying ? 'Pausar' : 'Reproduzir'} prévia de ${song.title}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="active:opacity-80"
        >
          <Image
            source={{ uri: song.coverUrl }}
            style={{ width: 56, height: 56, borderRadius: 12 }}
            contentFit="cover"
            transition={200}
          />
          {song.previewUrl ? (
            <View className="absolute inset-0 items-center justify-center rounded-xl bg-black/35">
              <Icon name={isPlaying ? 'pause' : 'play'} size={20} color={palette.white} />
            </View>
          ) : null}
        </Pressable>

        <View className="flex-1">
          <Text className="text-foreground font-semibold" numberOfLines={1}>
            {song.title}
          </Text>
          <Text variant="caption" numberOfLines={1}>
            {song.artist}
          </Text>
          {song.isWinner ? (
            <View className="mt-1 flex-row items-center gap-1">
              <Icon name="trophy" size={13} color={palette.blueGlow} />
              <Text className="text-atlas-glow text-[11px] font-bold uppercase tracking-wider">
                Vencedora
              </Text>
            </View>
          ) : null}
        </View>

        {showResults ? (
          <View className="items-end">
            <Text className="text-foreground text-lg font-extrabold">{song.percentage}%</Text>
            <Text variant="caption">{formatVotes(song.votes)} votos</Text>
          </View>
        ) : (
          <Pressable
            onPress={onVote}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`Votar em ${song.title}`}
            accessibilityState={{ disabled: Boolean(disabled) }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className={`rounded-xl px-4 py-3 ${disabled ? 'bg-card-elevated opacity-60' : 'bg-playoff active:opacity-90'}`}
          >
            <Text className="text-xs font-bold uppercase tracking-widest text-white">Votar</Text>
          </Pressable>
        )}
      </View>

      {showResults ? (
        <View className="mt-3 gap-2">
          <VoteProgressBar percentage={song.percentage} tone={selected ? 'playoff' : 'atlas'} />
          {!song.previewUrl ? (
            <Pressable
              onPress={() => void Linking.openURL(song.externalUrl)}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${song.title} no Spotify`}
              className="flex-row items-center gap-1 self-start active:opacity-70"
            >
              <Icon name="spotify" size={14} color={palette.success} />
              <Text className="text-muted text-[11px]">
                Preview indisponível · abrir no Spotify
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
