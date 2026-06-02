export const APP_NAME = 'Atlas Playoff';
export const APP_SCHEME = 'playoff';

/** TanStack Query cache keys for the Atlas Playoff domain. */
export const QUERY_KEYS = {
  auth: ['auth'] as const,
  me: ['me'] as const,
  profile: ['me', 'profile'] as const,
  stats: ['me', 'stats'] as const,
  history: ['me', 'history'] as const,
  badges: ['me', 'badges'] as const,
  activeRound: ['rounds', 'active'] as const,
  rounds: ['rounds'] as const,
  round: (id: string) => ['rounds', id] as const,
  ranking: (scope: string, id?: string) =>
    id ? (['ranking', scope, id] as const) : (['ranking', scope] as const),
  search: (q: string) => ['spotify', 'search', q] as const,
} as const;

export const STORAGE_KEYS = {
  authToken: 'atlas.auth.token',
  settings: 'atlas.user.settings',
} as const;
