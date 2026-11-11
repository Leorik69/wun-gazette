# WUN Welcome Cinematic Signal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the generic hero greeting with the approved cinematic-signal welcome and deploy the verified landing page to production.

**Architecture:** Keep the effect local to the existing hero heading in `App.tsx`. Use semantic spans for word-level reveal and CSS-only decorative layers for the beam and Neutron pulse; all motion falls back to a static presentation under `prefers-reduced-motion`.

**Tech Stack:** React 19, TypeScript, CSS keyframes, Node built-in test runner, Vite, Vercel CLI.

## Global Constraints

- Work only in `D:\wun-gazette`.
- Do not touch the main WUN repository or Git.
- Keep the emblem, Neutron graph, signup URLs, and other page sections unchanged.
- Keep the single approved gold sentence unchanged and add no other gold copy.
- Show static readable text when reduced motion is requested.

---

### Task 1: Hero Welcome Contract

**Files:**
- Create: `src/heroWelcome.test.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: existing `.hero-title` card in `App.tsx`
- Produces: `.hero-kicker`, `.hero-title-line`, `.hero-title-word`, `.hero-title-support`, `.hero-light-beam`, `.hero-signal-pulse`, and `.hero-title-rule`

- [ ] **Step 1: Write the failing source contract test**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(new URL("./App.tsx", import.meta.url), "utf8");

test("hero uses the approved cinematic welcome", () => {
  assert.match(app, /A nation beyond borders/);
  assert.match(app, /Welcome/);
  assert.match(app, /still becoming\./);
  assert.match(app, /A living digital world, built in public/);
  assert.doesNotMatch(app, /The nation .*is open\./s);
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `node --test src/heroWelcome.test.mjs`

Expected: FAIL because the approved copy is absent.

- [ ] **Step 3: Implement semantic hero markup**

Replace the current hero heading with:

```tsx
<div className="hero-title copy-card">
  <span className="hero-light-beam" aria-hidden="true" />
  <span className="hero-signal-pulse" aria-hidden="true" />
  <span className="hero-kicker">A nation beyond borders</span>
  <h1 className="hero-title-line">
    {["Welcome", "to the", "nation", "still", "becoming."].map((word, index) => (
      <span
        key={word}
        className={`hero-title-word hero-title-word-${index + 1}`}
      >
        {word}
      </span>
    ))}
  </h1>
  <p className="hero-title-support">
    A living digital world, built in public with the people who choose to call it theirs.
  </p>
  <span className="hero-title-rule" aria-hidden="true" />
</div>
```

- [ ] **Step 4: Run the contract test and verify green**

Run: `node --test src/heroWelcome.test.mjs`

Expected: 1 test passes.

---

### Task 2: Cinematic Motion and Accessibility

**Files:**
- Modify: `src/heroWelcome.test.mjs`
- Modify: `src/station.css`

**Interfaces:**
- Consumes: hero classes from Task 1
- Produces: one eight-second reveal/shimmer cycle, faint beam, pulse rings, and reduced-motion fallback

- [ ] **Step 1: Extend the test for motion accessibility**

```js
const css = await readFile(new URL("./station.css", import.meta.url), "utf8");

test("hero motion has a reduced-motion fallback", () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.hero-title-word/);
  assert.match(css, /\.hero-light-beam/);
  assert.match(css, /\.hero-signal-pulse/);
});
```

- [ ] **Step 2: Run the test and verify red**

Run: `node --test src/heroWelcome.test.mjs`

Expected: the motion test fails before the new CSS exists.

- [ ] **Step 3: Add scoped hero styles**

Add CSS that:

- keeps `.hero-title` as the translucent card and makes it `position: relative; overflow: hidden`;
- gives the kicker uppercase gold typography;
- lays out headline words with natural wrapping;
- uses staggered blur/translate reveals;
- applies the cool-to-gold gradient shimmer after the reveal;
- moves one faint diagonal beam behind the text;
- renders two slow pulse rings from a small decorative point;
- disables all animations and restores `opacity: 1`, `filter: none`, and `transform: none` under reduced motion.

- [ ] **Step 4: Run contract and production build**

Run:

```powershell
node --test src/heroWelcome.test.mjs
npm run build
```

Expected: all contract tests pass; TypeScript and Vite build succeed.

---

### Task 3: Local Verification and Production Deployment

**Files:**
- No source changes expected

**Interfaces:**
- Consumes: successful Task 2 build
- Produces: updated `https://wun-gazette.vercel.app`

- [ ] **Step 1: Verify the existing local preview**

Open `http://127.0.0.1:5190/` and check desktop and narrow viewport presentation. Confirm text remains readable, does not overlap the emblem, and reduced motion produces static text.

- [ ] **Step 2: Deploy production**

Run from `D:\wun-gazette`:

```powershell
npx --yes vercel@latest deploy --prod --yes --scope wun1
```

Expected: existing `wun1/wun-gazette` project reaches READY. Abort if Vercel asks to create a new project.

- [ ] **Step 3: Verify production**

Confirm `https://wun-gazette.vercel.app` serves the new welcome and report the deployment ID.

No Git commit is included because this standalone landing is intentionally maintained outside Git.
