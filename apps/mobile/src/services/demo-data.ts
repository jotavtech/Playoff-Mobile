/**
 * Offline demo data. When EXPO_PUBLIC_DEMO_MODE=true the app serves these
 * fixtures instead of calling the Atlas backend, so the whole experience can
 * be shown with zero backend (no Postgres, no API, no Spotify). The shapes
 * mirror the real serialized API responses exactly.
 */
import type {
  AiCuratorResult,
  Badge,
  HistoryItem,
  Profile,
  ProfileStats,
  RankingItem,
  Round,
  RoundSong,
  Song,
  User,
} from '@playoff/types';

const cover = (seed: string): string => `https://picsum.photos/seed/${seed}/600/600`;

export const demoUser: User = {
  id: 'demo-user',
  spotifyUserId: 'vitinhucfelix@gmail.com',
  name: 'Vitor Félix',
  email: 'vitinhucfelix@gmail.com',
  avatarUrl: cover('vitor'),
  role: 'user',
  createdAt: '2026-06-03T23:07:10.676Z',
  updatedAt: '2026-06-03T23:07:10.676Z',
};

interface SongSpec {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  popularity: number;
  seed: string;
}

const roundSong = (
  spec: SongSpec,
  position: number,
  votes: number,
  percentage: number,
  isWinner = false,
): RoundSong => ({
  id: spec.id,
  spotifyTrackId: spec.trackId,
  title: spec.title,
  artist: spec.artist,
  album: spec.album,
  coverUrl: cover(spec.seed),
  externalUrl: `https://open.spotify.com/track/${spec.trackId}`,
  durationMs: spec.durationMs,
  popularity: spec.popularity,
  position,
  votes,
  percentage,
  isWinner,
});

const toSong = (s: RoundSong): Song => ({
  id: s.id,
  spotifyTrackId: s.spotifyTrackId,
  title: s.title,
  artist: s.artist,
  album: s.album,
  coverUrl: s.coverUrl,
  externalUrl: s.externalUrl,
  durationMs: s.durationMs,
  popularity: s.popularity,
});

// Active round songs
const sweet = roundSong(
  {
    id: 's5',
    trackId: 'demo-5',
    title: 'Sweet Child O Mine',
    artist: "Guns N' Roses",
    album: 'Appetite',
    durationMs: 356000,
    popularity: 91,
    seed: 'sweetchild',
  },
  1,
  1,
  20,
);
const bohemian = roundSong(
  {
    id: 's6',
    trackId: 'demo-6',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    durationMs: 354000,
    popularity: 95,
    seed: 'bohemian',
  },
  2,
  1,
  20,
);
const blinding = roundSong(
  {
    id: 's7',
    trackId: 'demo-7',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    durationMs: 200000,
    popularity: 96,
    seed: 'blinding',
  },
  3,
  2,
  40,
);
const asItWas = roundSong(
  {
    id: 's8',
    trackId: 'demo-8',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    durationMs: 167000,
    popularity: 93,
    seed: 'asitwas',
  },
  4,
  1,
  20,
);

// Finished round songs
const aquarela = roundSong(
  {
    id: 's1',
    trackId: 'demo-1',
    title: 'Aquarela do Brasil',
    artist: 'Ary Barroso',
    album: 'Clássicos',
    durationMs: 198000,
    popularity: 82,
    seed: 'aquarela',
  },
  1,
  1,
  20,
);
const ipanema = roundSong(
  {
    id: 's2',
    trackId: 'demo-2',
    title: 'Garota de Ipanema',
    artist: 'Tom Jobim',
    album: 'Bossa Nova',
    durationMs: 215000,
    popularity: 88,
    seed: 'ipanema',
  },
  2,
  1,
  20,
);
const evidencias = roundSong(
  {
    id: 's3',
    trackId: 'demo-3',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    album: 'Sertanejo',
    durationMs: 271000,
    popularity: 90,
    seed: 'evidencias',
  },
  3,
  3,
  60,
  true,
);
const timMaia = roundSong(
  {
    id: 's4',
    trackId: 'demo-4',
    title: 'Tim Maia — Descobridor',
    artist: 'Tim Maia',
    album: 'Soul',
    durationMs: 240000,
    popularity: 79,
    seed: 'timmaia',
  },
  4,
  0,
  0,
);

export const demoActiveRound: Round = {
  id: 'round-active',
  title: 'Hit do Momento',
  description: 'Vote na melhor faixa pop do momento.',
  status: 'active',
  startsAt: '2026-06-03T23:07:10.681Z',
  totalVotes: 5,
  songs: [sweet, bohemian, blinding, asItWas],
  createdAt: '2026-06-03T23:07:10.682Z',
  updatedAt: '2026-06-03T23:07:10.682Z',
};

export const demoFinishedRound: Round = {
  id: 'round-finished',
  title: 'Clássicos Brasileiros',
  description: 'A melhor da MPB de todos os tempos.',
  status: 'finished',
  startsAt: '2026-05-31T23:07:10.699Z',
  endsAt: '2026-06-01T23:07:10.699Z',
  winnerSongId: 's3',
  totalVotes: 5,
  songs: [aquarela, ipanema, evidencias, timMaia],
  createdAt: '2026-06-03T23:07:10.700Z',
  updatedAt: '2026-06-03T23:07:10.700Z',
};

/** Global ranking sorted by votes (winner of any finished round flagged). */
export const demoRankingGlobal: RankingItem[] = [
  { position: 1, song: toSong(evidencias), votes: 3, percentage: 30, isWinner: true },
  { position: 2, song: toSong(blinding), votes: 2, percentage: 20, isWinner: false },
  { position: 3, song: toSong(asItWas), votes: 1, percentage: 10, isWinner: false },
  { position: 4, song: toSong(aquarela), votes: 1, percentage: 10, isWinner: false },
  { position: 5, song: toSong(sweet), votes: 1, percentage: 10, isWinner: false },
  { position: 6, song: toSong(ipanema), votes: 1, percentage: 10, isWinner: false },
  { position: 7, song: toSong(bohemian), votes: 1, percentage: 10, isWinner: false },
];

