# Roadmap de implementação

Use esta ordem no Claude Code. Cada fase deve compilar (`pnpm typecheck`) antes da próxima.

## Phase 1 — Foundation ✅

- [x] Monorepo pnpm
- [x] Expo Router + `src/app`
- [x] NativeWind + tokens
- [x] Zustand stores base
- [x] TanStack Query provider
- [x] Packages compartilhados
- [x] CI GitHub Actions
- [x] Schema Supabase inicial

## Phase 2 — Design System

- [ ] Expandir `@playoff/ui` (Input, Modal, Skeleton, BlurCard)
- [ ] Tipografia custom (carregar fonts)
- [ ] Motion utilities em `visual/motion/`
- [ ] Storybook opcional

## Phase 3 — Auth

- [ ] Spotify PKCE (`expo-auth-session` + `expo-crypto`)
- [ ] Token refresh + `expo-secure-store`
- [ ] Auth guard nas tabs
- [ ] Sync user → Supabase `users`
- [ ] RLS básico

## Phase 4 — Player

- [ ] Mini player persistente
- [ ] Fullscreen gesture (Reanimated)
- [ ] `PlayerAmbientBackground` Skia
- [ ] Expo AV / Spotify playback bridge
- [ ] Queue UI

## Phase 5 — Rooms

- [ ] CRUD rooms + join code/QR
- [ ] Realtime queue + votes
- [ ] Host controls
- [ ] `RoomStageBackground`
- [ ] `VoteBurst` particles

## Phase 6 — Polish

- [ ] Sentry + error boundaries production
- [ ] Offline cache (MMKV + Query persist)
- [ ] Search debounced
- [ ] A11y reduced motion
- [ ] EAS production build
