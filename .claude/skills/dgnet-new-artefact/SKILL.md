---
name: dgnet-new-artefact
description: Build an interactive HTML artefact for davidgentile.net, following the site's visual system and phased-narrative default. Use when the user wants to create, build, prototype, or design an interactive, artefact, demo, widget, explorable, or visual mechanism for a post. Also triggers on "new artefact", "make an interactive", "build a prototype for the site".
---

# Building an artefact for davidgentile.net

Artefacts are small, self-contained interactive HTML files in the tradition of Bret Victor, Nicky Case, and Bartosz Ciechanowski — explorable explanations where the reader *feels* the idea by playing with it. They live at `public/artefacts/<slug>/index.html` and are iframed into the post page as the wide hero.

## The guiding principle

**A good artefact takes the reader on a journey to an insight they earn.** It does not dump the argument on them and ask them to reverse-engineer it. The point isn't to *show* the reader the answer; it's to *walk them through the discovery* so the payoff lands.

This principle tends to push artefacts toward phased / guided structure by default.

## Two artefact modes

Pick one before writing code. Most posts want mode 1.

### Mode 1 — Phased / guided (DEFAULT)

A sequence of 3–5 beats, reader advances via a *Next* button (or scroll trigger). Best for ideas with narrative arc: setup → complication → revelation → implication.

Examples of ideas that want this mode:
- *"Hidden structure in unstructured work"* — phase 1 shows the mess, phase 2 reveals the latent structure, phase 3 extracts it, phase 4 shows the payoff.
- *"Why automations break"* — phase 1 works, phase 2 introduces drift, phase 3 shows confident garbage, phase 4 shows the fix.
- *"Agents need landscape not routes"* — phase 1 ships a route, phase 2 reality changes, phase 3 the agent breaks, phase 4 landscape-based agent adapts.

### Mode 2 — Single-mechanism / sandbox

One system, many possible interactions, no prescribed path. Best when the argument is about a *tradeoff inside a space* and the reader's own exploration *is* the point.

Examples of ideas that want this mode:
- *"You can't maintain every skill"* — one freshness model, many skills, reader discovers scarcity by trying to keep everything green.
- *"The approval bottleneck"* — one queue of AI-drafted actions, reader has to rate them all and feels the new work shape.

If you're unsure, default to phased. Sandbox mode is the exception and has to earn its shape.

## The one rule that matters most (still)

**The artefact embodies one claim, made vivid through one mechanism or one journey.** Not two claims. Not a survey of related ideas. If the artefact tries to make two arguments, split it into two posts.

## Mobile is non-negotiable

**Most scrollers are on phones.** An artefact that's broken at 375px is broken, full stop — it cuts off the majority of the audience and the whole format (short shareable ideas + clean visuals) assumes phone-first distribution. This is not a polish step at the end; it is a design constraint from the first line of CSS.

Hard rules every artefact must meet:

- **No horizontal scrolling, ever, at any viewport from 320px up.** If content doesn't fit, it stacks, it wraps, or it shrinks — it never overflows.
- **No absolutely-positioned elements that overlap other content.** If you reach for `position: absolute`, explain to yourself why flow layout won't do it. On mobile, overlap becomes collision.
- **Tap targets ≥ 36px on any clickable control.** Buttons, chips, filter toggles.
- **Typography holds at 12px minimum for body content, 9px for UI microcopy.** Anything smaller is unreadable on phones.
- **Every template ships with a `@media (max-width: 640px)` block at the baseline.** Extend it for your mechanism. Never delete it.

If the desktop version uses a multi-column grid or a side-pinned panel, the mobile version almost certainly needs to be a vertical stack. Plan the stack at the same time you plan the desktop layout — not as an afterthought.

Before shipping, view the artefact at 375px (iPhone portrait) and 768px (tablet). If it feels cramped, awkward, or clipped, it's not ready.

## The visual system (copy exactly, never modify)

Every artefact uses this palette and typography. Consistency across posts is how the site reads as one author's voice.

```css
:root {
  --bg: #faf7f0;         /* cream paper background */
  --ink: #1a1a1d;        /* primary text */
  --ink-soft: #4a4a52;   /* body / secondary text */
  --muted: #8c8c93;      /* tertiary / labels */
  --line: #e4dfd2;       /* borders / dividers */
  --accent: #d94b2f;     /* single accent — the ONLY warm color */
  --gold: #e0a526;       /* status: warning / mid-state */
  --green: #3a9f5e;      /* status: good / success */
  --paper: #fff;         /* card/panel fills */
}
```

Typography:
- **Framing / narrative text:** `"Iowan Old Style", "Palatino", ui-serif, Georgia, serif`
- **UI / labels / data:** `"Inter", sans-serif` (loaded from `https://rsms.me/inter/inter.css`)

## Structural conventions

```html
<div class="wrap">              <!-- max-width: 1040px -->
  <div class="stage">            <!-- white card, border, rounded -->
    ...the journey or the mechanism...
  </div>
</div>
```

## Anatomy of a phased artefact

A phased artefact has these elements — they are the grammar of the format.

