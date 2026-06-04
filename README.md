# Atlas Playoff Mobile

> Experiência musical inteligente: curadoria, **rodadas de votação** e descoberta
> de música com faixas reais do Spotify e IA via OpenAI — dentro do ecossistema **Atlas**.

Não é um wrapper do Spotify. É um app de **playoffs musicais**: cada rodada coloca
músicas para competir, a galera vota, e a IA (Atlas AI Curator) ajuda a montar
rodadas, descrever resultados e sugerir faixas. Em produção, nada é mockado —
tudo vem do backend Atlas, do Spotify e do banco. Para apresentações existe um
**modo demo offline** com dados embutidos (sem backend nenhum).

---

## Ecossistema Atlas

O **Playoff** é um produto do ecossistema **Atlas**. O app mobile é apenas a
camada de interface: ele conversa **exclusivamente** com o **Atlas Backend**, que
centraliza integrações sensíveis (Spotify, OpenAI) e a persistência (PostgreSQL).
Isso mantém os segredos fora do dispositivo e do bundle público.

## Stack

- **Mobile (`apps/mobile`):** Expo 56 · React Native 0.85 · Expo Router · NativeWind v4 · Reanimated · Skia · Expo AV
- **State:** Zustand (UI/efêmero) · TanStack Query (server state)
- **Backend (`apps/api`):** Node 20+ · Express · TypeScript · Prisma · PostgreSQL
- **Auth:** Spotify Authorization Code + **PKCE** (troca de token feita no backend)
- **IA:** OpenAI (Atlas AI Curator) — **somente** via backend
- **Tooling:** pnpm workspaces · ESLint 9 · Prettier · Husky + lint-staged

## Arquitetura segura

```
                         ┌───────────────────►  PostgreSQL (Prisma)
                         │
App Mobile (Expo)  ──►  Atlas Backend API  ──►  Spotify Web API
   EXPO_PUBLIC_* só          │
                             └────────────────►  OpenAI API
```

O app mobile **nunca** chama Spotify/OpenAI direto e **nunca** guarda o
`SPOTIFY_CLIENT_SECRET` nem a `OPENAI_API_KEY`. Esses segredos vivem apenas no
backend (`apps/api/.env`, fora do git). O mobile só consome a API do Atlas e usa
o `EXPO_PUBLIC_SPOTIFY_CLIENT_ID` (valor público) para iniciar o login PKCE.

---

## Demo rápida (sem backend)

Roda o app **inteiro com dados embutidos**: sem PostgreSQL, sem API, sem Spotify.
Ideal para apresentar na web em segundos. As telas (Votar, Ranking, Histórico,
Perfil) já vêm cheias e o login fica automático.

```bash
pnpm install
echo "EXPO_PUBLIC_DEMO_MODE=true" > apps/mobile/.env
pnpm --filter @playoff/mobile web   # ou: pnpm dev  →  aperte "w"
```

Quando aparecer `Web is waiting on http://localhost:8081`, abra o link (ou aperte
`w`). Passo a passo completo (Windows/macOS/Linux) em [`DEMO.md`](./DEMO.md).

> Para voltar ao modo real, use `EXPO_PUBLIC_DEMO_MODE=false` e siga abaixo.

## Modo completo (Postgres + API + mobile)

Requisitos: **Node 20+**, **pnpm 9+**, **PostgreSQL**.

```bash
pnpm install

# 1) Backend
cp .env.example apps/api/.env        # preencher DATABASE_URL, JWT_SECRET (Spotify/OpenAI opcionais p/ demo)
pnpm --filter @playoff/api exec prisma db push   # sincroniza o schema
pnpm --filter @playoff/api db:seed:demo          # popula rodadas/músicas/votos de demonstração
pnpm --filter @playoff/api dev                   # http://localhost:3333  →  GET /health = {"status":"ok"}

# 2) Mobile
cp .env.example apps/mobile/.env     # preencher EXPO_PUBLIC_API_URL e EXPO_PUBLIC_SPOTIFY_CLIENT_ID
pnpm dev                             # aperte "a" (Android), "i" (iOS) ou "w" (web)
```

Detalhes (criação do banco, JWT de demo para telas autenticadas, device físico)
estão em [`DEMO.md`](./DEMO.md).

---

## Scripts

Executados na **raiz** do monorepo:

| Script              | O que faz                                            |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Inicia o Expo (`@playoff/mobile start`)              |
| `pnpm android`      | Expo no Android                                      |
| `pnpm ios`          | Expo no iOS                                          |
| `pnpm web`          | Expo na web                                          |
| `pnpm lint`         | ESLint em todos os pacotes (`-r`)                    |
| `pnpm typecheck`    | TypeScript (`tsc --noEmit`) em todos os pacotes      |
| `pnpm format`       | Prettier (escreve) em `**/*.{ts,tsx,js,jsx,json,md}` |
| `pnpm format:check` | Prettier em modo verificação                         |
| `pnpm test`         | Roda `test` nos pacotes que tiverem (`--if-present`) |

