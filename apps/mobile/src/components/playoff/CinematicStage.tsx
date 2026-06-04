import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@playoff/ui';
import type { Round, RoundSong } from '@playoff/types';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { AudioBars } from '@/components/playoff/AudioBars';
import { Icon } from '@/components/ui/Icon';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useActiveRound, useRound } from '@/hooks/useRounds';
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer';
import { useSettingsStore } from '@/store/settings.store';
import { palette, withAlpha } from '@/theme/tokens';
import { PlayerAmbientBackground } from '@/visual/effects/ambient/PlayerAmbientBackground';

/** Cinematic colourway for the ambient backdrop (technical-noir, signal red). */
const STAGE_AMBIENT: [string, string, string] = ['#1A0606', '#070707', '#0A0908'];

/** Map a round status to Portuguese prose for the cinematic readout. */
function statusProse(status: Round['status']): string {
  switch (status) {
    case 'active':
      return 'Disputa ao vivo';
    case 'finished':
      return 'Disputa encerrada';
    default:
      return 'Aguardando início';
  }
}

/** The leading song: the declared winner when finished, else the top-voted. */
function pickLeader(round: Round): RoundSong | null {
  if (round.songs.length === 0) return null;
  if (round.status === 'finished') {
    const winner = round.songs.find((song) => song.isWinner);
    if (winner) return winner;
  }
  return round.songs.reduce(
    (best, song) => (song.votes > best.votes ? song : best),
    round.songs[0]!,
  );
}

export function CinematicStage({ roundId }: { roundId?: string }) {
  const activeQuery = useActiveRound();
  const byIdQuery = useRound(roundId ?? '');
  // When a roundId is supplied we target that round, otherwise the active one.
  const query = roundId ? byIdQuery : activeQuery;
  const round = query.data;

  if (query.isLoading) {
    return (
      <StageShell>
        <LoadingState message="Montando o palco…" />
      </StageShell>
    );
  }

  if (query.isError) {
    return (
      <StageShell>
        <ErrorState onRetry={() => void query.refetch()} />
      </StageShell>
    );
  }

  const leader = round ? pickLeader(round) : null;
  if (!round || !leader) {
    return (
      <StageShell>
        <EmptyState
          icon="trophy"
          title="Nenhuma rodada em cena"
          message="Quando uma disputa estiver no ar, ela aparece aqui em modo cinematográfico."
        />
      </StageShell>
    );
  }

  return <StageContent round={round} leader={leader} />;
}

/** Full-bleed black scaffold with the ambient backdrop and a back affordance. */
function StageShell({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: palette.black }}>
      <PlayerAmbientBackground colors={STAGE_AMBIENT} />
      <BackButton />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function BackButton() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => ({
        position: 'absolute',
        top: insets.top + 12,
        left: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: withAlpha(palette.paper, 0.12),
        backgroundColor: withAlpha(palette.black, 0.54),
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {/* arrow-right rotated 180° reads as a back chevron. */}
      <View style={{ transform: [{ rotate: '180deg' }] }}>
        <Icon name="arrow-right" size={16} color={palette.paper} />
      </View>
      <Text
        className="font-mono text-[10px] uppercase"
        style={{ color: palette.paper, letterSpacing: 2.8 }}
      >
        VOLTAR
      </Text>
    </Pressable>
  );
}

