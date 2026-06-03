import type { AiCuratorResult } from '@playoff/types';
import { api } from './api';

/**
 * All AI calls go through the Atlas backend, which holds the OpenAI key.
 * The mobile app never talks to OpenAI directly.
 */
export const aiService = {
  curator(prompt: string): Promise<AiCuratorResult> {
    return api.post<AiCuratorResult>('/ai/curator', { prompt });
  },

  roundSuggestion(prompt: string): Promise<AiCuratorResult> {
    return api.post<AiCuratorResult>('/ai/round-suggestion', { prompt });
  },

  roundDescription(roundId: string): Promise<{ description: string }> {
    return api.post<{ description: string }>('/ai/round-description', { roundId });
  },

  resultInsight(roundId: string): Promise<{ insight: string }> {
    return api.post<{ insight: string }>('/ai/result-insight', { roundId });
  },

  shareCaption(roundId: string): Promise<{ caption: string }> {
    return api.post<{ caption: string }>('/ai/share-caption', { roundId });
  },
};
