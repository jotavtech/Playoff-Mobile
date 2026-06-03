import type { Round } from '@playoff/types';
import { api } from './api';

export const roundsService = {
  active(): Promise<Round | null> {
    return api.get<{ round: Round | null }>('/rounds/active').then((r) => r.round);
  },

  list(): Promise<Round[]> {
    return api.get<{ rounds: Round[] }>('/rounds').then((r) => r.rounds);
  },

  byId(id: string): Promise<Round> {
    return api.get<{ round: Round }>(`/rounds/${id}`).then((r) => r.round);
  },

  create(input: { title: string; description?: string; songSpotifyIds: string[] }): Promise<Round> {
    return api.post<{ round: Round }>('/rounds', input).then((r) => r.round);
  },

  start(id: string): Promise<Round> {
    return api.post<{ round: Round }>(`/rounds/${id}/start`).then((r) => r.round);
  },

  finish(id: string): Promise<Round> {
    return api.post<{ round: Round }>(`/rounds/${id}/finish`).then((r) => r.round);
  },
};
