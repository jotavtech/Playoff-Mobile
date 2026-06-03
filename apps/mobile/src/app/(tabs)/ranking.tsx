import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { RankingScope } from '@playoff/types';
import { AtlasHeader } from '@/components/atlas/AtlasHeader';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { RankingRow } from '@/components/playoff/RankingRow';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useActiveRound } from '@/hooks/useRounds';
import { useRanking } from '@/hooks/useRanking';

const SCOPES: { key: RankingScope; label: string }[] = [
  { key: 'round', label: 'Rodada' },
  { key: 'weekly', label: 'Semana' },
  { key: 'global', label: 'Geral' },
];

export default function RankingScreen() {
  const [scope, setScope] = useState<RankingScope>('global');
  const { data: activeRound } = useActiveRound();
  const roundId = activeRound?.id;
  const { data: items, isLoading, isError, refetch, isRefetching } = useRanking(scope, roundId);

  const noRoundSelected = scope === 'round' && !roundId;

  return (
    <ScreenContainer onRefresh={() => void refetch()} refreshing={isRefetching}>
      <AtlasHeader />

      <View>
        <Text variant="display">Ranking Atlas</Text>
        <Text variant="caption" className="mt-1">
          As faixas mais votadas do ecossistema.
        </Text>
      </View>

      <View className="border-border bg-card flex-row gap-2 rounded-2xl border p-1">
        {SCOPES.map((s) => {
          const active = s.key === scope;
          return (
            <Pressable
              key={s.key}
              onPress={() => setScope(s.key)}
              className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-playoff' : ''}`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-white' : 'text-muted'}`}
              >
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {noRoundSelected ? (
        <EmptyState
          icon="trophy"
          title="Sem rodada ativa"
          message="Não há rodada em andamento para rankear agora."
        />
      ) : isLoading ? (
        <LoadingState message="Calculando ranking…" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon="trophy"
          title="Ranking vazio"
          message="Ainda não há votos suficientes para montar este ranking."
        />
      ) : (
        <View className="gap-2">
          {items.map((item) => (
            <RankingRow key={`${item.position}-${item.song.id}`} item={item} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
