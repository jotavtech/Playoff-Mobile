import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { QUERY_KEYS } from '@playoff/config';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { AiPromptInput } from '@/components/ai/AiPromptInput';
import { AiSuggestionCard } from '@/components/ai/AiSuggestionCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { Icon } from '@/components/ui/Icon';
import { useAiCurator } from '@/hooks/useAiCurator';
import { useAuth } from '@/hooks/useAuth';
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer';
import { roundsService } from '@/services/rounds.service';
import { palette } from '@/theme/tokens';

const EXAMPLES = [
  'Rodada com vibe noturna e indie melancólico',
  '4 músicas parecidas com Arctic Monkeys',
  'Batalha eletrônica para treinar',
  'Sad indie para uma madrugada chuvosa',
];

export default function AiCuratorScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();
  const curator = useAiCurator();
  const { playingId, toggle } = usePreviewPlayer();
  const [creating, setCreating] = useState(false);

  const result = curator.data;
  const songs = result?.songs ?? [];
  const canCreate = isAuthenticated && songs.length >= 4;

  const createRound = async () => {
    if (!result || songs.length < 4) return;
    setCreating(true);
    try {
      const round = await roundsService.create({
        title: result.roundName ?? 'Rodada Atlas AI',
        description: result.roundDescription,
        songSpotifyIds: songs.slice(0, 4).map((s) => s.spotifyTrackId),
      });
      await roundsService.start(round.id);
      await qc.invalidateQueries({ queryKey: QUERY_KEYS.activeRound });
      router.replace('/vote');
    } catch (err) {
      Alert.alert(
        'Não foi possível criar a rodada',
        err instanceof Error ? err.message : 'Tente novamente.',
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScreenContainer tone="atlas">
      <View className="flex-row items-center justify-between">
        <View className="gap-2">
          <AtlasBadge />
          <Text variant="display">Atlas AI Curator</Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          className="border-border bg-card h-10 w-10 items-center justify-center rounded-full border active:opacity-80"
        >
          <Text className="text-muted text-lg">✕</Text>
        </Pressable>
      </View>

      <Text variant="caption" className="leading-5">
        Descreva a vibe, o gênero ou um artista de referência. A IA do Atlas monta a batalha com
        faixas reais do Spotify.
      </Text>

      {!isAuthenticated ? (
        <EmptyState
          icon="sparkles"
          title="Entre para usar a IA"
          message="O Atlas AI Curator está disponível para membros. Entre com Spotify para criar rodadas inteligentes."
          actionLabel="Entrar com Spotify"
          onAction={() => router.push('/login')}
        />
      ) : (
        <>
          <AiPromptInput onSubmit={(p) => curator.mutate(p)} loading={curator.isPending} />

          {!result && !curator.isPending ? (
            <View className="gap-2">
              <Text variant="label">Experimente</Text>
              {EXAMPLES.map((ex) => (
                <Pressable
                  key={ex}
                  onPress={() => curator.mutate(ex)}
                  className="border-border bg-card flex-row items-center gap-2 rounded-xl border p-3 active:opacity-80"
                >
                  <Icon name="sparkles" size={16} color={palette.blueGlow} />
                  <Text variant="caption" className="text-foreground flex-1">
                    {ex}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {curator.isPending ? <LoadingState message="Gerando sugestão com Atlas AI…" /> : null}

          {curator.isError ? (
            <ErrorState
              message="A IA não conseguiu gerar uma sugestão agora."
              onRetry={() => curator.reset()}
            />
          ) : null}

          {result ? (
            <>
              <AiSuggestionCard
                result={result}
                playingId={playingId}
                onTogglePreview={(id, url) => void toggle(id, url)}
              />
              {canCreate ? (
                <Pressable
                  onPress={() => void createRound()}
                  disabled={creating}
                  className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${creating ? 'bg-card-elevated opacity-70' : 'bg-playoff active:opacity-90'}`}
                >
                  <Icon name="plus" size={18} color={palette.white} />
                  <Text className="text-sm font-bold uppercase tracking-widest text-white">
                    {creating ? 'Criando rodada…' : 'Criar rodada com estas faixas'}
                  </Text>
                </Pressable>
              ) : null}
            </>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
}
