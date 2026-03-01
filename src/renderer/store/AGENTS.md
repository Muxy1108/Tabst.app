# RENDERER STORE KNOWLEDGE BASE

## OVERVIEW
`src/renderer/store` is the single source of truth for workspace state (`appStore.ts`) and theme preference state (`themeStore.ts`).

## STATE OWNERSHIP MAP
- `appStore.ts`: repo/file tree, active file, editor/preview sync, playback state, command pin/MRU, tutorial/settings mode state.
- `themeStore.ts`: UI theme, editor theme, effective light/dark mode resolution.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Workspace/file/playback state | `appStore.ts` | repos, file tree, cursor/selection, transport controls |
| Theme preference state | `themeStore.ts` | UI/editor theme ids + light/dark/system mode |
| Persisted settings path | `../lib/global-settings.ts` | writes to `~/.tabst/settings.json` |

## CONVENTIONS
- `appStore` is authoritative for workspace mode and playback/session state.
- `themeStore` persists via global settings helpers (not localStorage).
- Keep store actions explicit and typed; prefer selectors in components.
- Preserve sanitization helpers for templates/shortcuts when touching related fields.

## PERSISTENCE RULES
- Theme/preferences persist via `loadGlobalSettings` / `saveGlobalSettings`.
- Repo/workspace metadata persists through main-process IPC + filesystem effects.
- Avoid introducing new persistence backends for existing store domains.

## ANTI-PATTERNS
- Creating duplicate sources-of-truth for state already in stores.
- Writing theme preferences directly to browser storage.
- Mutating nested store data outside controlled updater paths.
