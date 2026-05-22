# Variáveis de ambiente

Arquivo: `apps/mobile/.env` (não commitar).

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `EXPO_PUBLIC_APP_ENV` | Não | `development` \| `staging` \| `production` |
| `EXPO_PUBLIC_SUPABASE_URL` | Sim (Phase 3+) | `https://syiuzmnsqxhiilikhwmw.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Sim (Phase 3+) | Dashboard → Settings → API → `anon` `public` |
| `DATABASE_URL` | CLI/migrations | Session Pooler se rede IPv4; ver Connect no dashboard |
| `EXPO_PUBLIC_SPOTIFY_CLIENT_ID` | Sim (Phase 3) | Client ID Spotify |
| `EXPO_PUBLIC_SPOTIFY_REDIRECT_URI` | Sim | Default: `playoff://auth/callback` |
| `EXPO_PUBLIC_SENTRY_DSN` | Não | Phase 6 |

## Secrets (servidor apenas)

Nunca usar prefixo `EXPO_PUBLIC_`:

- `SPOTIFY_CLIENT_SECRET` → Supabase Edge Function
- `SUPABASE_SERVICE_ROLE_KEY` → Edge Functions / CI apenas

## Spotify Dashboard

Redirect URIs:

- `playoff://auth/callback`
- Expo dev: seguir doc do `expo-auth-session` para tunnel/local
