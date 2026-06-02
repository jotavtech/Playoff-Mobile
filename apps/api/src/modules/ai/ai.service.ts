import { getOpenAI, openaiModel } from '../../lib/openai';
import { prisma } from '../../lib/prisma';
import { searchTracks, type SongShape } from '../../lib/spotify';
import { AppError } from '../../utils/errors';
import type { SongDTO } from '../../utils/serializers';
import {
  CURATOR_SYSTEM,
  RESULT_INSIGHT_SYSTEM,
  ROUND_DESCRIPTION_SYSTEM,
  ROUND_SUGGESTION_SYSTEM,
  SHARE_CAPTION_SYSTEM,
} from './ai.prompts';

export interface AiCuratorResult {
  message: string;
  roundName?: string;
  roundDescription?: string;
  criteria?: string;
  searchTerms?: string[];
  songs?: SongDTO[];
}

interface CuratorPlan {
  message?: string;
  roundName?: string;
  roundDescription?: string;
  criteria?: string;
  searchTerms?: string[];
}

const toSongDTO = (track: SongShape): SongDTO => ({
  id: track.spotifyTrackId,
  spotifyTrackId: track.spotifyTrackId,
  title: track.title,
  artist: track.artist,
  album: track.album ?? undefined,
  coverUrl: track.coverUrl,
  previewUrl: track.previewUrl ?? undefined,
  externalUrl: track.externalUrl,
  durationMs: track.durationMs ?? undefined,
  popularity: track.popularity ?? undefined,
});

const persistAiRequest = async (
  userId: string | undefined,
  type: string,
  prompt: string,
  response: string,
): Promise<void> => {
  try {
    await prisma.aiRequest.create({
      data: { userId: userId ?? null, type, prompt, response },
    });
  } catch {
    // Logging an AI request must never break the response.
  }
};

/** Call OpenAI chat completions expecting strict JSON. */
const chatJson = async (system: string, user: string): Promise<string> => {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: openaiModel(),
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw AppError.badGateway('A IA não retornou resposta.', 'AI_EMPTY_RESPONSE');
    }
    return content;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.badGateway('Falha ao consultar a IA.', 'AI_UNAVAILABLE');
  }
};

/** Call OpenAI chat completions expecting free-form text. */
const chatText = async (system: string, user: string): Promise<string> => {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: openaiModel(),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });
    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw AppError.badGateway('A IA não retornou resposta.', 'AI_EMPTY_RESPONSE');
    }
    return content;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw AppError.badGateway('Falha ao consultar a IA.', 'AI_UNAVAILABLE');
  }
};

const parsePlan = (raw: string): CuratorPlan => {
  try {
    return JSON.parse(raw) as CuratorPlan;
  } catch {
    throw AppError.badGateway('A IA retornou um formato inválido.', 'AI_BAD_FORMAT');
  }
};

/** Collect up to `maxSongs` unique real Spotify songs from the search terms. */
const collectSongs = async (
  searchTerms: string[],
  maxSongs: number,
  perTerm: number,
): Promise<SongDTO[]> => {
  const seen = new Set<string>();
  const songs: SongDTO[] = [];

  for (const term of searchTerms) {
    if (songs.length >= maxSongs) break;
    try {
      const results = await searchTracks(term, perTerm);
      for (const track of results) {
        if (songs.length >= maxSongs) break;
        if (seen.has(track.spotifyTrackId)) continue;
        seen.add(track.spotifyTrackId);
        songs.push(toSongDTO(track));
      }
    } catch {
      // Skip terms that fail; keep building the list.
    }
  }

  return songs;
};

export const curator = async (
  userId: string | undefined,
  prompt: string,
): Promise<AiCuratorResult> => {
  const raw = await chatJson(CURATOR_SYSTEM, prompt);
  const plan = parsePlan(raw);
  await persistAiRequest(userId, 'curator', prompt, raw);

  const searchTerms = (plan.searchTerms ?? []).slice(0, 8);
  const songs = await collectSongs(searchTerms, 6, 1);

  return {
    message: plan.message ?? 'Aqui está a sua curadoria!',
    roundName: plan.roundName,
    roundDescription: plan.roundDescription,
    criteria: plan.criteria,
    searchTerms,
    songs,
  };
};

export const roundSuggestion = async (
  userId: string | undefined,
  prompt: string,
): Promise<AiCuratorResult> => {
  const raw = await chatJson(ROUND_SUGGESTION_SYSTEM, prompt);
  const plan = parsePlan(raw);
  await persistAiRequest(userId, 'round-suggestion', prompt, raw);

  const searchTerms = (plan.searchTerms ?? []).slice(0, 8);
  // Force exactly 4 songs suitable to create a round (one per term).
  let songs = await collectSongs(searchTerms, 4, 1);

  // Fallback: if fewer than 4 unique songs, broaden the search per term.
  if (songs.length < 4 && searchTerms.length > 0) {
    songs = await collectSongs(searchTerms, 4, 3);
  }

  return {
    message: plan.message ?? 'Sugestão de rodada pronta!',
    roundName: plan.roundName,
    roundDescription: plan.roundDescription,
    criteria: plan.criteria,
    searchTerms,
    songs: songs.slice(0, 4),
  };
};

const loadRoundContext = async (roundId: string): Promise<string> => {
  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: { songs: { include: { song: true }, orderBy: { position: 'asc' } } },
  });
  if (!round) throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');

  const songLines = round.songs.map((rs) => `- ${rs.song.title} — ${rs.song.artist}`).join('\n');

  return `Título: ${round.title}\nDescrição: ${round.description ?? '(sem descrição)'}\nMúsicas:\n${songLines}`;
};

export const roundDescription = async (
  userId: string | undefined,
  roundId: string,
): Promise<string> => {
  const context = await loadRoundContext(roundId);
  const text = await chatText(ROUND_DESCRIPTION_SYSTEM, context);
  await persistAiRequest(userId, 'round-description', context, text);
  return text;
};

export const resultInsight = async (
  userId: string | undefined,
  roundId: string,
): Promise<string> => {
  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: { songs: { include: { song: true } } },
  });
  if (!round) throw AppError.notFound('Rodada não encontrada.', 'ROUND_NOT_FOUND');

  const voteGroups = await prisma.vote.groupBy({
    by: ['songId'],
    where: { roundId },
    _count: { songId: true },
  });
  const voteMap = new Map(voteGroups.map((g) => [g.songId, g._count.songId]));

  const songLines = round.songs
    .map((rs) => {
      const winner = round.winnerSongId === rs.songId ? ' (VENCEDORA)' : '';
      return `- ${rs.song.title} — ${rs.song.artist}: ${voteMap.get(rs.songId) ?? 0} votos${winner}`;
    })
    .join('\n');

  const context = `Rodada: ${round.title}\nStatus: ${round.status}\nResultados:\n${songLines}`;
  const text = await chatText(RESULT_INSIGHT_SYSTEM, context);
  await persistAiRequest(userId, 'result-insight', context, text);
  return text;
};

export const shareCaption = async (
  userId: string | undefined,
  roundId: string,
): Promise<string> => {
  const context = await loadRoundContext(roundId);
  const text = await chatText(SHARE_CAPTION_SYSTEM, context);
  await persistAiRequest(userId, 'share-caption', context, text);
  return text;
};
