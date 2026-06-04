import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { RoundSong } from '@playoff/types';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { WinnerCard } from '@/components/playoff/WinnerCard';
import { RankingRow } from '@/components/playoff/RankingRow';
import { useRound } from '@/hooks/useRounds';
import { aiService } from '@/services/ai.service';
import { getLeaderSong } from '@/utils/round';
import { palette } from '@/theme/tokens';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const roundId = typeof id === 'string' ? id : '';
  const { data: round, isLoading, isError, refetch } = useRound(roundId);

  const insight = useMutation({
    mutationFn: () => aiService.resultInsight(roundId),
  });

  const finished = round?.status === 'finished';
  const winner: RoundSong | null = round
    ? (round.songs.find((s) => s.isWinner) ?? getLeaderSong(round))
    : null;

  const ranking = (round?.songs ?? [])
    .slice()
    .sort((a, b) => b.votes - a.votes)
    .map((song, i) => ({
      position: i + 1,
      song,
      votes: song.votes,
      percentage: song.percentage,
      isWinner: song.isWinner,
    }));

  return (
    <ScreenContainer tone="atlas">
      <View className="flex-row items-center justify-between">
        <View className="gap-2">
          <AtlasBadge />
          <Text variant="display">Resultado</Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          className="border-border bg-card h-10 w-10 items-center justify-center rounded-full border active:opacity-80"
        >
          <Text className="text-muted text-lg">✕</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingState message="Carregando resultado…" />
      ) : isError || !round || !winner ? (
        <ErrorState
          message="Não foi possível carregar o resultado."
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          <Text variant="caption">{round.title}</Text>

          <WinnerCard song={winner} finished={finished} />

          <GlassCard highlight="atlas" className="gap-3">
            <View className="flex-row items-center gap-2">
              <Icon name="sparkles" size={18} color={palette.blueGlow} />
              <Text className="text-atlas-glow text-[11px] font-bold uppercase tracking-[3px]">
                Análise da Atlas AI
              </Text>
            </View>
            {insight.data ? (
              <Text variant="body" className="text-muted leading-6">
                {insight.data.insight}
              </Text>
            ) : insight.isPending ? (
              <LoadingState message="A IA está analisando a rodada…" />
            ) : insight.isError ? (
              <Text variant="caption" className="text-danger">
                Não foi possível gerar a análise agora.
              </Text>
            ) : (
              <Pressable
                onPress={() => insight.mutate()}
                className="border-atlas/40 bg-atlas/10 h-12 flex-row items-center justify-center gap-2 rounded-2xl border active:opacity-90"
              >
                <Icon name="sparkles" size={16} color={palette.blueGlow} />
                <Text className="text-atlas-glow text-sm font-bold uppercase tracking-widest">
                  Pedir análise da IA
                </Text>
              </Pressable>
            )}
          </GlassCard>

          <View className="gap-2">
            <Text variant="label">Classificação final</Text>
            {ranking.map((item) => (
              <RankingRow key={item.song.id} item={item} />
            ))}
          </View>

          <Pressable
            onPress={() => router.push(`/cinematic/${round.id}`)}
            className="border-border bg-card-elevated h-14 flex-row items-center justify-center gap-2 rounded-2xl border active:opacity-90"
          >
            <Icon name="sparkles" size={18} color={palette.orange} />
            <Text className="text-foreground text-sm font-bold uppercase tracking-widest">
              Abrir em modo cinema
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/create-round')}
            className="bg-playoff h-14 flex-row items-center justify-center gap-2 rounded-2xl active:opacity-90"
          >
            <Icon name="plus" size={18} color={palette.white} />
            <Text className="text-sm font-bold uppercase tracking-widest text-white">
              Nova rodada
            </Text>
          </Pressable>
        </>
      )}
    </ScreenContainer>
  );
}