/** Per-round ranking derived from a round's songs. */
const roundRanking = (round: Round): RankingItem[] =>
  [...round.songs]
    .sort((a, b) => b.votes - a.votes)
    .map((s, i) => ({
      position: i + 1,
      song: toSong(s),
      votes: s.votes,
      percentage: s.percentage,
      isWinner: s.isWinner,
    }));

export const demoBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Primeiro Voto',
    description: 'Você votou pela primeira vez em uma rodada.',
    icon: '🎵',
    earnedAt: '2026-06-03T23:07:10.714Z',
  },
  {
    id: 'b2',
    name: 'Bom de Palpite',
    description: 'Você acertou a música vencedora de uma rodada.',
    icon: '🏆',
    earnedAt: '2026-06-03T23:07:10.714Z',
  },
  {
    id: 'b3',
    name: 'Curador Atlas',
    description: 'Você criou a sua primeira rodada de votação.',
    icon: '🎧',
    earnedAt: '2026-06-03T23:07:10.714Z',
  },
];

export const demoStats: ProfileStats = { votesCount: 2, roundsCount: 2, correctCount: 1 };

export const demoProfile: Profile = { user: demoUser, stats: demoStats, badges: demoBadges };

export const demoHistory: HistoryItem[] = [
  {
    voteId: 'v1',
    round: { id: demoActiveRound.id, title: demoActiveRound.title, status: 'active' },
    song: { id: 's7', title: 'Blinding Lights', artist: 'The Weeknd', coverUrl: cover('blinding') },
    result: 'pending',
    createdAt: '2026-06-03T23:08:19.944Z',
  },
  {
    voteId: 'v2',
    round: { id: demoFinishedRound.id, title: demoFinishedRound.title, status: 'finished' },
    song: {
      id: 's3',
      title: 'Evidências',
      artist: 'Chitãozinho & Xororó',
      coverUrl: cover('evidencias'),
    },
    result: 'won',
    createdAt: '2026-06-03T23:07:10.706Z',
  },
];

const aiCurator: AiCuratorResult = {
  message:
    'Montei uma rodada com clássicos atemporais que sempre rendem boas disputas. ' +
    'Equilibrei rock, pop e MPB para agradar gostos diferentes.',
  roundName: 'Lendas Atemporais',
  roundDescription: 'Os hinos que atravessaram gerações — qual reina?',
  criteria: 'popularidade duradoura, impacto cultural e variedade de estilos',
  searchTerms: ['classic rock anthems', 'mpb essencial', 'pop hits'],
  songs: [toSong(evidencias), toSong(ipanema), toSong(blinding), toSong(aquarela)],
};

export type DemoResult = { handled: true; data: unknown } | { handled: false };

const NOPE: DemoResult = { handled: false };
const hit = (data: unknown): DemoResult => ({ handled: true, data });

/**
 * Maps an API method+path to a demo payload. Returns { handled: false } for
 * anything we don't simulate, so the caller falls back to a real fetch.
 */
export function getDemoResponse(method: string, path: string): DemoResult {
  const route = path.split('?')[0] ?? path;

  if (method === 'GET') {
    if (route === '/rounds/active') return hit({ round: demoActiveRound });
    if (route === '/rounds') return hit({ rounds: [demoFinishedRound, demoActiveRound] });
    if (route === '/auth/me') return hit({ user: demoUser });
    if (route === '/me/profile') return hit(demoProfile);
    if (route === '/me/stats') return hit(demoStats);
    if (route === '/me/badges') return hit({ badges: demoBadges });
    if (route === '/me/history' || route === '/me/votes') return hit({ items: demoHistory });
    if (route === '/ranking/global' || route === '/ranking/weekly')
      return hit({ items: demoRankingGlobal });

    const rankRound = route.match(/^\/ranking\/round\/(.+)$/);
    if (rankRound) {
      const round = rankRound[1] === demoFinishedRound.id ? demoFinishedRound : demoActiveRound;
      return hit({ items: roundRanking(round) });
    }

    const roundById = route.match(/^\/rounds\/(.+)$/);
    if (roundById) {
      const round = roundById[1] === demoFinishedRound.id ? demoFinishedRound : demoActiveRound;
      return hit({ round });
    }

    if (/^\/spotify\/tracks\/.+$/.test(route)) return hit({ track: toSong(blinding) });
  }

  if (method === 'POST') {
    if (route === '/auth/spotify/exchange') return hit({ token: 'demo-token', user: demoUser });
    if (route === '/auth/logout') return hit({ ok: true });
    if (/^\/rounds\/[^/]+\/vote$/.test(route)) return hit({ round: demoActiveRound });
    if (/^\/rounds\/[^/]+\/(start|finish)$/.test(route)) return hit({ round: demoActiveRound });
    if (route === '/rounds')
      return hit({ round: { ...demoActiveRound, id: 'round-new', title: 'Nova Rodada' } });
    if (route === '/ai/curator' || route === '/ai/round-suggestion') return hit(aiCurator);
    if (route === '/ai/round-description') return hit({ description: aiCurator.roundDescription });
    if (route === '/ai/result-insight')
      return hit({
        insight:
          'Evidências dominou com 60% dos votos — um resultado consistente com sua popularidade duradoura.',
      });
    if (route === '/ai/share-caption')
      return hit({ caption: 'Acabei de votar no Playoff 🎵 vem disputar o seu hit favorito!' });
  }

  return NOPE;
}
