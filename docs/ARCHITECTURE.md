# Arquitetura — Playoff Mobile

## Visão

Monorepo pnpm com app Expo e packages compartilhados. Separação estrita entre **UI**, **estado local**, **estado servidor** e **efeitos visuais**.

```mermaid
flowchart TB
  subgraph mobile [apps/mobile]
    AppRouter[src/app Expo Router]
    Features[features/*]
    Visual[visual/*]
    Stores[store Zustand]
  end
  subgraph packages [packages]
    UI[@playoff/ui]
    Types[@playoff/types]
    Config[@playoff/config]
    Services[@playoff/services]
  end
  subgraph backend [Supabase]
    PG[(PostgreSQL)]
    RT[Realtime Channels]
    EF[Edge Functions]
  end
  AppRouter --> Features
  Features --> UI
  Features --> Services
  Features --> Stores
  Features --> Visual
  Services --> Config
  Services --> Types
  Services --> backend
  Features --> TanStackQuery[TanStack Query]
```

## Camadas

| Camada              | Responsabilidade                           |
| ------------------- | ------------------------------------------ |
| `app/`              | Rotas, layouts, navegação                  |
| `features/`         | Domínio por produto (auth, player, rooms…) |
| `shared/`           | UI/helpers reutilizáveis entre features    |
| `visual/`           | Gráficos GPU/Skia/motion isolados          |
| `packages/services` | HTTP, Supabase, Spotify                    |
| `packages/types`    | Contratos e eventos                        |

## Realtime (Rooms)

1. Cliente subscreve canal `room:{id}`
2. Mutations otimistas na fila local
3. Eventos reconciliam com Postgres via Realtime
4. `playback_state` é fonte de verdade para sync de música

## Performance

- FlashList para listas longas
- Lazy import de `visual/three` e `visual/gl`
- `lowEndMode` desliga efeitos caros
- Reanimated na UI thread para gestos do player
