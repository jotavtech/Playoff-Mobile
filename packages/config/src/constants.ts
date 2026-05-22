export const APP_NAME = 'Playoff';
export const APP_SCHEME = 'playoff';

export const QUERY_KEYS = {
  auth: ['auth'] as const,
  profile: ['profile'] as const,
  home: ['home'] as const,
  rooms: ['rooms'] as const,
  room: (id: string) => ['room', id] as const,
  roomQueue: (id: string) => ['room', id, 'queue'] as const,
  search: (q: string) => ['search', q] as const,
} as const;

export const STORAGE_KEYS = {
  authSession: 'playoff.auth.session',
  settings: 'playoff.user.settings',
  homeCache: 'playoff.cache.home',
} as const;

export const REALTIME_CHANNELS = {
  room: (id: string) => `room:${id}`,
} as const;
