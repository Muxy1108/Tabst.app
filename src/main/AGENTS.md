# MAIN PROCESS KNOWLEDGE BASE

## OVERVIEW
`src/main` orchestrates Electron lifecycle, preload bridge, IPC channel registration, updater flow, and repo file-watch lifecycle.

## STRUCTURE
```text
src/main/
├── main.ts        # app lifecycle + channel registration
├── preload.ts     # renderer bridge API
├── autoUpdater.ts # Windows packaged update path
├── ipc/           # invoke handler implementations
└── effects/       # reusable Effect-based file/http operations
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| App/window lifecycle | `main.ts` | creates BrowserWindow, dev/prod loading |
| IPC channel map | `main.ts` | source of truth for `ipcMain.handle(...)` wiring |
| Renderer API surface | `preload.ts` | whitelisted `window.electronAPI` methods |
| Update flow | `autoUpdater.ts` | Windows packaged builds only |
| Handler implementations | `ipc/*.ts` | thin request/response layer |
| Effect logic | `effects/*.ts` | file/http operational primitives |

## CONVENTIONS
- Keep `ipcMain.handle` registration in `main.ts`; handler modules export functions only.
- `preload.ts` must expose safe, explicit APIs via `contextBridge`.
- Repo watchers are keyed by `webContentsId` and must be cleaned on sender destroy/quit.
- Auto-update is guarded by platform/package checks and `app-update.yml` presence.

## HARD BOUNDARIES
- `main.ts`: orchestration only; avoid embedding large operational logic.
- `preload.ts`: bridge-only; no direct filesystem/network business logic.
- `ipc/*`: argument validation + result shaping; delegate operations.
- `effects/*`: reusable operational primitives.

## ANTI-PATTERNS
- Business logic stuffed directly into `main.ts`.
- Turning on `nodeIntegration` or disabling `contextIsolation`.
- Leaving FS watchers alive across window teardown.
- Diverging IPC channel names between `main.ts` and `preload.ts`.
