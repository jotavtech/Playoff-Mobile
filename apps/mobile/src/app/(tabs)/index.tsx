import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasHeader } from '@/components/atlas/AtlasHeader';
import { EditorialPanel } from '@/components/atlas/EditorialPanel';
import { MetadataBar } from '@/components/atlas/MetadataBar';
import { PlayoffLogo } from '@/components/atlas/PlayoffLogo';
import { VisualShell } from '@/components/atlas/VisualShell';
import { AiCuratorButton } from '@/components/ai/AiCuratorButton';
import { ActiveRoundCard } from '@/components/playoff/ActiveRoundCard';
import { LeaderPlayer } from '@/components/playoff/LeaderPlayer';
import { RankingRow } from '@/components/playoff/RankingRow';
import { Avatar } from '@/components/ui/Avatar';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { useActiveRound } from '@/hooks/useRounds';
import { useAuth } from '@/hooks/useAuth';
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer';
import { palette } from '@/theme/tokens';
import { getLeaderSong } from '@/utils/round';
import type { RankingItem } from '@playoff/types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
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

  const homeMetadata = [
    { label: 'USER', value: greetingName.toUpperCase().slice(0, 12) },
    { label: 'ROUND', value: round ? 'LIVE' : 'STANDBY', tone: round ? ('live' as const) : undefined },
    { label: 'TRACKS', value: String(round?.songs.length ?? 0) },
  ];

  return (
    <VisualShell onRefresh={() => void refetch()} refreshing={isRefetching} tone="playoff">
      <AtlasHeader
        subtitle="PLAYOFF MOBILE"
        right={
          <View className="flex-row items-center gap-3">
            <AiCuratorButton variant="icon" onPress={() => router.push('/ai-curator')} />
            <Avatar uri={user?.avatarUrl} name={user?.name} size={40} ring />
          </View>
        }
      />

      <View className="gap-3">
        <PlayoffLogo compact kicker="[ H ] HOME / LIVE INDEX" />
        <MetadataBar items={homeMetadata} />
      </View>

      <EditorialPanel
        index="01"
        eyebrow={round ? 'active room signal' : 'atlas standby'}
        title={round ? 'A rodada entrou em disputa.' : 'Sem rodada ativa, mas o palco esta armado.'}
      >
        <Text className="text-sm leading-5" style={{ color: palette.gray }}>
          {round
            ? 'Painel de controle da rodada: lider, ranking, voto e curadoria Atlas no mesmo grid tecnico.'
            : 'Crie uma batalha musical com o Atlas AI Curator ou aguarde a proxima sala abrir.'}
        </Text>
        <View className="flex-row gap-2">
          <View className="flex-1 border px-2 py-2" style={{ borderColor: 'rgba(255,59,31,0.38)', borderRadius: 2 }}>
            <Text className="font-mono text-[10px] uppercase" style={{ color: palette.orange, letterSpacing: 2.4 }}>
              LEADER
            </Text>
            <Text numberOfLines={1} className="mt-1 text-[11px] font-bold uppercase" style={{ color: palette.paper }}>
              {leader?.title ?? 'pending'}
            </Text>
          </View>
          <View className="flex-1 border px-2 py-2" style={{ borderColor: 'rgba(242,238,231,0.12)', borderRadius: 2 }}>
            <Text className="font-mono text-[10px] uppercase" style={{ color: palette.grayWeak, letterSpacing: 2.4 }}>
              VOTES
            </Text>
            <Text className="mt-1 text-[11px] font-bold uppercase" style={{ color: palette.paper }}>
              {leader?.votes ?? 0} total pulse
            </Text>
          </View>
        </View>
      </EditorialPanel>

      {isLoading ? (
        <LoadingState message="Carregando rodada..." />
      ) : isError ? (
        <ErrorState
          message="Nao foi possivel carregar a rodada ativa."
          onRetry={() => void refetch()}
        />
      ) : !round ? (
        <EditorialPanel index="00" eyebrow="empty_stage">
          <View className="gap-3">
            <Text className="text-2xl font-black uppercase leading-7" style={{ color: palette.paper }}>
              Nenhuma rodada ativa
            </Text>
            <Text className="text-sm leading-5" style={{ color: palette.gray }}>
              O palco esta em espera. Acione o Atlas Curator para montar uma disputa com cara de
              sistema social, nao de playlist.
            </Text>
            <AiCuratorButton onPress={() => router.push('/ai-curator')} />
          </View>
        </EditorialPanel>
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
              <View className="flex-row items-end justify-between border-b pb-2" style={{ borderBottomColor: 'rgba(242,238,231,0.08)' }}>
                <View>
                  <Text className="font-mono text-[10px] uppercase" style={{ color: palette.orange, letterSpacing: 2.6 }}>
                    02 / ranking
                  </Text>
                  <Text className="text-base font-black uppercase" style={{ color: palette.paper }}>
                    Placar da rodada
                  </Text>
                </View>
                <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: palette.grayWeak }}>
                  top 03
                </Text>
              </View>
              {top3.map((item) => (
                <RankingRow key={item.song.id} item={item} />
              ))}
            </View>
          ) : null}

          <AiCuratorButton onPress={() => router.push('/ai-curator')} />
        </>
      )}
    </VisualShell>
  );
}
