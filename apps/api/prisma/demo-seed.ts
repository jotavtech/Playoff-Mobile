/**
 * Demo seed — populates the database with realistic data for presentations
 * WITHOUT requiring Spotify/OpenAI credentials. Safe to re-run (idempotent on
 * unique keys). Run with: pnpm --filter @playoff/api exec tsx prisma/demo-seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedSong {
  spotifyTrackId: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  externalUrl: string;
  durationMs: number;
  popularity: number;
}

const cover = (seed: string): string => `https://picsum.photos/seed/${seed}/600/600`;

const SONGS: SeedSong[] = [
  {
    spotifyTrackId: 'demo-1',
    title: 'Aquarela do Brasil',
    artist: 'Ary Barroso',
    album: 'Clássicos',
    coverUrl: cover('aquarela'),
    externalUrl: 'https://open.spotify.com/track/demo-1',
    durationMs: 198000,
    popularity: 82,
  },
  {
    spotifyTrackId: 'demo-2',
    title: 'Garota de Ipanema',
    artist: 'Tom Jobim',
    album: 'Bossa Nova',
    coverUrl: cover('ipanema'),
    externalUrl: 'https://open.spotify.com/track/demo-2',
    durationMs: 215000,
    popularity: 88,
  },
  {
    spotifyTrackId: 'demo-3',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    album: 'Sertanejo',
    coverUrl: cover('evidencias'),
    externalUrl: 'https://open.spotify.com/track/demo-3',
    durationMs: 271000,
    popularity: 90,
  },
  {
    spotifyTrackId: 'demo-4',
    title: 'Tim Maia — Descobridor',
    artist: 'Tim Maia',
    album: 'Soul',
    coverUrl: cover('timmaia'),
    externalUrl: 'https://open.spotify.com/track/demo-4',
    durationMs: 240000,
    popularity: 79,
  },
  {
    spotifyTrackId: 'demo-5',
    title: 'Sweet Child O Mine',
    artist: "Guns N' Roses",
    album: 'Appetite',
    coverUrl: cover('sweetchild'),
    externalUrl: 'https://open.spotify.com/track/demo-5',
    durationMs: 356000,
    popularity: 91,
  },
  {
    spotifyTrackId: 'demo-6',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    coverUrl: cover('bohemian'),
    externalUrl: 'https://open.spotify.com/track/demo-6',
    durationMs: 354000,
    popularity: 95,
  },
  {
    spotifyTrackId: 'demo-7',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: cover('blinding'),
    externalUrl: 'https://open.spotify.com/track/demo-7',
    durationMs: 200000,
    popularity: 96,
  },
  {
    spotifyTrackId: 'demo-8',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    coverUrl: cover('asitwas'),
    externalUrl: 'https://open.spotify.com/track/demo-8',
    durationMs: 167000,
    popularity: 93,
  },
];

const USERS = [
  { name: 'Vitor Félix', email: 'vitinhucfelix@gmail.com', avatarUrl: cover('vitor') },
  { name: 'Ana Souza', email: 'ana@demo.dev', avatarUrl: cover('ana') },
  { name: 'Bruno Lima', email: 'bruno@demo.dev', avatarUrl: cover('bruno') },
  { name: 'Carla Dias', email: 'carla@demo.dev', avatarUrl: cover('carla') },
  { name: 'Diego Reis', email: 'diego@demo.dev', avatarUrl: cover('diego') },
];

async function main(): Promise<void> {
  // Reset demo data (keeps schema). Order matters for FKs.
  await prisma.vote.deleteMany();
  await prisma.roundSong.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.round.deleteMany();

  const songs = await Promise.all(
    SONGS.map((s) =>
      prisma.song.upsert({ where: { spotifyTrackId: s.spotifyTrackId }, create: s, update: s }),
    ),
  );

  const users = await Promise.all(
    USERS.map((u) =>
      prisma.user.upsert({
        where: { spotifyUserId: u.email },
        create: { ...u, spotifyUserId: u.email },
        update: u,
      }),
    ),
  );

  const owner = users[0];

  // 1) ACTIVE round — shows up on the Vote screen
  const active = await prisma.round.create({
    data: {
      title: 'Hit do Momento',
      description: 'Vote na melhor faixa pop do momento.',
      status: 'ACTIVE',
      startsAt: new Date(),
      createdById: owner.id,
      songs: {
        create: [songs[4], songs[5], songs[6], songs[7]].map((s, i) => ({
          songId: s.id,
          position: i + 1,
        })),
      },
    },
  });
  // A few votes already cast on the active round
  await prisma.vote.createMany({
    data: [
      { userId: users[1].id, roundId: active.id, songId: songs[6].id },
      { userId: users[2].id, roundId: active.id, songId: songs[6].id },
      { userId: users[3].id, roundId: active.id, songId: songs[5].id },
      { userId: users[4].id, roundId: active.id, songId: songs[7].id },
    ],
  });

  // 2) FINISHED round — shows up in History + Ranking (with a winner)
  const finished = await prisma.round.create({
    data: {
      title: 'Clássicos Brasileiros',
      description: 'A melhor da MPB de todos os tempos.',
      status: 'FINISHED',
      startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdById: owner.id,
      winnerSongId: songs[2].id, // Evidências wins
      songs: {
        create: [songs[0], songs[1], songs[2], songs[3]].map((s, i) => ({
          songId: s.id,
          position: i + 1,
        })),
      },
    },
  });
  await prisma.vote.createMany({
    data: [
      { userId: users[0].id, roundId: finished.id, songId: songs[2].id },
      { userId: users[1].id, roundId: finished.id, songId: songs[2].id },
      { userId: users[2].id, roundId: finished.id, songId: songs[2].id },
      { userId: users[3].id, roundId: finished.id, songId: songs[1].id },
      { userId: users[4].id, roundId: finished.id, songId: songs[0].id },
    ],
  });

  // 3) Badges + award some to the demo user
  const badgeDefs = [
    {
      name: 'Primeiro Voto',
      description: 'Você votou pela primeira vez em uma rodada.',
      icon: '🎵',
    },
    {
      name: 'Bom de Palpite',
      description: 'Você acertou a música vencedora de uma rodada.',
      icon: '🏆',
    },
    {
      name: 'Curador Atlas',
      description: 'Você criou a sua primeira rodada de votação.',
      icon: '🎧',
    },
  ];
  const badges = await Promise.all(
    badgeDefs.map((b) => prisma.badge.upsert({ where: { name: b.name }, create: b, update: b })),
  );
  await prisma.userBadge.createMany({
    data: badges.map((b) => ({ userId: owner.id, badgeId: b.id })),
    skipDuplicates: true,
  });

  console.log('[demo-seed] OK');
  console.log(`  users: ${users.length}, songs: ${songs.length}`);
  console.log(`  rounds: 1 ACTIVE ("${active.title}"), 1 FINISHED ("${finished.title}")`);
  console.log(`  votes: 9, badges: ${badges.length} (all awarded to ${owner.name})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('[demo-seed] erro:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
