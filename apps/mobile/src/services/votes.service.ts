import type { HistoryItem, Round } from '@playoff/types';
import { api } from './api';

export const votesService = {
  vote(roundId: string, songId: string): Promise<Round> {
    return api.post<{ round: Round }>(`/rounds/${roundId}/vote`, { songId }).then((r) => r.round);
  },

  myVotes(): Promise<HistoryItem[]> {
    return api.get<{ items: HistoryItem[] }>('/me/votes').then((r) => r.items);
  },
};
