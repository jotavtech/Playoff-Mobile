import { QUERY_KEYS } from '@playoff/config';
import type { RankingScope } from '@playoff/types';
import { useQuery } from '@tanstack/react-query';
import { rankingService } from '@/services/ranking.service';

export function useRanking(scope: RankingScope, roundId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ranking(scope, roundId),
    queryFn: () => rankingService.byScope(scope, roundId),
    enabled: scope !== 'round' || Boolean(roundId),
  });
}
