import type { Round, RoundSong } from '@playoff/types';

/** The song currently leading the round (or first if no votes yet). */
export function getLeaderSong(round: Round | null | undefined): RoundSong | null {
  if (!round || round.songs.length === 0) return null;
  return round.songs.reduce(
    (best, song) => (song.votes > best.votes ? song : best),
    round.songs[0]!,
  );
}

export function formatVotes(votes: number): string {
  if (votes >= 1_000_000) return `${(votes / 1_000_000).toFixed(1)}M`;
  if (votes >= 1_000) return `${(votes / 1_000).toFixed(1)}k`;
  return String(votes);
}

export function formatDuration(ms: number | null | undefined): string {
  if (!ms || ms <= 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function statusLabel(status: Round['status']): string {
  switch (status) {
    case 'active':
      return 'Em andamento';
    case 'finished':
      return 'Encerrada';
    default:
      return 'Rascunho';
  }
}
