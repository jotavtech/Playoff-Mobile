# TODO — Atlas Playoff Mobile

Roadmap honesto e priorizado. Itens marcados refletem o estado **real** do repo.
O que já funciona hoje está no `README` (seção _Status_) e no `CHANGELOG`.

## Prioridade alta

- [ ] **Upgrade Skia — `PremiumLoader`**
      Hoje é fallback (`ActivityIndicator`) em
      `apps/mobile/src/visual/skia/components/PremiumLoader.tsx`.
      Substituir por um `Canvas` Skia validado em device.
- [ ] **Upgrade Skia — `PlayerAmbientBackground`**
      Hoje é fallback (`expo-linear-gradient`) em
      `apps/mobile/src/visual/effects/ambient/PlayerAmbientBackground.tsx`.
      Evoluir para fundo ambiente em Skia, respeitando `reducedMotion`/`lowEndMode`.
- [ ] **EAS `projectId`**
      `apps/mobile/app.json` contém o placeholder
      `REPLACE_WITH_EAS_PROJECT_ID`. **Definir o `projectId` real antes de
      qualquer build EAS** — builds falham com o valor placeholder.

## Prioridade média

- [ ] **Aba de busca dedicada**
      Hoje a busca no Spotify acontece dentro do fluxo de criação de rodada.
      Promover para uma aba/tela própria de descoberta.
- [ ] **Testes automatizados**
      Não existe nenhuma suíte de testes ainda (o script `test` só usa
      `--passWithNoTests`/`--if-present`). Começar por:
      utils e serviços de domínio (unit), depois telas-chave.
- [ ] **i18n opcional (EN)**
      O app é todo em **português**. Avaliar internacionalização para inglês
      como camada opcional, sem quebrar a experiência atual.

## Prioridade baixa / melhorias contínuas

- [ ] Ampliar cobertura de acessibilidade (foco, leitores de tela, contraste).
- [ ] Telemetria/observabilidade no backend (logs estruturados, métricas).
- [ ] Documentar mais a fundo `docs/ARCHITECTURE.md` conforme o produto evolui.

## Direção futura (NÃO implementado)

> Ideias de evolução. **Nenhuma destas existe no código hoje** — não confundir
> com features entregues.

- **Salas colaborativas em tempo real** (ex.: Supabase Realtime): votação e
  player sincronizados ao vivo entre participantes. O produto atual é baseado em
  **rodadas de votação** (assíncronas), **não** em salas em tempo real. Esta é
  uma possível evolução, ainda **não** planejada para uma versão específica.
