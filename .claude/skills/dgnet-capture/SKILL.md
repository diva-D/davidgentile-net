---
name: dgnet-capture
description: Capture an artefact as a static hero PNG or an animated social MP4/GIF by driving it through its phases deterministically. Use when the user wants to generate, record, screenshot, or export a hero image or social share animation for a post. Triggers on "capture artefact", "generate hero", "make the social gif", "record the artefact".
---

# Capturing artefacts for davidgentile.net

Artefacts are phased journeys, not continuous animations. Arbitrary time-based screen recording produces bad output: narration you can't read, reveal animations cut in half, unlucky loop points. Capture must be *deterministic* — drive the artefact through its phases programmatically and record only the reveal windows.

## The contract

Every capturable artefact exposes `window.__artefact` with:

- `slug` — matches the filename
- `phaseCount` — total phases
- `currentPhase()` — returns current phase index
- `goToPhase(i)` — jumps to phase `i`, returns a Promise that resolves when that phase's animations finish
- `phaseReady()` — Promise for current phase's animations
- Optional action hooks (e.g. `runExtract`) for phases that have buttons the capture script must press

The phased template already wires this. New artefacts inherit it by copying `template-phased.html`.

## Two output modes

### `--mode=og` — static hero PNG

Single screenshot of the artefact's payoff state (usually the final phase). Used as `heroImage` in post frontmatter and as the OG / Twitter card.

### `--mode=social` — animated MP4 + GIF

A scripted walkthrough: jump to each phase, let the reveal animation play, hold briefly for reading, move on. Output is ~8–12s. MP4 for Twitter/LinkedIn native video, GIF as fallback.

## Running

```
npm i -D playwright                     # first time only
npx playwright install chromium          # first time only
brew install ffmpeg                      # or equivalent, for --mode=social

node scripts/capture.mjs <slug> --mode=og
node scripts/capture.mjs <slug> --mode=social
```

Output lands in `public/images/<slug>-hero.png` / `<slug>-social.mp4` / `<slug>-social.gif`.

## Adding a new artefact's shot list

Open `scripts/capture.mjs` and add an entry to `SHOTS`:

```js
"new-slug": {
  og: { phase: 3 },                             // which phase to capture as hero
  social: [
    { phase: 0, hold: 1200 },                   // hold ms AFTER phaseReady() resolves
    { phase: 1, hold: 1600 },
    { phase: 2, hold: 800, action: "runExtract", postHold: 800 },
    { phase: 3, hold: 1800 },
  ],
},
```

Rules of thumb for `hold` values:
- Narration-heavy phases: 1500–2000ms (reader has to read)
- Pure reveal phases: 800–1200ms after `phaseReady()`
- Action phases: short pre-hold, run the action, longer post-hold to let the morph land

## Self-review before committing capture output

- [ ] OG image shows the payoff state, not an intermediate frame
- [ ] Social MP4 reads cleanly at 0.5× speed (scroll attention is brief but not that brief)
- [ ] Social GIF under 8MB (LinkedIn cap) — if not, reduce `scale` or `fps`
- [ ] Final phase lingers long enough to register as the "answer"
- [ ] No mid-animation truncation at the loop point
