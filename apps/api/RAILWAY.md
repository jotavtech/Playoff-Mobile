# Deploy do Atlas Playoff API no Railway

O backend (`apps/api`) é **self-contained** (não depende dos pacotes `@playoff/*`),
então roda no Railway apontando a raiz do serviço para `apps/api`.

## Passo a passo (uma vez)

1. **Crie o projeto**
   - https://railway.app → **New Project** → **Deploy from GitHub repo** → `jotavtech/Playoff-Mobile`.

2. **Adicione o banco**
   - No projeto: **+ New** → **Database** → **PostgreSQL**.
   - O Railway cria a variável `DATABASE_URL` e a injeta automaticamente no serviço.

3. **Configure o serviço da API**
   - Abra o serviço criado a partir do repo → **Settings**:
     - **Root Directory:** `apps/api`
     - **Build/Start:** já vêm do `apps/api/railway.json` (build via Nixpacks, start = `npm run start:railway`, que roda `prisma migrate deploy` antes de subir).
     - **Healthcheck:** `/health` (já configurado).

4. **Variáveis de ambiente** (aba **Variables** do serviço da API)

   ```
   NODE_ENV=production
   JWT_SECRET=<uma-string-longa-aleatoria>
   JWT_EXPIRES_IN=30d
   SPOTIFY_CLIENT_ID=<seu-client-id>
   SPOTIFY_CLIENT_SECRET=<seu-client-secret-ROTACIONADO>
   SPOTIFY_REDIRECT_URI=playoff://auth/callback
   MOBILE_REDIRECT_URI=playoff://auth/callback
   OPENAI_API_KEY=<sua-chave-ROTACIONADA>
   OPENAI_MODEL=gpt-4o-mini
   ```

   > `DATABASE_URL` e `PORT` o Railway injeta sozinho — **não** defina manualmente.
   > `APP_BASE_URL` é opcional; se quiser, use a URL pública do serviço.

5. **Gere o domínio público**
   - Service → **Settings** → **Networking** → **Generate Domain**.
   - Vai sair algo como `https://atlas-playoff-api-production.up.railway.app`.

6. **Teste**
   ```
   GET https://SEU-DOMINIO.up.railway.app/health   → {"status":"ok"}
   ```

## Ligar o app mobile à API do Railway

No `apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://SEU-DOMINIO.up.railway.app
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=<seu-client-id>
EXPO_PUBLIC_SPOTIFY_REDIRECT_URI=playoff://auth/callback
```

Reinicie o Expo com cache limpo: `npx expo start -c`.

## Popular dados de demonstração (opcional)

Para criar badges + uma rodada ativa com músicas reais do Spotify, rode uma vez
(local, apontando `DATABASE_URL` para o Postgres do Railway):

```
DATABASE_URL="<url-do-railway>" pnpm --filter @playoff/api db:seed
```

Sem isso, o app mostra os **empty states** reais (nenhuma rodada ativa) — que é o
comportamento correto, não dados falsos.
