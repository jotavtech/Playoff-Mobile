import { prisma } from './lib/prisma';
import { searchTracks } from './lib/spotify';
import { upsertSong } from './modules/rounds/rounds.service';

const BADGES = [
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

const hasSpotifyCreds = (): boolean =>
  Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);

const seedBadges = async (): Promise<void> => {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      create: badge,
      update: { description: badge.description, icon: badge.icon },
    });
  }
  console.log(`[seed] ${BADGES.length} badges prontos.`);
};

const seedDemoRound = async (): Promise<void> => {
  if (!hasSpotifyCreds()) {
    console.log('[seed] Sem credenciais do Spotify — pulando rodada demo.');
    return;
  }

  const existing = await prisma.round.findFirst({ where: { status: 'ACTIVE' } });
  if (existing) {
    console.log('[seed] Já existe uma rodada ativa — pulando rodada demo.');
    return;
  }

  try {
    const tracks = await searchTracks('top hits brazil', 4);
    if (tracks.length < 4) {
      console.log('[seed] Resultados insuficientes do Spotify — pulando rodada demo.');
      return;
    }

    const songs = [];
    for (const track of tracks.slice(0, 4)) {
      songs.push(await upsertSong(track));
    }

    await prisma.round.create({
      data: {
        title: 'Hit do Momento',
        description: 'Vote na melhor faixa do momento, selecionada pelo Atlas AI Curator.',
        status: 'ACTIVE',
        startsAt: new Date(),
        songs: {
          create: songs.map((song, index) => ({ songId: song.id, position: index + 1 })),
        },
      },
    });
    console.log('[seed] Rodada demo "Hit do Momento" criada com 4 faixas reais.');
  } catch (err) {
    console.log(
      '[seed] Falha ao criar rodada demo (Spotify indisponível) — pulando.',
      err instanceof Error ? err.message : err,
    );
  }
};

const main = async (): Promise<void> => {
  await seedBadges();
  await seedDemoRound();
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('[seed] Concluído.');
  })
  .catch(async (err) => {
    console.error('[seed] Erro:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
