---
kind: error_handling
name: No Application Error Handling — Static Showcase SPA
category: error_handling
scope:
    - '**'
source_files:
    - src/main.tsx
    - src/App.tsx
    - src/heroWelcome.test.mjs
---

## Summary

This repository is a Vite + React + TypeScript static showcase site (WUN Gazette landing page). It contains no application-level error handling: there are no custom error types, no sentinel errors, no `try`/`catch` blocks, no `throw` statements, no `Error` constructors, no middleware, and no global error boundary. The codebase is essentially a presentation shell that renders static content and client-side state.

## Evidence from Source Files

- **`src/main.tsx`** — Bootstraps React via `createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>)`. No `window.onerror`, no `unhandledrejection` handler, no `ErrorBoundary` wrapper.
- **`src/App.tsx`** — A single presentational component composed of pure data arrays (`HERO_SIGNALS`, `FRIEND_QUESTS`, `MODULES_DECK`, `FAQ_SHORT`) and React `useState` hooks for local UI state. There are zero network calls, zero async operations, zero branches that could surface runtime errors, and no `try/catch` or `throw` anywhere in the file.
- **`src/AmbientBackdrop.tsx`**, **`src/EmblemCanvas.tsx`**, **`src/NeutronGraphCard.tsx`** — Canvas/animation components with no error paths observed.
- **`src/station.css`** — Stylesheet only; no error-related CSS classes beyond generic UI states like `.is-checked`, `.is-fired`, `.is-open`.
- **`src/heroWelcome.test.mjs`** — Uses Node `node:test` + `node:assert/strict` to assert on the source text of `App.tsx` and `station.css` (e.g., verifying the hero copy string and reduced-motion media query). This is a content/style assertion test, not an error-path test.

## Conventions Observed

1. **No custom error model.** There is no `errors/` directory, no `Error` subclass definitions, no error-code constants, and no domain-specific exception types.
2. **No try/catch or throw.** A grep across all `.ts`, `.tsx`, and `.mjs` files under `src/` returns zero matches for `try`, `catch`, `throw`, `reject(`, or `Error(`.
3. **No React error boundaries.** Neither `main.tsx` nor `App.tsx` imports or defines an `ErrorBoundary`.
4. **No global unhandled-error listeners.** There is no `window.onerror`, `window.onunhandledrejection`, or equivalent setup.
5. **Failure mode is implicit:** because the app performs no side effects, failures would surface as uncaught JavaScript exceptions during render or event handlers, which React would propagate up to the browser's default error reporting path.
6. **Tests validate content, not failure paths.** The only test file asserts that certain strings exist (or do not exist) in the compiled source/CSS; it does not exercise error conditions.

## Architectural Decision

The absence of error handling is consistent with the project's scope: a marketing/showcase SPA whose purpose is to display static narrative content and demonstrate UI animations. All user actions (sign-in, sign-up, constitution, privacy, terms) are plain `<a>` links navigating to external URLs (`getwun.app/auth/en`, `/privacy`, `/terms`). There is no API layer, no form submission, and no data-fetching code that would require error propagation or presentation.

## Applicable Scope

This category applies only descriptively — the repository has no error-handling system to document. The correct finding is that error handling is absent by design.