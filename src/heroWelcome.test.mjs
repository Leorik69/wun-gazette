import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(new URL("./App.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("./station.css", import.meta.url), "utf8");

const HERO_TITLE_WORDS = ["Welcome", "to the", "nation", "still", "becoming."];

test("hero uses the approved cinematic welcome", () => {
  assert.match(app, /A nation beyond borders/);
  assert.match(
    app,
    /HERO_TITLE_WORDS\s*=\s*\["Welcome",\s*"to the",\s*"nation",\s*"still",\s*"becoming\."\]\s*as const/
  );
  assert.equal(HERO_TITLE_WORDS.join(" "), "Welcome to the nation still becoming.");
  assert.match(app, /A living digital world, built in public/);
  assert.doesNotMatch(app, /The nation .*is open\./s);
  assert.doesNotMatch(app, /\{\/\*\s*Welcome to the nation still becoming\.\s*\*\/\}/);
});

test("hero motion has a reduced-motion fallback", () => {
  const heroReducedMotion = css.match(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.hero-title-word\s*\{([\s\S]*?)\}/
  );
  assert.ok(heroReducedMotion, "hero reduced-motion block for .hero-title-word is missing");
  assert.match(heroReducedMotion[1], /animation:\s*none/);
  assert.match(css, /\.hero-light-beam/);
  assert.match(css, /\.hero-signal-pulse/);
});
