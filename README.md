# Architecture Oracle

A pnpm-workspace monorepo that hosts three TypeScript apps:

- **Web**: Next.js 14 (App Router) front-end located in `apps/web`
- **Mobile**: Expo-powered React Native client in `apps/mobile`
- **API**: Express-based Node.js backend in `apps/api`

## Prerequisites

- Node.js 20+
- pnpm 9+
- Xcode / Android Studio for React Native native builds (optional for web-only workflows)

## Getting Started

1. Install dependencies once at the repo root:
   ```bash
   pnpm install
   ```
2. Run any target with the provided scripts:
   ```bash
   pnpm dev:web    # Next.js dev server
   pnpm dev:api    # Express API with live reload
   pnpm dev:mobile # Expo dev client
   ```

## Project Layout

```
apps/
  api/      # REST API
  mobile/   # React Native app
  web/      # Next.js web
```

Each app owns its own `package.json`, `tsconfig.json`, and scripts while sharing workspace-level tooling through `tsconfig.base.json` and `pnpm-workspace.yaml`.

## Environment Variables

- `apps/api` reads `.env` values for service configuration (see `apps/api/.env.example`).
- `apps/web` can consume values via Next.js runtime env (`NEXT_PUBLIC_*`).
- `apps/mobile` uses Expo's `app.config.ts` for secrets (none required yet).

## Useful Commands

| Command | Description |
| --- | --- |
| `pnpm dev:web` | Start the Next.js 14 dev server |
| `pnpm dev:api` | Run Express API in watch mode |
| `pnpm dev:mobile` | Launch Expo CLI for the mobile app |
| `pnpm build:web` | Production build for the web app |
| `pnpm build:api` | Compile the Node API |
| `pnpm test` | Run all tests recursively |

## Next Steps

- Connect the web/mobile clients to the API (see `apps/api/src/routes/health.ts` for starter endpoint).
- Add CI workflows for linting, tests, and preview deployments.
- Harden Expo/Next environment handling before shipping secrets.
