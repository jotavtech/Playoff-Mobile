# Playoff — Guia de Demo (apresentação)

Passo a passo para rodar o app **com dados reais**, sem precisar de
credenciais do Spotify ou OpenAI. Tudo roda localmente.

## 1. Pré-requisitos

- Node 20+ e `pnpm` (`corepack enable`)
- PostgreSQL rodando localmente (porta 5432)

## 2. Instalar dependências

```bash
pnpm install
```

## 3. Banco de dados

Crie o banco e configure a conexão:

```bash
createdb playoff   # ou: psql -c "CREATE DATABASE playoff;"
```

Em `apps/api/.env` (copie de `.env.example`):

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/playoff?schema=public
JWT_SECRET=dev-presentation-secret-change-me
# Spotify/OpenAI podem ficar vazios para a demo
```

Sincronize o schema e popule os dados de demonstração:

```bash
pnpm --filter @playoff/api exec prisma db push
pnpm --filter @playoff/api db:seed:demo
```

O seed cria:

- 5 usuários (incl. "Vitor Félix")
- 8 músicas
- 1 rodada **ATIVA** ("Hit do Momento") → tela de Votação
- 1 rodada **FINALIZADA** ("Clássicos Brasileiros") com vencedor → Histórico/Ranking
- votos distribuídos + 3 badges

## 4. Subir a API

```bash
pnpm --filter @playoff/api dev   # http://localhost:3333
curl http://localhost:3333/health   # {"status":"ok"}
```

## 5. Subir o app mobile

Em `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3333
```

> **Device físico:** troque `localhost` pelo IP da sua máquina na rede
> (ex.: `http://192.168.0.10:3333`), senão o celular não acha a API.

```bash
pnpm --filter @playoff/mobile start
# pressione "a" (Android), "i" (iOS) ou "w" (web)
```

## Endpoints úteis para validar

```bash
curl http://localhost:3333/rounds/active     # rodada ativa + músicas
curl http://localhost:3333/rounds            # histórico
curl http://localhost:3333/ranking/global    # ranking global
```

## Observação sobre login

O login real usa Spotify PKCE. Sem credenciais, o fluxo de login não
completa. Para demonstrar telas autenticadas (votar/perfil), gere um JWT de
demo assinado com o `JWT_SECRET` do `.env`, usando o `id` de um usuário do
seed e o payload `{ sub: <userId>, role: "user" }`, e envie no header
`Authorization: Bearer <token>`.
