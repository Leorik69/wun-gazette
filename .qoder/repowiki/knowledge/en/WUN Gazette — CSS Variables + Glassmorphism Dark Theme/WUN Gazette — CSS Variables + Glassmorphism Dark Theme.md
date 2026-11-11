---
kind: frontend_style
name: WUN Gazette — CSS Variables + Glassmorphism Dark Theme
category: frontend_style
scope:
    - '**'
source_files:
    - src/station.css
    - index.html
    - package.json
---

## Approach

The WUN Gazette frontend uses a **single global stylesheet** (`src/station.css`, ~2250 lines) loaded alongside React components. There is no CSS-in-JS, no Tailwind, no component-scoped CSS modules, and no design-token library. Styling is plain CSS organized around a `:root` design-token layer plus BEM-like class names.

Fonts are loaded via Google Fonts in `index.html`:
- Display: `Fraunces` (serif, italic+opsz support)
- Sans: `Outfit`

The only third-party visual dependency beyond React/Three.js is `lucide-react` for icons.

## Design Tokens (`:root`)

All colors, radii, and fonts are centralized at the top of `station.css`:

- Backgrounds: `--bg-0` (#07080d), `--bg-1`, `--bg-2`, `--surface` (rgba(19,24,38,0.76)), `--surface-strong` (rgba(25,31,49,0.92))
- Borders: `--border` (rgba(255,255,255,0.09)), `--border-strong` (rgba(141,120,255,0.42))
- Text: `--text-primary` (#f5f3ec), `--text-secondary` (#a2a9bd), `--text-muted` (#6e768c)
- Accents: `--accent-violet` (#8c78ff), `--accent-gold` (#e6b85c), `--accent-cyan` (#58b9ff)
- Radii: `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px)
- Fonts: `--font-display` ("Fraunces", Georgia, serif), `--font-sans` ("Outfit", system stack)
- `color-scheme: dark` is set globally.

## Visual Style

- **Dark theme only** — no light-mode overrides exist.
- **Glassmorphism / frosted glass**: repeated use of `backdrop-filter: blur(16px)` with semi-transparent backgrounds on `.copy-card`, `.topbar`, `.spotlighter-header`, `.pioneer-pass-card`, `.path-preview-card`, etc.
- **Aurora backdrop**: three large blurred radial-gradient orbs (`.aurora-orb-1/2/3`) animate via `@keyframes auroraDrift` behind all content.
- **Starfield background**: a dot-grid `background-image` on `.showcase-page`.
- **Hero shimmer**: gradient text via `-webkit-background-clip: text` with animated `background-position` on `.hero-title-word`.
- **Heavy animation palette**: word-reveal, light-beam sweep, signal-pulse rings, orbit-draw, star pulse, splash-letter fade — all defined as `@keyframes` in the same file.
- **Accessibility**: `prefers-reduced-motion: reduce` media queries disable animations for hero title words, aurora orbs, and orbit rings; `:focus-visible` gets a violet outline.

## Layout System

- A single `.container` class constrains width to `min(1240px, calc(100% - 48px))` and centers it.
- **Bento grid**: `.bento-grid` is a 12-column CSS Grid; span helpers `.bento-span-4`, `.bento-span-5`, `.bento-span-7` are used throughout.
- Section layouts use explicit `grid-template-columns` ratios (e.g., `.hero-grid` = `1.08fr 0.92fr`, `.allies-grid` = `1.05fr 0.95fr`).
- Responsive sizing relies on `clamp()` for font sizes and paddings rather than breakpoints.
- No dedicated responsive breakpoint rules were observed beyond `prefers-reduced-motion`.

## Component-style Classes

Classes follow a flat, descriptive naming scheme (no BEM nesting, no CSS modules):
- Buttons: `.btn-primary-sm/md/lg`, `.btn-secondary-lg`, `.btn-ghost-sm`
- Cards: `.copy-card`, `.bento-card`, `.wun-splash-card`, `.pioneer-pass-card`, `.neutron-card`
- Pills/tabs: `.room-pill`, `.preset-btn`, `.sector-node`, `.node-pill`, `.role-pill`, `.chat-tab`, `.mini-chip`, `.ballot-btn`, `.endorse-btn`, `.module-ping-btn`, `.quest-item`
- Mini UI widgets: `.mini-wallet-*`, `.mini-market`, `.mini-chat`, `.mini-ui`
- Sections: `.bento-section`, `.path-section`, `.faq-section`, `.allies-section`
- Splash/emblem: `.wun-splash-*`, `.wun-orbit-*`, `.emblem-*`

State is expressed via modifier classes toggled by React state: `.is-active`, `.is-checked`, `.is-selected`, `.is-on`, `.is-fired`.

## Conventions Observed

1. All semantic colors/radii/fonts go through CSS custom properties on `:root`; hard-coded color literals appear only inside keyframes or gradients that need specific values.
2. Glass panels consistently combine `backdrop-filter: blur(16px)` with a semi-transparent `rgba(...)` background and a thin `rgba(255,255,255,0.12)` border.
3. Interactive elements use `transition: ... 150ms ease` (or 160ms) for hover/focus transitions.
4. Active states are marked with an `.is-*` modifier class rather than pseudo-classes.
5. Typography hierarchy: display headings use `var(--font-display)` with `font-weight: 500`; body copy uses `var(--font-sans)`.
6. Iconography comes from `lucide-react` (imported into components); no icon font or SVG sprites are styled directly.
7. Animations are declared as named `@keyframes` blocks co-located with their selectors in `station.css`.
8. Reduced-motion users get animations disabled via `prefers-reduced-motion: reduce` blocks.

## Constraints

- The project has no build-time style toolchain beyond Vite's default CSS handling — no PostCSS config, no Sass, no Tailwind config, no CSS-in-JS runtime.
- There is no separate theme file, design-token package, or component-library dependency; the entire visual system lives in one stylesheet.