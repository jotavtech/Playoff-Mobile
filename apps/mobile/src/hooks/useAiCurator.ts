import type { AiCuratorResult } from '@playoff/types';
import { useMutation } from '@tanstack/react-query';
import { aiService } from '@/services/ai.service';

/** Ask the Atlas AI Curator for a round suggestion with real Spotify songs. */
export function useAiCurator() {
  return useMutation<AiCuratorResult, Error, string>({
    mutationFn: (prompt: string) => aiService.curator(prompt),
  });
}
