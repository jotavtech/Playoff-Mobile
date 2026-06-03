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

/** Cast a vote, with optimistic update of the round tally. */
export function useVote(roundId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (songId: string) => votesService.vote(roundId, songId),
    onSuccess: (round: Round) => {
      qc.setQueryData(QUERY_KEYS.activeRound, round);
      qc.setQueryData(QUERY_KEYS.round(round.id), round);
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.history });
      void qc.invalidateQueries({ queryKey: ['ranking'] });
    },
  });
}
