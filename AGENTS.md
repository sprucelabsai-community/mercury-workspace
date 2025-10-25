# Repository Guidelines

## Project Structure & Module Organization
`packages/mercury-client` owns the TypeScript SDK, and `packages/mercury-event-emitter` holds shared contracts. Anything in `src/.spruce` is generated—regenerate after schema changes rather than editing manually.

## Build, Test, and Development Commands
- `yarn build.dev` compiles TypeScript, copies non-TS assets, and rewrites path aliases for local iteration.
- `yarn build.dist` produces the publishable bundle—run it before release work.
- `yarn watch.build.dev` keeps `build/` synced with `src/` during active changes.
- `yarn test` runs the package Jest suites; rerun after contract tweaks.
- `yarn fix.lint` resolves formatting issues across packages in a single pass.

## Coding Style & Naming Conventions
Keep event-focused modules colocated with their supporting types (see `src/clients`). Prefer descriptive factory names over generic helpers and lean on the existing `MercuryClientFactory` abstraction when adding new connection modes. Generated types under `build/.spruce` should be treated as read-only and refreshed via the build scripts.

## Testing Guidelines
Behaviour-first Jest suites live beneath `src/__tests__/behavioral`; follow that pattern and lean on the existing fake socket utilities. When touching reconnect logic or emit/response flows, add integration-style tests exercising `MercuryTestClient`.

## Commit & Pull Request Guidelines
Commits follow the semantic-release style: `patch: concise summary`, `minor: …`, or automated `chore(release): …`. Keep messages imperative and scoped. Pull requests should explain the change, note affected packages, list verification commands, and link to Mercury issues. Attach screenshots or logs for client-init or networking changes and request review from the owning team.

## Mercury Client Overview
This repo ships the Mercury client SDK for TypeScript that attaches to the Mercury event bus. `MercuryClientFactory` orchestrates websocket connections, contract hydration, and reconnection logic; consumers call `MercuryClientFactory.Client()` with `HOST`, credentials, and optional contract overrides. Skills authenticate with IDs and API keys sourced from theatre configs, so keep local `.env` or blueprint `HOST` values pointed at `http://127.0.0.1:8081` when running the Development Theatre (`yarn boot`). For auth-degraded states or duplicate schema errors, consult `spruce-documentation/src/pages/help/help.md`.

## Documentation & Support
Reference `spruce-documentation/src/pages/concepts/mercury.md` for platform context and event naming. The same repo’s help articles cover common Mercury client failures (auth, offline servers, schema drift); link those resources in PR descriptions when you touch related code paths.
