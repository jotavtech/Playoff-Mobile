# Playoff Mobile — Claude Code Guide

Repositório monorepo premium de música social colaborativa. **Não é um wrapper do Spotify** — é uma plataforma de salas em tempo real, player imersivo e UX motion-driven.

## Repositório

- **Remote:** `git@github.com:jotavtech/Playoff-Mobile.git`
- **App:** `apps/mobile` (`@playoff/mobile`)
- **Packages:** `@playoff/ui`, `@playoff/types`, `@playoff/config`, `@playoff/utils`, `@playoff/services`
- **Stack:** Expo SDK 56 · React Native 0.85 · Expo Router · NativeWind v4 · Zustand · TanStack Query · Supabase

## Comandos

```bash
pnpm install          # raiz do monorepo
pnpm dev              # expo start
pnpm android
pnpm lint
pnpm typecheck
```

## Arquitetura (OBRIGATÓRIO)

```
apps/mobile/src/
  app/           # Expo Router apenas — rotas finas
  features/      # auth, home, player, rooms, search, social
  shared/        # componentes cross-feature
  visual/        # skia, gl, three, motion, effects
  lib/           # providers, storage
  store/         # Zustand (UI only)
  theme/         # design tokens
  services/      # adapters mobile-specific (se não couber em packages)
```

### Regras de ouro

1. **Feature-based** — lógica em `features/*/services` e `hooks`, nunca em componentes gigantes
2. **Zustand** = UI/ephemeral · **React Query** = server state
3. **Strict TypeScript** — `any` proibido
4. **Visual layer** — Skia/Reanimated primeiro; GL/Three só com lazy-load + fallback
5. **Conventional Commits** — `feat(rooms): ...`, `fix(auth): ...`

## Roadmap (implementar nesta ordem)

| Phase | Escopo | Status |
|-------|--------|--------|
| 1 | Foundation (monorepo, router, nativewind, stores) | ✅ Scaffold |
| 2 | Design system (`theme/`, `@playoff/ui`) | 🔲 |
| 3 | Auth Spotify PKCE + Secure Store + guards | 🔲 |
| 4 | Global player + visuals ambient | 🔲 |
| 5 | Rooms + Supabase Realtime + voting | 🔲 |
| 6 | Polish, Sentry, a11y, performance | 🔲 |

## 5 visuais obrigatórios (PRD)

1. `visual/effects/ambient/PlayerAmbientBackground` — upgrade Skia
2. `visual/motion/gestures/ExpandedPlayerGesture`
3. `visual/effects/ambient/RoomStageBackground`
4. `visual/effects/particles/VoteBurst`
5. `visual/skia/components/PremiumLoader` — upgrade Skia

Respeitar `useSettingsStore`: `reducedMotion`, `lowEndMode`.

## Supabase

- Schema: `supabase/migrations/00001_initial_schema.sql`
- Tabelas: users, rooms, room_members, room_queue, room_votes, playback_state, activity_feed
- Events: `ROOM_JOINED`, `ROOM_LEFT`, `SONG_ADDED`, `SONG_REMOVED`, `VOTE_UPDATED`, `PLAYBACK_CHANGED`, `ROOM_CLOSED`
- **RLS policies** — implementar na Phase 3/5

## Env

Copiar `.env.example` → `apps/mobile/.env`. Variáveis `EXPO_PUBLIC_*` apenas para valores públicos.

## Ao implementar uma feature

1. Ler `docs/ARCHITECTURE.md` e tipos em `packages/types`
2. Criar `features/<name>/` completo (components, hooks, services, store, types)
3. Wire rotas em `src/app/` (thin screens)
4. Adicionar query keys em `packages/config/src/constants.ts`
5. Testar em device Android real para visuais GPU

## Nunca fazer

- Componentes > ~150 linhas sem extrair
- Business logic em `src/app/*.tsx`
- Secrets em `EXPO_PUBLIC_*`
- GPU pesado sem fallback
- Duplicar tipos — usar `@playoff/types`

## Referência completa

O PRD master está na conversa inicial / `docs/PRD.md` (se existir).
