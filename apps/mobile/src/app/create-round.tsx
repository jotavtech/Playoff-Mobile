import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { Text } from '@playoff/ui';
import { QUERY_KEYS } from '@playoff/config';
import type { Song } from '@playoff/types';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { MusicCard } from '@/components/playoff/MusicCard';
import { Icon } from '@/components/ui/Icon';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useAuth } from '@/hooks/useAuth';
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer';
import { useSpotifySearch } from '@/hooks/useSpotifySearch';
import { roundsService } from '@/services/rounds.service';
import { palette } from '@/theme/tokens';

const MAX_TRACKS = 4;

export default function CreateRoundScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { playingId, toggle } = usePreviewPlayer();

  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<Song[]>([]);
  const [creating, setCreating] = useState(false);

  const { data: results, isLoading, isError, refetch } = useSpotifySearch(query);

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.spotifyTrackId)), [selected]);
  const canCreate = selected.length === MAX_TRACKS;

  const toggleSelect = (song: Song) => {
    setSelected((prev) => {
      if (prev.some((s) => s.spotifyTrackId === song.spotifyTrackId)) {
        return prev.filter((s) => s.spotifyTrackId !== song.spotifyTrackId);
      }
      if (prev.length >= MAX_TRACKS) {
        Alert.alert(
          'Limite atingido',
          `Uma rodada tem ${MAX_TRACKS} faixas. Remova uma para trocar.`,
        );
        return prev;
      }
      return [...prev, song];
    });
  };

  const createRound = async () => {
    if (!canCreate) return;
    setCreating(true);
    try {
      const round = await roundsService.create({
        title: title.trim() || 'Rodada Atlas',
        songSpotifyIds: selected.map((s) => s.spotifyTrackId),
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

  if (!isAuthenticated) {
    return (
      <ScreenContainer scroll={false} tone="playoff">
        <CreateHeader onClose={() => router.back()} />
        <View className="flex-1 justify-center">
          <EmptyState
            icon="plus"
            title="Entre para criar rodadas"
            message="Monte batalhas com faixas reais do Spotify entrando com sua conta."
            actionLabel="Entrar com Spotify"
            onAction={() => router.push('/login')}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer tone="playoff" contentBottomPadding={140}>
      <CreateHeader onClose={() => router.back()} />

      <Text variant="caption" className="leading-5">
        Busque no Spotify e escolha {MAX_TRACKS} faixas para a batalha.
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nome da rodada (opcional)"
        placeholderTextColor={palette.grayWeak}
        className="border-border bg-card text-foreground rounded-2xl border px-4 py-3 text-base"
        style={{ color: palette.white }}
      />

      <View className="border-border bg-card flex-row items-center gap-2 rounded-2xl border px-3">
        <Icon name="search" size={18} color={palette.gray} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar música ou artista…"
          placeholderTextColor={palette.grayWeak}
          autoCorrect={false}
          className="text-foreground flex-1 py-3 text-base"
          style={{ color: palette.white }}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Text className="text-muted text-lg">✕</Text>
          </Pressable>
        ) : null}
      </View>

      {selected.length > 0 ? (
        <View className="gap-2">
          <Text variant="label">
            Selecionadas · {selected.length}/{MAX_TRACKS}
          </Text>
          <View className="gap-2">
            {selected.map((song) => (
              <MusicCard
                key={song.spotifyTrackId}
                song={song}
                selected
                trailing="check"
                isPlaying={playingId === song.id}
                onPress={() => toggleSelect(song)}
                onTogglePreview={() => void toggle(song.id, song.previewUrl)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View className="gap-2">
        <Text variant="label">Resultados</Text>
        {query.trim().length < 2 ? (
          <EmptyState
            icon="search"
            title="Busque uma faixa"
            message="Digite ao menos 2 letras para procurar no Spotify."
          />
        ) : isLoading ? (
          <LoadingState message="Buscando no Spotify…" />
        ) : isError ? (
          <ErrorState
            message="Não foi possível buscar no Spotify."
            onRetry={() => void refetch()}
          />
        ) : !results || results.length === 0 ? (
          <EmptyState icon="search" title="Nada encontrado" message="Tente outro termo de busca." />
        ) : (
          <View className="gap-2">
            {results.map((song) => (
              <MusicCard
                key={song.spotifyTrackId}
                song={song}
                selected={selectedIds.has(song.spotifyTrackId)}
                isPlaying={playingId === song.id}
                onPress={() => toggleSelect(song)}
                onTogglePreview={() => void toggle(song.id, song.previewUrl)}
              />
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={() => void createRound()}
        disabled={!canCreate || creating}
        className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${canCreate && !creating ? 'bg-playoff active:opacity-90' : 'bg-card-elevated opacity-60'}`}
      >
        <Icon name="trophy" size={18} color={palette.white} />
        <Text className="text-sm font-bold uppercase tracking-widest text-white">
          {creating ? 'Criando…' : `Criar rodada (${selected.length}/${MAX_TRACKS})`}
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

function CreateHeader({ onClose }: { onClose: () => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="gap-2">
        <AtlasBadge tone="playoff" label="PLAYOFF" />
        <Text variant="display">Criar rodada</Text>
      </View>
      <Pressable
        onPress={onClose}
        className="border-border bg-card h-10 w-10 items-center justify-center rounded-full border active:opacity-80"
      >
        <Text className="text-muted text-lg">✕</Text>
      </Pressable>
    </View>
  );
}
