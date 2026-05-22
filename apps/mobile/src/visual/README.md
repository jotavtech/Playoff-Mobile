# Visual System

Camada gráfica premium do Playoff. Cada módulo deve ter:

- API tipada
- fallback UI
- `reducedMotion` / `lowEndMode` (via `useSettingsStore`)
- performance budget documentado

## Stack

| Caso | Ferramenta |
|------|------------|
| Gestos, layout, transições | Reanimated (`motion/`) |
| 2D, partículas, shaders 2D | Skia (`skia/`) |
| GLSL custom | expo-gl (`gl/`) |
| Cenas 3D isoladas | three (`three/`) |
| Ambientes, gradientes | `effects/` |

## 5 experiências obrigatórias (PRD)

1. `effects/ambient/PlayerAmbientBackground` — player fullscreen
2. `motion/gestures/ExpandedPlayerGesture` — expansão do player
3. `effects/ambient/RoomStageBackground` — tela de sala
4. `effects/particles/VoteBurst` — feedback de voto
5. `skia/components/PremiumLoader` — loading custom

Implementar incrementalmente; nunca bloquear auth/playback/realtime.
