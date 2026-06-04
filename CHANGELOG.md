# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado

- Tela **Atlas / Sobre** (`/atlas`) apresentando o ecossistema Atlas e o produto.
- Modo **Cinematic** (`/cinematic/[id]`) para visualização imersiva de resultados.
- **ESLint no backend** (`apps/api`): config flat (`eslint.config.js`) + script `lint`
  cobrindo `src` e `prisma`.
- Persistência de **preferências do usuário** (settings) no app.

### Alterado

- Melhorias de **acessibilidade** nas telas e componentes (roles, labels).
- **Documentação** revisada: `README`, `DEMO`, `CHANGELOG` e `TODO` na raiz.
- **Polish de acentuação** e textos em português em toda a interface.

## [0.1.0] — 2026-06-04

Primeira base funcional do Atlas Playoff Mobile (pré-release de scaffolding e produto).

### Adicionado

- **Scaffold do monorepo** pnpm (`apps/mobile`, `apps/api`, `packages/*`).
- Transformação em **produto real**: backend Atlas com integração **Spotify** e
  **OpenAI (Atlas AI Curator)**, persistência via **Prisma/PostgreSQL**.
- **Criação manual de rodadas** com busca no Spotify e **tela de resultado**.
- **Modo demo offline** (`EXPO_PUBLIC_DEMO_MODE`) servindo fixtures embutidos —
  sem backend, Postgres ou Spotify.
- **Seed de demonstração sem Spotify** (`db:seed:demo`) e guia de apresentação (`DEMO.md`).
- Fundação visual do Playoff e refinamento da estética _technical noir_.
- Configuração de **deploy no Railway** para o backend.

### Corrigido

- NativeWind: `darkMode: 'class'` para evitar crash de `color-scheme`.
- Web: `output: "single"` (SPA) removendo o caminho de crash de SSR estático.
- Fallback defensivo para `palette.black` em caminhos críticos de render.
- Dependência de runtime do NativeWind no mobile.
- CI: `prisma generate` no backend e `expo-doctor` verde; lockfile do pnpm no Railway.

[Unreleased]: https://github.com/jotavtech/Playoff-Mobile/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jotavtech/Playoff-Mobile/releases/tag/v0.1.0
