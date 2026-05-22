# Features

Arquitetura por feature. Regras:

- **Sem regra de negócio em componentes** — use `services/` e `hooks/`
- **Zustand** apenas para UI/ephemeral (`store/`)
- **TanStack Query** para server state
- Um feature = uma pasta com `components`, `hooks`, `services`, `store`, `screens`, `utils`, `types`

## Ordem de implementação

| Phase | Feature | Pasta |
|-------|---------|-------|
| 3 | Auth Spotify PKCE | `auth/` |
| 4 | Player global | `player/` |
| 5 | Rooms + realtime | `rooms/` |
| 2+ | Home feed | `home/` |
| 7 | Search | `search/` |
| 6+ | Social | `social/` |
