import path from 'node:path';
import dotenv from 'dotenv';

// Load .env from apps/api/.env regardless of cwd.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

type Required = (key: string) => string;

/**
 * Returns an env value or throws a clear error. Use lazily inside integration
 * clients so the server can still boot for routes that don't need that secret.
 */
const required: Required = (key) => {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `[env] Missing required environment variable "${key}". ` +
        `Add it to apps/api/.env (see .env.example).`,
    );
  }
  return value;
};

const optional = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value && value.trim() !== '' ? value : fallback;
};

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: Number(optional('PORT', '3333')),
  APP_BASE_URL: optional('APP_BASE_URL', 'http://localhost:3333'),
  OPENAI_MODEL: optional('OPENAI_MODEL', 'gpt-4o-mini'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '30d'),
  MOBILE_REDIRECT_URI: optional('MOBILE_REDIRECT_URI', ''),

  // Lazy getters — only validated when an integration actually needs them.
  get DATABASE_URL(): string {
    return required('DATABASE_URL');
  },
  get SPOTIFY_CLIENT_ID(): string {
    return required('SPOTIFY_CLIENT_ID');
  },
  get SPOTIFY_CLIENT_SECRET(): string {
    return required('SPOTIFY_CLIENT_SECRET');
  },
  get SPOTIFY_REDIRECT_URI(): string {
    return required('SPOTIFY_REDIRECT_URI');
  },
  get OPENAI_API_KEY(): string {
    return required('OPENAI_API_KEY');
  },
  get JWT_SECRET(): string {
    return required('JWT_SECRET');
  },
} as const;

export const isProduction = env.NODE_ENV === 'production';