function StageContent({ round, leader }: { round: Round; leader: RoundSong }) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const lowEndMode = useSettingsStore((s) => s.lowEndMode);
  const { playingId, toggle } = usePreviewPlayer();
  const isPlaying = playingId === leader.id;

  const animate = !reducedMotion && !lowEndMode;
  const entrance = useSharedValue(animate ? 0 : 1);
  const cover = useSharedValue(isPlaying && animate ? 1 : 0);

  useEffect(() => {
    if (!animate) {
      entrance.value = 1;
      return;
    }
    entrance.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) });
  }, [animate, entrance]);

  useEffect(() => {
    if (!animate) return;
    cover.value = withTiming(isPlaying ? 1 : 0, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [animate, cover, isPlaying]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 18 }],
  }));

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + cover.value * 0.04 }],
  }));

  const statusBadge =
    round.status === 'finished' ? 'FINISHED' : round.status === 'active' ? 'LIVE' : 'STANDBY';

  return (
    <View style={{ flex: 1, backgroundColor: palette.black }}>
      <PlayerAmbientBackground colors={STAGE_AMBIENT} />
      <BackButton />

      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: insets.top + 56,
            paddingBottom: insets.bottom + 28,
            paddingHorizontal: 24,
            gap: 22,
          },
          enterStyle,
        ]}
      >
        <View className="flex-row items-center gap-2">
          <Text
            className="font-mono text-[10px] uppercase"
            style={{ color: palette.orange, letterSpacing: 3.6 }}
          >
            CINEMATIC
          </Text>
          <View
            style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: palette.grayWeak }}
          />
          <Text
            className="font-mono text-[10px] uppercase"
            style={{ color: palette.grayWeak, letterSpacing: 2.8 }}
          >
            NOW PLAYING
          </Text>
        </View>

        <CoverArt song={leader} style={coverStyle} />

        <View style={{ alignItems: 'center', gap: 6, maxWidth: 420 }}>
          <Text variant="display" className="text-center" numberOfLines={2}>
            {leader.title}
          </Text>
          <Text variant="caption" className="text-center" numberOfLines={1}>
            {leader.artist}
          </Text>
        </View>

        <View style={{ alignItems: 'center', gap: 10 }}>
          <Text
            className="font-mono text-[9px] uppercase"
            style={{ color: palette.grayWeak, letterSpacing: 2.8 }}
          >
            ROUND STATUS
          </Text>
          <AtlasBadge label={round.title} tone="playoff" status={statusBadge} />
          <Text variant="caption" className="text-center">
            {statusProse(round.status)}
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <AudioBars active={isPlaying} />
          <Text className="text-foreground text-3xl font-extrabold">{leader.percentage}%</Text>
          <AudioBars active={isPlaying} />
        </View>

        <PlayControl
          isPlaying={isPlaying}
          hasPreview={Boolean(leader.previewUrl)}
          title={leader.title}
          onPress={() => void toggle(leader.id, leader.previewUrl)}
        />
      </Animated.View>
    </View>
  );
}

/** Large album cover with a graceful technical-noir fallback when absent. */
function CoverArt({
  song,
  style,
}: {
  song: RoundSong;
  style: ReturnType<typeof useAnimatedStyle>;
}) {
  const size = 280;
  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: 28,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: withAlpha(palette.paper, 0.12),
          backgroundColor: palette.cardElevated,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {song.coverUrl ? (
        <Image
          source={{ uri: song.coverUrl }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={300}
          accessibilityLabel={`Capa de ${song.title}`}
        />
      ) : (
        <Icon name="trophy" size={64} color={palette.grayWeak} />
      )}
    </Animated.View>
  );
}

function PlayControl({
  isPlaying,
  hasPreview,
  title,
  onPress,
}: {
  isPlaying: boolean;
  hasPreview: boolean;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!hasPreview}
      accessibilityRole="button"
      accessibilityLabel={
        hasPreview
          ? `${isPlaying ? 'Pausar' : 'Reproduzir'} prévia de ${title}`
          : 'Prévia indisponível'
      }
      accessibilityState={{ disabled: !hasPreview }}
      style={({ pressed }) => ({
        height: 68,
        width: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hasPreview ? palette.orange : palette.cardElevated,
        borderWidth: hasPreview ? 0 : 1,
        borderColor: palette.border,
        opacity: hasPreview ? (pressed ? 0.9 : 1) : 0.6,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      <Icon name={isPlaying ? 'pause' : 'play'} size={28} color={palette.paper} />
    </Pressable>
  );
}
