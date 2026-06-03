import { View } from 'react-native';
import { Text } from '@playoff/ui';
import type { AiCuratorResult } from '@playoff/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { MusicCard } from '@/components/playoff/MusicCard';
import { palette } from '@/theme/tokens';

type AiSuggestionCardProps = {
  result: AiCuratorResult;
  playingId: string | null;
  onTogglePreview: (id: string, previewUrl?: string | null) => void;
};

export function AiSuggestionCard({ result, playingId, onTogglePreview }: AiSuggestionCardProps) {
  return (
    <GlassCard highlight="atlas" className="gap-3">
      <View className="flex-row items-center gap-2">
        <Icon name="sparkles" size={18} color={palette.blueGlow} />
        <Text className="text-atlas-glow text-[11px] font-bold uppercase tracking-[3px]">
          Atlas AI Curator
        </Text>
      </View>

      {result.roundName ? <Text variant="title">{result.roundName}</Text> : null}

      <Text variant="body" className="text-muted leading-6">
        {result.message}
      </Text>

      {result.criteria ? (
        <View className="border-border bg-card/60 rounded-xl border p-3">
          <Text className="text-muted-weak text-[11px] font-bold uppercase tracking-wider">
            Critério
          </Text>
          <Text variant="caption" className="mt-1 leading-5">
            {result.criteria}
          </Text>
        </View>
      ) : null}

      {result.songs && result.songs.length > 0 ? (
        <View className="mt-1 gap-2">
          {result.songs.map((song) => (
            <MusicCard
              key={song.id}
              song={song}
              trailing="none"
              isPlaying={playingId === song.id}
              onTogglePreview={() => onTogglePreview(song.id, song.previewUrl)}
            />
          ))}
        </View>
      ) : null}
    </GlassCard>
  );
}
