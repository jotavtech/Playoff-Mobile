import { QUERY_KEYS } from '@playoff/config';
import type { Round } from '@playoff/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roundsService } from '@/services/rounds.service';
import { votesService } from '@/services/votes.service';

export function useActiveRound() {
  return useQuery({
    queryKey: QUERY_KEYS.activeRound,
    queryFn: () => roundsService.active(),
    refetchInterval: 15_000,
  });
}

export function useRound(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.round(id),
    queryFn: () => roundsService.byId(id),
    enabled: Boolean(id),
  });
}

export function useRounds() {
  return useQuery({ queryKey: QUERY_KEYS.rounds, queryFn: () => roundsService.list() });
}

/** Optimistically apply a vote to a cached round's tally. */
function applyOptimisticVote(round: Round, songId: string): Round {
  const totalVotes = round.totalVotes + 1;
  const songs = round.songs.map((song) =>
    song.id === songId ? { ...song, votes: song.votes + 1 } : song,
  );
  return {
    ...round,
    totalVotes,
    songs: songs.map((song) => ({
      ...song,
      percentage: totalVotes > 0 ? Math.round((song.votes / totalVotes) * 100) : 0,
    })),
  };
}

/** Snapshot of the round caches touched by a vote, used to roll back on error. */
type VoteContext = {
  prevActive: Round | undefined;
  prevRound: Round | undefined;
};

/** Cast a vote, with optimistic update of the round tally and rollback on error. */
export function useVote(roundId: string) {
  const qc = useQueryClient();
  return useMutation<Round, Error, string, VoteContext>({
    mutationFn: (songId: string) => votesService.vote(roundId, songId),
    onMutate: async (songId): Promise<VoteContext> => {
      const roundKey = QUERY_KEYS.round(roundId);
      await Promise.all([
        qc.cancelQueries({ queryKey: QUERY_KEYS.activeRound }),
        qc.cancelQueries({ queryKey: roundKey }),
      ]);

      const prevActive = qc.getQueryData<Round>(QUERY_KEYS.activeRound);
      const prevRound = qc.getQueryData<Round>(roundKey);

      if (prevActive && prevActive.id === roundId) {
        qc.setQueryData(QUERY_KEYS.activeRound, applyOptimisticVote(prevActive, songId));
      }
      if (prevRound) {
        qc.setQueryData(roundKey, applyOptimisticVote(prevRound, songId));
      }

      return { prevActive, prevRound };
    },
    onError: (_error, _songId, context) => {
      if (!context) return;
      if (context.prevActive) qc.setQueryData(QUERY_KEYS.activeRound, context.prevActive);
      if (context.prevRound) qc.setQueryData(QUERY_KEYS.round(roundId), context.prevRound);
    },
    onSuccess: (round: Round) => {
      qc.setQueryData(QUERY_KEYS.activeRound, round);
      qc.setQueryData(QUERY_KEYS.round(round.id), round);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.history });
      // Prefix match refreshes every ranking scope (global, weekly, per-round).
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.rankings });
    },
  });
}
