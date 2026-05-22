# Playoff Mobile

Plataforma social de música colaborativa — salas em tempo real, fila com votação, player imersivo e visual premium.

## Stack

- **Mobile:** Expo 56 · React Native · Expo Router · NativeWind · Reanimated · Skia
- **State:** Zustand (UI) · TanStack Query (server)
- **Backend:** Supabase (Postgres · Realtime · RLS · Edge Functions)
- **Auth:** Spotify OAuth PKCE
- **CI:** GitHub Actions · EAS Build · Sentry (Phase 6)

## Estrutura

```
apps/mobile/          # App Expo
packages/
  ui/                 # Design system primitives
  types/              # Contratos compartilhados
  config/             # Env + constants
  utils/              # Helpers puros
  services/           # Supabase / Spotify adapters
supabase/migrations/  # Schema SQL
```

## Setup

```bash
# Requisitos: Node 22+, pnpm 9+
pnpm install
cp .env.example apps/mobile/.env
# Preencher EXPO_PUBLIC_SUPABASE_* e EXPO_PUBLIC_SPOTIFY_CLIENT_ID

pnpm dev
```

## Claude Code

Leia **[CLAUDE.md](./CLAUDE.md)** antes de implementar qualquer feature — contém regras de arquitetura, roadmap e convenções.

## Documentação

- [Arquitetura](./docs/ARCHITECTURE.md)
- [Variáveis de ambiente](./docs/ENV.md)
- [Roadmap](./docs/ROADMAP.md)

## Git

- `main` — produção
- `develop` — integração
- `feature/*` · `fix/*` — Conventional Commits

## Licença

Projeto acadêmico / portfólio — uso conforme políticas das APIs (Spotify, Supabase).
