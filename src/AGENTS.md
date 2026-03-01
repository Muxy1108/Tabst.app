# SRC SUBTREE KNOWLEDGE BASE

## OVERVIEW
`src/` is the runtime boundary between Electron main process code and React/worker renderer code.

## STRUCTURE
```text
src/
├── main/      # Electron process, preload bridge, IPC/effects
└── renderer/  # React UI, worker/LSP, shared stores and libs
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Desktop lifecycle/window | `src/main/main.ts` | BrowserWindow + IPC registration |
| Renderer bridge surface | `src/main/preload.ts` | `contextBridge.exposeInMainWorld` |
| UI/runtime behavior | `src/renderer/` | components, hooks, lib, store |
| Cross-process type contracts | `src/renderer/types/` | imported by `src/main` and preload |

## CONVENTIONS
- Keep Node/Electron-only code in `src/main`; keep UI/browser-only code in `src/renderer`.
- Keep IPC contract names synchronized across `main.ts` registration and `preload.ts` methods.
- Prefer shared type definitions from `src/renderer/types` for IPC payload consistency.

## BOUNDARY CHECKLIST
- New IPC method: add in `main.ts` registration + `preload.ts` bridge + renderer caller typing.
- New shared payload shape: define/update in `src/renderer/types` first.
- New runtime concern: decide owner (`main` vs `renderer`) before implementation.

## ANTI-PATTERNS
- Importing `src/main/*` into renderer code.
- Duplicating IPC payload types in multiple places.
- Mixing direct filesystem/process logic into renderer modules.
