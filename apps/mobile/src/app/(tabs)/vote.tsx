import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasHeader } from '@/components/atlas/AtlasHeader';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { VotingCard } from '@/components/playoff/VotingCard';
import { useActiveRound, useVote } from '@/hooks/useRounds';
import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useProfile';
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer';
import { formatVotes } from '@/utils/round';

export default function VoteScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: round, isLoading, isError, refetch, isRefetching } = useActiveRound();
  const { data: history } = useHistory();
  const vote = useVote(round?.id ?? '');
  const { playingId, toggle } = usePreviewPlayer();

  const myVoteSongId = useMemo(() => {
    if (!round) return null;
    return history?.find((h) => h.round.id === round.id)?.song.id ?? null;
  }, [history, round]);

  const finished = round?.status === 'finished';
  const showResults = Boolean(myVoteSongId) || finished;

  const onVote = (songId: string) => {
    if (!round) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    vote.mutate(songId, {
      onError: (err) => Alert.alert('Não foi possível registrar seu voto', err.message),
    });
  };

  return (
    <ScreenContainer onRefresh={() => void refetch()} refreshing={isRefetching}>
      <AtlasHeader />

      <View>
        <Text variant="display">Escolha sua faixa</Text>
        <Text variant="caption" className="mt-1">
          A comunidade Atlas decide quem avança.
        </Text>
      </View>

      {isLoading ? (
        <LoadingState message="Carregando músicas da rodada…" />
      ) : isError ? (
        <ErrorState message="Não foi possível carregar a votação." onRetry={() => void refetch()} />
      ) : !round ? (
        <EmptyState
          icon="vote"
          title="Nenhuma rodada ativa"
          message="Quando uma batalha estiver no ar, as faixas aparecem aqui para você votar."
          actionLabel="Criar com IA"
          onAction={() => router.push('/ai-curator')}
        />
      ) : (
        <>
          <GlassCard
            highlight={finished ? 'atlas' : 'playoff'}
            className="flex-row items-center justify-between"
          >
            <View className="flex-1 pr-3">
              <Text className="text-foreground font-bold" numberOfLines={2}>
                {round.title}
              </Text>
              <Text variant="caption" className="mt-1">
                {finished
                  ? 'Rodada encerrada'
                  : showResults
                    ? 'Você já votou — acompanhe o resultado'
                    : 'Toque na capa para ouvir o preview'}
              </Text>
            </View>
            <Text className="text-foreground text-xl font-extrabold">
              {formatVotes(round.totalVotes)}
            </Text>
          </GlassCard>

          {!isAuthenticated && !finished ? (
            <Text variant="caption" className="text-playoff text-center">
              Entre com Spotify para registrar seu voto.
            </Text>
          ) : null}

          <View className="gap-3">
            {round.songs.map((song) => (
              <VotingCard
                key={song.id}
                song={song}
                selected={myVoteSongId === song.id}
                showResults={showResults}
                isPlaying={playingId === song.id}
                disabled={vote.isPending || finished}
                onVote={() => onVote(song.id)}
                onTogglePreview={() => void toggle(song.id, song.previewUrl)}
              />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}
