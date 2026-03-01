# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-01 08:59:30 +0800
**Commit:** 1633883
**Branch:** dev

## OVERVIEW
Tabst is an Electron desktop app for writing and playing AlphaTex guitar tabs.
Runtime is split across Electron main (`src/main`), React renderer (`src/renderer`), and a worker-based AlphaTex LSP pipeline.

## STRUCTURE
```text
Tabst.app/
├── src/                     # product runtime code
│   ├── main/                # Electron main, preload bridge, IPC handlers
│   └── renderer/            # React UI, alphaTab integration, worker/LSP
├── scripts/                 # codemix, baseline/stress, vendor sync tooling
├── docs/dev/                # active engineering docs (alphatab/alphatex/ops)
├── .github/workflows/       # CI, release, mac release, pages deploy
├── public/assets/           # Bravura, soundfont, alphaTab runtime assets
└── .tmp/notebook-navigator/ # unrelated sandbox project (exclude from product work)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| App boot and IPC wiring | `src/main/main.ts` | registers lifecycle + IPC channels |
| Renderer bootstrap | `src/renderer/main.tsx` | mounts App + i18n + ThemeProvider |
| Shared app state | `src/renderer/store/appStore.ts` | highest fan-in module in renderer |
| Theme logic | `src/renderer/lib/theme-system/`, `src/renderer/store/themeStore.ts` | CSS variables + persisted preferences |
| AlphaTex parsing/positions | `src/renderer/lib/alphatex-parse-positions.ts` | AST-first parser with fallback path |
| Completion and hover | `src/renderer/lib/alphatex-completion.ts`, `src/renderer/workers/alphatex.worker.ts` | local command JSON first, upstream fallback |
| Preview lifecycle | `src/renderer/components/Preview.tsx`, `src/renderer/hooks/usePreview*` | API init/destroy/reinit and telemetry |
| Print pipeline | `src/renderer/components/PrintPreview.tsx` | dedicated API instance + print CSS/font rules |
| Git integration | `src/main/ipc/git-operations.ts`, `src/renderer/components/GitWorkspace.tsx` | porcelain parse + unified diff display |

## CONVENTIONS
- Formatter/linter is **Biome** (`biome.json`): tab indentation, double quotes, organize imports enabled.
- Package manager is **pnpm** (`packageManager: pnpm@10.28.0`).
- Shared playback/file/selection/UI state belongs in Zustand (`useAppStore`), not scattered component state.
- Deep alphaTab config changes (theme/colors) require API destroy + recreate; `render()` alone is insufficient.
- Completion/hover source precedence: `src/renderer/data/alphatex-commands.json` first, upstream docs second.
- Main-process I/O wrappers follow `Effect` + `Exit.match` patterns.

## ANTI-PATTERNS (THIS PROJECT)
- Parsing AlphaTex structure with regex when AST parser is available.
- Storing `AlphaTabApi` in React state.
- Theme switching without track-config save/restore around API rebuild.
- Changing print rendering without preserving `.at` font-size `34px` and absolute Bravura URL loading.
- Registering IPC handlers outside `src/main/main.ts`.
- Treating `.tmp/notebook-navigator` as part of Tabst runtime.

## UNIQUE STYLES
- Interaction zoning: top/left for navigation context; bottom/right for command actions.
- Global bottom bar is right-aligned with strict cascade: staff → display → playback params → transport.
- Dual packaging model: Electron Forge (`package`/`make`) plus electron-builder (`dist`, Windows artifacts).
- Ops docs are weekly/report style under `docs/dev/ops/`.

## COMMANDS
```bash
pnpm dev
pnpm format
pnpm check
pnpm build
pnpm package
pnpm make
pnpm dist:win
npx vitest src/main/effects/*.test.ts
pnpm mix
pnpm mix:main
pnpm mix:render
pnpm mix:doc
pnpm mix:config
```

## NOTES
- CI/release workflows: `.github/workflows/{ci,release,release-mac,website-pages}.yml`.
- Current tests are concentrated in `src/main/effects/*.test.ts`.
- Read nearest child `AGENTS.md` before editing deeper directories.
