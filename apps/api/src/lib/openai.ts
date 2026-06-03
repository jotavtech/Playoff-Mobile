import OpenAI from 'openai';
import { env } from './env';

let client: OpenAI | null = null;

/**
 * Lazily instantiate the OpenAI client. Validates OPENAI_API_KEY only when
 * first used so the server can boot without it for non-AI routes.
 */
export const getOpenAI = (): OpenAI => {
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
};

export const openaiModel = (): string => env.OPENAI_MODEL;
