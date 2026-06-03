import type { Badge, HistoryItem, Profile, ProfileStats } from '@playoff/types';
import { api } from './api';

export const profileService = {
  profile(): Promise<Profile> {
    return api.get<Profile>('/me/profile');
  },

  stats(): Promise<ProfileStats> {
    return api.get<ProfileStats>('/me/stats');
  },

  history(): Promise<HistoryItem[]> {
    return api.get<{ items: HistoryItem[] }>('/me/history').then((r) => r.items);
  },

  badges(): Promise<Badge[]> {
    return api.get<{ badges: Badge[] }>('/me/badges').then((r) => r.badges);
  },
};
