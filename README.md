# Atlas Playoff Mobile

Experiência musical inteligente dentro do ecossistema **Atlas** — curadoria,
votação e descoberta de música com faixas reais do Spotify e IA via OpenAI.
Não há dados mockados: tudo vem do backend Atlas, do Spotify e do banco.

## Stack

- **Mobile:** Expo 56 · React Native · Expo Router · NativeWind · Reanimated · Skia
- **State:** Zustand (UI) · TanStack Query (server state)
- **Backend (`apps/api`):** Node · Express · TypeScript · Prisma · PostgreSQL
- **Auth:** Spotify Authorization Code + **PKCE** (token exchange no backend)
- **IA:** OpenAI (Atlas AI Curator) — **somente** via backend

## Arquitetura segura

```
App Mobile (Expo)  ──►  Atlas Backend API  ──►  PostgreSQL
                              │  ├──►  Spotify Web API
                              │  └──►  OpenAI API
```

O app mobile **nunca** chama a OpenAI direto e **nunca** guarda o
`SPOTIFY_CLIENT_SECRET` nem a `OPENAI_API_KEY`. Esses segredos vivem apenas no
backend (`apps/api/.env`, fora do git). O mobile só consome a API do Atlas e
usa o `EXPO_PUBLIC_SPOTIFY_CLIENT_ID` (público) para iniciar o login PKCE.

## Estrutura

```
apps/
  mobile/                 # App Expo (interface, auth, navegação, consumo da API)
    src/components/        # atlas/ · playoff/ · ai/ · ui/ · navigation/
    src/services/          # cliente HTTP + serviços de domínio
    src/hooks/             # React Query + auth
  api/                    # Backend seguro (Spotify + OpenAI + Prisma)
    src/modules/           # auth · spotify · rounds · votes · ranking · profile · ai
packages/
  ui/ types/ config/ utils/ services/
```

## Setup

```bash
# Requisitos: Node 22+, pnpm 9+, PostgreSQL
pnpm install

# Backend
cp .env.example apps/api/.env        # preencher DATABASE_URL, SPOTIFY_*, OPENAI_API_KEY, JWT_SECRET
pnpm --filter @playoff/api prisma:migrate
pnpm --filter @playoff/api db:seed   # opcional: cria badges + rodada demo (precisa de Spotify creds)
pnpm --filter @playoff/api dev

# Mobile
cp .env.example apps/mobile/.env     # preencher EXPO_PUBLIC_API_URL e EXPO_PUBLIC_SPOTIFY_CLIENT_ID
pnpm dev
```

> ⚠️ **Segredos:** copie o `.env.example`, nunca comite `.env`. Chaves expostas
> em chat/commits devem ser **rotacionadas** imediatamente nos dashboards da
> OpenAI e do Spotify.

## Telas

`Home` · `Votar` · `Ranking` · `Histórico` · `Perfil` · `Login` · `Atlas AI Curator`

Cada tela tem estados reais de **loading**, **empty** e **error** — nunca
preenche a interface com dados falsos.

## Licença

Projeto / portfólio — uso conforme as políticas das APIs (Spotify, OpenAI).