Específicos do backend (`apps/api`), via `pnpm --filter @playoff/api <script>`:

| Script            | O que faz                                      |
| ----------------- | ---------------------------------------------- |
| `dev`             | API em watch (`tsx watch src/server.ts`)       |
| `build`           | `prisma generate` + `tsc`                      |
| `start`           | Roda o build (`node dist/server.js`)           |
| `start:railway`   | `prisma migrate deploy` + start (deploy)       |
| `typecheck`       | `prisma generate` + `tsc --noEmit`             |
| `prisma:generate` | Gera o Prisma Client                           |
| `prisma:migrate`  | `prisma migrate dev`                           |
| `db:seed`         | Seed completo (precisa de credenciais Spotify) |
| `db:seed:demo`    | Seed de demonstração **sem Spotify**           |
| `lint`            | ESLint em `src` e `prisma`                     |

## Estrutura

```
apps/
  mobile/                  # App Expo (interface, auth, navegação, consumo da API)
    src/app/                # Expo Router — tabs, login, atlas, cinematic, result, ai-curator
    src/components/         # atlas/ · playoff/ · ai/ · ui/ · navigation/
    src/services/           # cliente HTTP + serviços de domínio + demo-data (fixtures offline)
    src/hooks/              # React Query + auth + preview player
    src/store/              # Zustand (auth, settings)
    src/visual/             # camada visual (Skia/efeitos) — alguns fallback-first
    src/theme/              # design tokens
  api/                     # Backend seguro (Spotify + OpenAI + Prisma)
    src/modules/            # auth · spotify · rounds · votes · ranking · profile · ai
    prisma/                 # schema + demo-seed
packages/
  ui/ types/ config/ utils/ services/
docs/                      # ARCHITECTURE.md · ENV.md · ROADMAP.md
```

### Telas

`Home` · `Votar` · `Ranking` · `Histórico` · `Perfil` (tabs) · `Login` ·
`Atlas (sobre)` · `Criar rodada` · `Resultado` · `Cinematic` · `Atlas AI Curator`.

Cada tela tem estados reais de **loading**, **empty** e **error** — fora do modo
demo, nunca preenche a interface com dados falsos.

### Backend — endpoints

```
GET  /health
POST /auth/spotify/exchange     GET  /auth/me
GET  /spotify/search            GET  /spotify/tracks/:id
GET/POST /rounds  ·  GET /rounds/:id  ·  POST /rounds/:id/{vote,start,finish}
GET  /ranking/*                 GET/PATCH /me/*
POST /ai/{curator,round-suggestion,round-description,result-insight,share-caption}
```

---

## Status

O que **funciona hoje**:

- ✅ `pnpm typecheck` e `pnpm lint` verdes (mobile + backend + packages)
- ✅ Bundle **web** compila e roda (`output: "single"` / SPA)
- ✅ Backend real: busca no **Spotify** e **Atlas AI Curator** (OpenAI) via API
- ✅ Rodadas de votação: criar, votar, iniciar/finalizar, ranking e histórico
- ✅ Login Spotify **PKCE** (troca de token no backend) + "continuar como convidado"
- ✅ **Modo demo offline** (`EXPO_PUBLIC_DEMO_MODE=true`) com fixtures embutidos

Limitações conhecidas:

- ⚠️ `PremiumLoader` e `PlayerAmbientBackground` ainda são **fallback** (ActivityIndicator /
  LinearGradient); o upgrade para Skia está no roadmap.
- ⚠️ Não há testes automatizados ainda.
- ⚠️ EAS `projectId` é placeholder em `apps/mobile/app.json` — ajustar antes de builds EAS.

### Roadmap (resumo)

- Upgrade Skia de `PremiumLoader` e `PlayerAmbientBackground`
- Aba de busca dedicada
- Suíte de testes automatizados
- i18n opcional (EN)

Detalhes e a "direção futura" (rooms colaborativas em tempo real — **ainda não
implementadas**) estão em [`TODO.md`](./TODO.md) e [`docs/ROADMAP.md`](./docs/ROADMAP.md).
O histórico de mudanças fica em [`CHANGELOG.md`](./CHANGELOG.md).

---

## Segurança

- Copie sempre o `.env.example`; **nunca** comite `.env`.
- Segredos (`SPOTIFY_CLIENT_SECRET`, `OPENAI_API_KEY`, `JWT_SECRET`) ficam **só** no
  backend. No mobile, somente variáveis `EXPO_PUBLIC_*` (públicas).
- Qualquer chave exposta em chat/commit deve ser **rotacionada imediatamente** nos
  dashboards da OpenAI e do Spotify.

## Créditos

Produto do ecossistema **Atlas**. Uso conforme as políticas das APIs (Spotify, OpenAI).
Veja [`LICENSE`](./apps/mobile/LICENSE).
