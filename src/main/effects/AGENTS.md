# MAIN EFFECTS KNOWLEDGE BASE

## OVERVIEW
`src/main/effects` provides reusable operational effects for filesystem and HTTP concerns.

## ERROR MODEL
- Filesystem path uses `FileSystemError` and `DialogError` tags.
- HTTP path uses `HttpError` tag.
- Callers should map `Exit` failure branches to stable renderer-safe responses.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Filesystem primitives | `file-system.ts` | read/write/json/repo scan/trash helpers |
| HTTP feed fetch | `http.ts` | releases feed request guardrails |
| Filesystem tests | `file-system.test.ts` | Effect + Exit assertions |
| HTTP tests | `http.test.ts` | host-allowlist validation |

## CONVENTIONS
- Export operational units as `Effect.Effect<...>` with typed custom errors.
- Keep host allowlist and response limits in HTTP effect (`github.com`, 5MB, timeout).
- Use helper composition (`readJsonFile`, `writeJsonFile`, `fileExists`) instead of ad-hoc duplication.
- Add tests in `*.test.ts` alongside effect modules.

## TEST PATTERN
- Run effects with `Effect.runPromiseExit(...)` in tests.
- Assert `Exit.isSuccess`/`Exit.isFailure` explicitly.
- Keep host/path guardrails covered by small deterministic cases.

## ANTI-PATTERNS
- Returning raw promises where project expects `Effect` wrappers.
- Expanding external host access in release-feed logic without explicit reason.
- Adding effect behavior without corresponding tests.
