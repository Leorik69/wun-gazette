---
kind: build_system
name: Vite + React Build & Vercel Deployment
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.ts
    - vercel.json
    - tsconfig.json
    - .vercelignore
---

## Build System Overview

The WUN Gazette project is a static single-page application built with **Vite 7** and **React 19**, deployed to **Vercel**. There are no Makefiles, Dockerfiles, shell build scripts, or custom CI pipelines in the repository — the entire build and deployment flow is defined by npm scripts, Vite configuration, TypeScript settings, and Vercel's framework detection.

## Key Files

- `package.json` — declares npm scripts (`dev`, `build`, `preview`, `test:hero`) and all runtime/dev dependencies.
- `vite.config.ts` — minimal Vite config enabling only the React plugin; output defaults to `dist/`.
- `vercel.json` — tells Vercel to use the `vite` framework, run `npm run build`, and serve from `dist`.
- `tsconfig.json` — strict TypeScript config targeting ES2022 with `noEmit: true` (Vite handles emission).
- `.vercelignore` — Vercel-specific ignore list (contents not shown here).
- `index.html` — SPA entry point loaded by Vite.

## Build Pipeline

The build is a two-stage process driven by the `build` script:

1. `tsc --noEmit` — type-checks the code without producing JS output. This catches type errors before bundling.
2. `vite build` — bundles the React app (JSX transformed by `@vitejs/plugin-react`) into static assets under `dist/`.

The `dev` script runs `vite` directly for the development server with HMR. The `preview` script runs `vite preview` to serve the built `dist/` locally. Unit tests for the hero welcome sequence are run via `node --test src/heroWelcome.test.mjs` using Node's built-in test runner.

## Deployment

Deployment is handled entirely by Vercel through `vercel.json`:

- `framework: "vite"` enables Vercel's Vite preset (auto-detection of plugins, optimization settings).
- `buildCommand: "npm run build"` invokes the same script used locally.
- `outputDirectory: "dist"` points Vercel at Vite's default output.

There is no custom CI pipeline file (no `.github/workflows`, no `.circleci`, no `Dockerfile`). Vercel's platform performs the build on push/PR according to this config.

## Conventions and Constraints

- **TypeScript is checked but not emitted**: `tsconfig.json` sets `noEmit: true`; Vite compiles TS/TSX at bundle time. The `build` script enforces type checking first via `tsc --noEmit`.
- **Strict mode enabled**: `strict`, `noUnusedLocals`, and `noUnusedParameters` are all on in `tsconfig.json` — unused variables and parameters are compile errors.
- **Module system**: `package.json` declares `"type": "module"` and `tsconfig.json` uses `"module": "ESNext"` with `"moduleResolution": "bundler"`, matching Vite's ESM-first approach.
- **Target**: compiled output targets ES2022 (`compilerOptions.target`), appropriate for modern browsers served by Vercel.
- **No version pinning in package.json**: dependencies use caret ranges (`^19.2.0`, `^5.9.3`, etc.); exact versions are resolved by `package-lock.json`.
- **No cross-compilation or multi-platform builds**: the project produces a single browser bundle for Vercel's edge/runtime.
- **No containerization**: there is no `Dockerfile` or Docker Compose configuration in the repository.
- **No Makefile or shell-based build automation**: all orchestration goes through npm scripts.