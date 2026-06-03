# @playoff/api — Atlas Playoff Backend

Secure backend for **Atlas Playoff**, a music curation & voting app. This is the
**only** place that holds secrets: it proxies the Spotify Web API and OpenAI. The
mobile app talks exclusively to this service.

## Stack

- Node.js + Express 4 + TypeScript (strict)
- Prisma ORM + PostgreSQL
- JWT auth (`jsonwebtoken`)
- OpenAI SDK (`openai`)
- Native `fetch` for Spotify HTTP calls (Node 20+)
- `zod` validation, `helmet`, `cors`, `express-rate-limit`
- `tsx` for dev, `tsc` for build

## Setup

```bash
# From the monorepo root
pnpm install --filter @playoff/api...

# Configure env: copy the template and fill real values
cp apps/api/.env.example apps/api/.env
# edit apps/api/.env

# Generate the Prisma client
pnpm --filter @playoff/api prisma:generate

# Run migrations against your Postgres database
pnpm --filter @playoff/api prisma:migrate

# (optional) Seed a couple of badges + a demo ACTIVE round
pnpm --filter @playoff/api db:seed

# Dev server (tsx watch)
pnpm --filter @playoff/api dev
```

Production build:

```bash
pnpm --filter @playoff/api build
pnpm --filter @playoff/api start
```

## Environment

Read via the typed loader `src/lib/env.ts` (uses `dotenv`, loads `apps/api/.env`).
Required secrets are **lazily** validated inside each integration client, so the
server still boots for routes that don't need a given integration. Secret values
are never logged.

| Var                                           | Notes                        |
| --------------------------------------------- | ---------------------------- |
| `NODE_ENV`                                    | `development` / `production` |
| `PORT`                                        | default `3333`               |
| `APP_BASE_URL`                                | public base URL of this API  |
| `DATABASE_URL`                                | PostgreSQL connection string |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Spotify app credentials      |
| `SPOTIFY_REDIRECT_URI`                        | registered redirect URI      |
| `OPENAI_API_KEY`                              | OpenAI key                   |
| `OPENAI_MODEL`                                | default `gpt-4o-mini`        |
| `JWT_SECRET`                                  | signing secret               |
| `JWT_EXPIRES_IN`                              | default `30d`                |
| `MOBILE_REDIRECT_URI`                         | mobile deep-link redirect    |

## Architecture

```
src/
  server.ts            # http boot + graceful shutdown
  app.ts               # express app, middleware, routers, GET /health
  lib/
    env.ts             # typed, lazy-validated env loader
    prisma.ts          # PrismaClient singleton
    openai.ts          # lazy OpenAI client
    spotify.ts         # client-credentials cache, PKCE exchange/refresh, track mapping
  middleware/
    auth.middleware.ts # requireAuth / optionalAuth / signToken
    error.middleware.ts# central AppError + Zod handler
    rate-limit.middleware.ts
  utils/
    errors.ts          # AppError (status + code)
    response.ts        # ok / created helpers
    serializers.ts     # domain DTO serializers
  modules/
    auth/  spotify/  rounds/  votes/  ranking/  profile/  ai/
  seed.ts
prisma/schema.prisma
```

Every error response is `{ error: { code, message } }` with an appropriate status.

## Endpoints

- `GET  /health`
- `POST /auth/spotify/exchange` — PKCE code exchange -> `AuthResult`
- `GET  /auth/me` (auth)
- `POST /auth/logout`
- `GET  /spotify/search?q=&limit=20`
- `GET  /spotify/tracks/:id`
- `GET  /rounds/active` · `GET /rounds` · `GET /rounds/:id`
- `POST /rounds` (auth) · `POST /rounds/:id/start` (auth) · `POST /rounds/:id/finish` (auth)
- `POST /rounds/:id/vote` (auth)
- `GET  /me/votes` · `GET /me/profile` · `GET /me/stats` · `GET /me/history` · `GET /me/badges` (auth)
- `GET  /ranking/round/:id` · `GET /ranking/weekly` · `GET /ranking/global`
- `POST /ai/curator` · `/ai/round-suggestion` · `/ai/round-description` · `/ai/result-insight` · `/ai/share-caption` (auth, rate-limited)

## Notes

- The AI curator asks OpenAI for a JSON plan, then resolves real songs through
  Spotify search. If OpenAI or Spotify fail, the API returns a `502` AppError
  with a clear message — it never crashes.
- Votes are one per user per round (`@@unique([userId, roundId])`); re-voting
  upserts the chosen song while a round is `ACTIVE`.
