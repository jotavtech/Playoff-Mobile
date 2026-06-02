import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@playoff/ui';
import type { HistoryItem, VoteResult } from '@playoff/types';
import { AtlasHeader } from '@/components/atlas/AtlasHeader';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useProfile';

const RESULT_META: Record<VoteResult, { label: string; className: string }> = {
  won: { label: 'Venceu', className: 'text-success' },
  lost: { label: 'Não venceu', className: 'text-muted' },
  pending: { label: 'Em andamento', className: 'text-playoff' },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}

function HistoryRow({ item }: { item: HistoryItem }) {
  const meta = RESULT_META[item.result];
  return (
    <View className="border-border bg-card flex-row items-center gap-3 rounded-2xl border p-3">
      <Image
        source={{ uri: item.song.coverUrl }}
        style={{ width: 48, height: 48, borderRadius: 10 }}
        contentFit="cover"
        transition={200}
      />
      <View className="flex-1">
        <Text className="text-foreground font-semibold" numberOfLines={1}>
          {item.song.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {item.song.artist} · {item.round.title}
        </Text>
      </View>
      <View className="items-end">
        <Text className={`text-xs font-bold uppercase tracking-wider ${meta.className}`}>
          {meta.label}
        </Text>
        <Text variant="caption">{formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: items, isLoading, isError, refetch, isRefetching } = useHistory();

  return (
    <ScreenContainer onRefresh={() => void refetch()} refreshing={isRefetching}>
      <AtlasHeader />

      <View>
        <Text variant="display">Histórico</Text>
        <Text variant="caption" className="mt-1">
          Suas escolhas dentro do Playoff.
        </Text>
      </View>

      {!isAuthenticated ? (
        <EmptyState
          icon="history"
          title="Entre para ver seu histórico"
          message="Entre com Spotify para salvar e revisitar todas as suas votações."
          actionLabel="Entrar com Spotify"
          onAction={() => router.push('/login')}
        />
      ) : isLoading ? (
        <LoadingState message="Carregando seu histórico…" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon="history"
          title="Nenhuma votação ainda"
          message="Entre em uma rodada e escolha sua faixa para começar sua jornada."
          actionLabel="Ir para votação"
          onAction={() => router.push('/vote')}
        />
      ) : (
        <View className="gap-2">
          {items.map((item) => (
            <HistoryRow key={item.voteId} item={item} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
