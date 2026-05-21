# Rakshex — PART 1 Complete ✅

All tasks from "PART 1: Rename + Backend Security + OpenRouter" are done.

---

## TASK 1 — Global rename devpulse → rakshex ✅

- **Script:** `scripts/rename_to_rakshex.ps1`
- **380 files** updated in one pass:
  - `devpulse` → `rakshex` (lowercase)
  - `DevPulse` → `Rakshex` (PascalCase)
  - `DEVPULSE` → `RAKSHEX` (UPPER)
  - `devpulse.in` → `rakshex.in` (domain)
  - `@devpulsehq` → `@rakshexhq` (social handle)
- **Excluded:** `node_modules`, `.git`, `pnpm-lock.yaml`, `package-lock.json`
- **Commits:** `rename+fix(part1): TASK-1 global rename devpulse→rakshex across 380 files`

---

## TASK 2 — Manual file edits (8 files) ✅

Files verified / fixed manually:

| File                                        | Change                                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `devpulse-vscode/package.json`              | `name`, `publisher`, `repository.url`, `bugs.url`, `homepage` → rakshex |
| `package.json`                              | `name: rakshex` (done by script)                                        |
| `devpulse-frontend/package.json`            | `name: rakshex-frontend` (done by script)                               |
| `render.yaml`                               | `rakshex-backend`, `rakshex-redis` (done by script)                     |
| `server/_core/env.ts`                       | `SMTP_FROM: noreply@rakshex.in` (done by script)                        |
| `server/_core/index.ts`                     | CORS allowlist `rakshex.in` (done by script)                            |
| `devpulse-vscode/MARKETPLACE_README.md`     | GitHub URLs → `rakshex/rakshex`                                         |
| `devpulse-vscode/README.md`                 | GitHub Issues URL → `rakshex/rakshex`                                   |
| `devpulse-vscode/PUBLISHING.md`             | Screenshot URL → `rakshex/rakshex`                                      |
| `devpulse-vscode/src/welcomeView.ts`        | Docs URL → `rakshex.in`                                                 |
| `.github/ISSUE_TEMPLATE/bug_report.md`      | `Rakshex` branding                                                      |
| `.github/ISSUE_TEMPLATE/feature_request.md` | `Rakshex` branding                                                      |

---

## TASK 3 — Create fly.toml ✅

- **File:** `fly.toml`
- App name: `rakshex-backend`
- Region: `sin` (Singapore — nearest to India)
- Build: `Dockerfile.prod`
- Port: `8080`, HTTPS forced
- VM: 512MB / 1 shared CPU

---

## TASK 4 — OpenRouter provider ✅

- **File:** `server/services/openrouterProvider.ts`
- Implements `LLMProvider` interface (same as `anthropicProvider`)
- Default model: `deepseek/deepseek-chat-v3-0324:free` ($0 cost)
- Free models list: DeepSeek, Llama-3.3-70B, Gemma-3-27B, Mistral-7B, DeepSeek-R1
- Required headers: `Authorization`, `HTTP-Referer: https://rakshex.in`, `X-Title: Rakshex`
- Registered in `server/_core/providers.ts` as last optional provider (free fallback)
- When no other provider resolves, OpenRouter is preferred over MiniMax
- `OPENROUTER_API_KEY` + `OPENROUTER_DEFAULT_MODEL` added to Zod env schema

---

## TASK 5 — Fix WebSocket JWT expiry ✅

- **File:** `server/utils/security.ts` → `verifyWebSocketAuth()`
- Added **session expiry check**: if `session.expiresAt < now`, deletes session row and returns `null`
- Added **account lock check**: if `user.lockedUntil > now`, returns `null`
- Expired sessions are cleaned up immediately from DB on detection

---

## TASK 6 — Persist security events to DB ✅

- **`server/db.ts`:** Added `insertSecurityEvents(rows[])` — batch inserts up to 100 rows per round-trip
- **`server/services/securityEvents.ts`:**
  - `flushSecurityEvents()` — drains in-memory buffer → DB (with re-buffer on error)
  - `startSecurityEventsFlusher()` — 30-second `setInterval` flush
  - `flushSecurityEventsOnShutdown()` — stops interval + final flush
  - Maps internal event types (`auth_failure`, `rate_limit_hit`, etc.) to DB enum values
  - Maps severity from event type (`rce_command_blocked` → `critical`, etc.)
- **`server/_core/index.ts`:** Calls `startSecurityEventsFlusher()` on startup and `flushSecurityEventsOnShutdown()` in SIGTERM handler

---

## TASK 7 — Pagination on all list endpoints ✅

Cursor-based pagination (`cursor`, `limit`, `nextCursor`) added to:

| Router              | Procedure     | Before             | After                                        |
| ------------------- | ------------- | ------------------ | -------------------------------------------- |
| `collectionsRouter` | `list`        | page/pageSize only | + `cursor`, `limit`, `items[]`, `nextCursor` |
| `alertsRouter`      | `listRules`   | no input           | + `cursor`, `limit`, `items[]`, `nextCursor` |
| `auditRouter`       | `listEntries` | limit/offset only  | + `cursor`, `items[]`, `nextCursor`          |

All changes are **backwards-compatible** — legacy `entries`/`collections` response fields are preserved.

---

## TASK 8 — Replace console.log with logger ✅

- Searched all `server/**/*.ts` for `console.log`, `console.warn`, `console.error`
- **Only 6 matches** found — all in `server/_core/env.ts` bootstrap (pre-logger IIFE)
- These are **intentionally kept** as `console.*` — `env.ts` runs before the logger is initialized (circular import would break startup). No other server files use `console.*`.

---

## Verification

```
grep DevPulse|devpulse|DEVPULSE (*.ts *.tsx *.json *.md) excluding lock files → 0 matches in source files
fly.toml exists ✓
server/services/openrouterProvider.ts exists ✓
verifyWebSocketAuth has expiresAt + lockedUntil checks ✓
insertSecurityEvents + flushSecurityEventsFlusher wired ✓
collections.list + alerts.listRules + audit.listEntries have nextCursor ✓
console.* in server/ → only env.ts bootstrap (6 lines, intentional) ✓
```

---

## Commits

| Commit                          | Hash      | Description                                       |
| ------------------------------- | --------- | ------------------------------------------------- |
| `rename+fix(part1): TASK-1`     | `f979275` | Global rename 380 files                           |
| `rename+fix(part1): TASK-2,3,4` | `8697352` | Manual edits + fly.toml + OpenRouter              |
| `fix(part1): TASK-5,6,7,8`      | `63229b4` | WS JWT, security flush, pagination, console audit |

---

## Notes

- Patent numbers (`NHCE/DEV/2026/001–004`) untouched ✓
- Physical folder names (`devpulse-frontend/`, `devpulse-vscode/`) untouched ✓
- `package-lock.json` files excluded from rename (npm auto-manages) ✓
- `console.*` in `env.ts` is a valid exception — logger hasn't loaded yet at that point
