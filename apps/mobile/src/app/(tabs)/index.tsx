import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasHeader } from '@/components/atlas/AtlasHeader';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { AiCuratorButton } from '@/components/ai/AiCuratorButton';
import { Icon } from '@/components/ui/Icon';
import { ActiveRoundCard } from '@/components/playoff/ActiveRoundCard';
import { LeaderPlayer } from '@/components/playoff/LeaderPlayer';
import { RankingRow } from '@/components/playoff/RankingRow';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useActiveRound } from '@/hooks/useRounds';
import { useAuth } from '@/hooks/useAuth';
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer';
import { getLeaderSong } from '@/utils/round';
import { palette } from '@/theme/tokens';
import type { RankingItem } from '@playoff/types';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data: round, isLoading, isError, refetch, isRefetching } = useActiveRound();
  const { playingId, toggle } = usePreviewPlayer();

  const greetingName = user?.name?.split(' ')[0] ?? 'Atlas';
  const leader = getLeaderSong(round);

  const top3: RankingItem[] = (round?.songs ?? [])
    .slice()
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)
    .map((song, i) => ({
      position: i + 1,
      song,
      votes: song.votes,
      percentage: song.percentage,
      isWinner: song.isWinner,
    }));

  return (
    <ScreenContainer onRefresh={() => void refetch()} refreshing={isRefetching}>
      <AtlasHeader
        right={
          <View className="flex-row items-center gap-3">
            <AiCuratorButton variant="icon" onPress={() => router.push('/ai-curator')} />
            <Avatar uri={user?.avatarUrl} name={user?.name} size={40} ring />
          </View>
        }
      />

      <View>
        <Text variant="caption">Olá, {greetingName}</Text>
        <Text variant="display" className="mt-1">
          {round ? 'A rodada começou' : 'Bem-vindo ao Atlas'}
        </Text>
        <Text variant="caption" className="mt-1">
          {round
            ? 'Mais uma batalha musical no ecossistema Atlas.'
            : 'Sua experiência musical inteligente começa aqui.'}
        </Text>
      </View>

      {isLoading ? (
        <LoadingState message="Carregando rodada…" />
      ) : isError ? (
        <ErrorState
          message="Não foi possível carregar a rodada ativa."
          onRetry={() => void refetch()}
        />
      ) : !round ? (
        <EmptyState
          icon="sparkles"
          title="Nenhuma rodada ativa"
          message="Crie uma nova batalha musical com o Atlas AI Curator ou aguarde a próxima rodada."
          actionLabel="Criar com IA"
          onAction={() => router.push('/ai-curator')}
        />
      ) : (
        <>
          {leader ? (
            <LeaderPlayer
              song={leader}
              isPlaying={playingId === leader.id}
              onTogglePreview={() => void toggle(leader.id, leader.previewUrl)}
            />
          ) : null}

          <ActiveRoundCard round={round} onPress={() => router.push('/vote')} />

          {top3.length > 0 ? (
            <View className="gap-3">
              <Text variant="label">Ranking da rodada</Text>
              {top3.map((item) => (
                <RankingRow key={item.song.id} item={item} />
              ))}
            </View>
          ) : null}

          {round.status === 'finished' ? (
            <Pressable
              onPress={() => router.push(`/result/${round.id}`)}
              className="border-atlas/40 bg-atlas/10 h-12 flex-row items-center justify-center gap-2 rounded-2xl border active:opacity-90"
            >
              <Icon name="trophy" size={16} color={palette.blueGlow} />
              <Text className="text-atlas-glow text-sm font-bold uppercase tracking-widest">
                Ver resultado
              </Text>
            </Pressable>
          ) : null}

          <AiCuratorButton onPress={() => router.push('/ai-curator')} />
        </>
      )}

      {isAuthenticated ? (
        <Pressable
          onPress={() => router.push('/create-round')}
          className="border-border bg-card h-12 flex-row items-center justify-center gap-2 rounded-2xl border active:opacity-80"
        >
          <Icon name="plus" size={16} color={palette.gray} />
          <Text className="text-foreground text-sm font-bold uppercase tracking-widest">
            Criar rodada manual
          </Text>
        </Pressable>
      ) : null}
    </ScreenContainer>
  );
}
