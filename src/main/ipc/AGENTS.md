# IPC HANDLERS KNOWLEDGE BASE

## OVERVIEW
`src/main/ipc` contains invoke-handler implementations for file/repo/misc/git operations.

## CHANNEL FAMILIES
- File lifecycle: open/create/save/rename/move/read bytes.
- Repo lifecycle: scan/load/save metadata + delete behavior.
- Misc shell/system: reveal in folder, read bundled assets, releases feed.
- Git workspace: status/diff/stage/unstage/pull/commit.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| File create/read/save/rename | `file-operations-effect.ts` | Effect-wrapped filesystem handlers |
| Repo tree/metadata/settings | `repo-operations-effect.ts` | scan/load/save/delete behavior |
| Asset/read-feed/dialog ops | `misc-operations-effect.ts` | read assets + releases atom feed |
| Git status/diff/stage/commit | `git-operations.ts` | spawn + porcelain parsing |

## CONVENTIONS
- Handler signature: `(_event, ...args) => Promise<...>`.
- Effect-based handlers call `Effect.runPromiseExit(...)` and map with `Exit.match(...)`.
- Return stable result shapes (`{ success, error? }` or typed response unions).
- In git handlers, normalize repo path and assert repository before running commands.

## RESPONSE SHAPE EXPECTATIONS
- File/repo/misc handlers should remain predictable for renderer callers.
- Git handlers use discriminated unions (`success: true|false`) with parsed payloads.
- Avoid leaking internal stack traces; return concise user-facing error strings.

## ANTI-PATTERNS
- Registering `ipcMain.handle` inside `ipc/*.ts` (registration belongs in `main.ts`).
- Returning raw child-process errors to renderer without normalization.
- Skipping path normalization/validation before filesystem or git operations.
