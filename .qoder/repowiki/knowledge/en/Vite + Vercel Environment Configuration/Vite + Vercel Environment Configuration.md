---
kind: configuration_system
name: Vite + Vercel Environment Configuration
category: configuration_system
scope:
    - '**'
source_files:
    - vite.config.ts
    - vercel.json
    - .env.local
    - .gitignore
    - package.json
---

## Approach

This is a small Vite + React + TypeScript SPA with no application-level configuration system. Runtime configuration is delegated entirely to the build/runtime platform:

- **Vite** provides the build-time config via `vite.config.ts` and exposes environment variables through `import.meta.env` (no `.env` files are read at runtime).
- **Vercel** supplies deployment-time secrets and environment variables, configured in `vercel.json` and injected as process/environment variables.
- There is no feature-flag library, no YAML/TOML/JSON config loader, and no custom config module in `src/`.

## Key Files

- `vite.config.ts` — minimal Vite config; only registers the React plugin. No env prefixing, no plugins for loading external config.
- `vercel.json` — declares framework (`vite`), build command (`npm run build`), and output directory (`dist`).
- `.env.local` — contains a single `VERCEL_OIDC_TOKEN` value; this file is gitignored.
- `.gitignore` — ignores `.env*`, `.vercel`, `node_modules`, `dist`.
- `package.json` — defines scripts (`dev`, `build`, `preview`, `test:hero`) but no config-related dependencies or scripts beyond invoking Vite.

## Architecture & Conventions

1. **No app-level config module.** The source tree under `src/` contains only UI components (`App.tsx`, `main.tsx`, `EmblemCanvas.tsx`, `NeutronGraphCard.tsx`, `AmbientBackdrop.tsx`) and styles — there is no `config/` directory, no `*.yaml`/`*.toml`/`application.properties`, and no runtime config loader.
2. **Environment variables are consumed directly by Vite/Vercel.** The only env file present is `.env.local`, which holds a Vercel OIDC token used during development builds. It is not committed to version control.
3. **Build-time vs. deploy-time separation.** `vite.config.ts` has no `defineEnvPrefix` or custom env handling, so any `VITE_*` variables would be baked into the bundle at build time. Secrets like `VERCEL_OIDC_TOKEN` stay out of the bundle because they are not prefixed with `VITE_`.
4. **Vercel-centric deployment.** `vercel.json` pins the framework to `vite` and the output directory to `dist`. All other deployment configuration (secrets, environments) is managed in the Vercel dashboard rather than in the repo.
5. **TypeScript-only entry.** `tsconfig.json` and `vite-env.d.ts` exist but contain no config-schema definitions; they only provide type support for the Vite/React toolchain.

## Conventions & Constraints

- `.env*` files are excluded from version control (enforced by `.gitignore`).
- The repository contains no application configuration files (no `config/`, no YAML/TOML/JSON configs); all configuration lives in platform-specific files (`vercel.json`, `.env.local`).
- No runtime configuration loading code exists in `src/`; the app does not read `process.env` or `import.meta.env` directly in the observed source files.