import { createApp } from './app';
import { env } from './lib/env';
import { prisma } from './lib/prisma';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[atlas-api] listening on ${env.APP_BASE_URL} (port ${env.PORT})`);
});

const shutdown = async (signal: string): Promise<void> => {
  console.log(`[atlas-api] received ${signal}, shutting down...`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