1. **Progress indicator** (top, small, muted). `1 / 4`, or four dots, or a thin bar. Tells the reader where they are.
2. **Phase narration** (one short sentence, serif, reading-size). States what's happening in this beat. Not didactic. Not a tutorial step. A beat in a story.
3. **The stage** — the main visualization that mutates as phases advance. The stage persists across phases (don't wipe it and redraw a new thing — the *same* stage changes state, so the reader sees cause and effect).
4. **Advance control** — `Next →` button, primary style. Positioned bottom-right or bottom-center. On the final phase, this becomes `Reset ↺`.
5. **Optional back control** — subtle `← back` in phase 2+. Lets a reader re-check a step without resetting.
6. **Optional per-phase interaction** — some phases let the reader *do something* (hover, click, drag) before advancing. The best artefacts mix passive reveals with active moments.

### Phase design heuristics

- **3–5 phases.** Fewer than 3 and it's not a journey. More than 5 and the reader loses the arc.
- **Each phase should take 5–15 seconds.** If a phase needs more than 15 seconds, break it in two.
- **Each phase reveals exactly one thing.** If a phase makes two new claims, the second one belongs in the next phase.
- **The final phase should feel like a payoff, not a conclusion.** Show the transformed state, let the reader click around, don't write a summary.
- **The first phase should feel like the reader's own world.** Start in familiarity, not in the abstraction. If the reader can't see themselves in phase 1, you lose them before phase 2.

## Anatomy of a sandbox artefact

Used only when the argument is about a space the reader should explore freely.

1. **A single system** — one model, one state.
2. **Multiple interaction points** — clickable elements, sliders, buttons — but all operating on the same system.
3. **A live insight line** — one line of text that updates based on state, nudging the reader toward the argument. Not a tutorial. A *provocation* that changes as they play.
4. **Reset always available.**

## What NOT to include inside the artefact (any mode)

**Strip all post-page framing.** The post provides title, kicker, date, and prose argument. The artefact must NOT duplicate any of:

- ❌ A kicker like `ARTEFACT 01 · STRUCTURE LAYER`
- ❌ An `<h1>` title
- ❌ A lede paragraph explaining what the artefact is about
- ❌ Closing paragraphs, callouts, or footers with interpretive text
- ❌ "What this is" / "Why this matters" meta-commentary

Phase narration is *not* framing — it's a beat of the mechanism. A single provocation-line in sandbox mode is *not* framing — it's the mechanic's voice. But standalone prose that explains the argument outside the interactive itself is always a sign the mechanism isn't doing its job.

## Steps for building

1. **Pick the mode.** Phased or sandbox. Default phased.

2. **Write the beats in prose before writing code.**
   - Phased: write 3–5 one-sentence descriptions of each phase. If any phase description contains the word "and" joining two claims, split it.
   - Sandbox: write the one-sentence provocation and list the 2–4 interaction points.

3. **Copy the right template** from this skill's directory:
   - `template-phased.html` for phased mode
   - `template-sandbox.html` for sandbox mode
   Rename to `public/artefacts/<slug>/index.html`.

4. **Build the stage first, then the transitions.** For phased artefacts, get the stage working in its *final* state first, then work backwards: animate state changes from phase N-1 to phase N. Don't try to build all phases linearly — you'll paint into a corner.

5. **Iframe sizing is automatic.** Every template includes a self-sizing block that posts the artefact's real content height to the parent page on load, resize, and any DOM-size change. The post layout listens and sets the iframe height to match, so there are never scrollbars and the artefact feels part of the page. The `artefactHeight` frontmatter is now just a pre-hydration fallback — pick a value close to the tallest phase so the page doesn't reflow visibly on first load.

6. **Test all phase transitions.** In a phased artefact, walk through 1→2→3→... and also reset→1. Both paths must look clean. The back button (if included) must also work.

## Self-review checklist before shipping

- [ ] Mode chosen deliberately (phased by default).
- [ ] One claim only. No secondary arguments.
- [ ] Phased: 3–5 phases, each revealing one thing, 5–15s each.
- [ ] Sandbox: one system, multiple interactions, live insight line.
- [ ] First phase (or first-glance state) starts in the reader's world, not in abstraction.
- [ ] Final phase is payoff, not summary.
- [ ] Uses only the declared `--*` CSS variables — no rogue hex colors.
- [ ] Serif for framing, Inter for UI, no other fonts.
- [ ] No `<h1>`, no kicker, no lede, no closing paragraphs, no footer.
- [ ] `.wrap` max-width is 1040px.
- [ ] Runs with no console errors. No external JS libraries unless strictly necessary.
- [ ] **Tested at 375px (iPhone portrait) and 768px (tablet) — no horizontal scroll, no clipped content, no overlapping elements, tap targets ≥ 36px.**
- [ ] `@media (max-width: 640px)` block is present and actually does something meaningful for this mechanism (not just inherited empty baseline).
- [ ] Reader leaves with a *feeling* that matches the post's claim, not a tutorial lesson.

## After building

Report to the user: file path, line count, mode (phased/sandbox), phase count if phased, suggested `artefactHeight` for frontmatter, and the reminder to take a hero screenshot of the final / payoff phase (instructions in `dgnet-publish`).
