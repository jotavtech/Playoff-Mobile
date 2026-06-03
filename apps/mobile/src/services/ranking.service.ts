import type { RankingItem, RankingScope } from '@playoff/types';
import { api } from './api';

export const rankingService = {
  byScope(scope: RankingScope, roundId?: string): Promise<RankingItem[]> {
    const path = scope === 'round' && roundId ? `/ranking/round/${roundId}` : `/ranking/${scope}`;
    return api.get<{ items: RankingItem[] }>(path).then((r) => r.items);
  },
};
