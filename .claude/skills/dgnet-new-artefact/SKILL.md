---
name: dgnet-new-artefact
description: Build a single-file interactive HTML artefact for davidgentile.net, following the site's visual system. Use when the user wants to create, build, prototype, or design an interactive, artefact, demo, widget, explorable, or visual mechanism for a post. Also triggers on "new artefact", "make an interactive", "build a prototype for the site".
---

# Building an artefact for davidgentile.net

Artefacts are small, self-contained interactive HTML files in the tradition of Bret Victor, Nicky Case, and Bartosz Ciechanowski — explorable explanations where the reader *feels* the idea by playing with it. They live at `public/artefacts/<slug>.html` and are iframed into the post page as the wide hero.

## The one rule that matters most

**The artefact embodies one mechanism that makes the idea feel real.** Not two. Not three. One. If you find yourself adding a second interactive mechanic, the idea is probably blurry and needs sharpening before any code gets written.

Good mechanic examples from existing artefacts:
- *Friction tax*: clicking a filter on the typed side reveals what the scan-everything side has to do manually.
- *Skill decay lab*: skipping a day drops every freshness meter while you try to keep them green.

Each is one action, one reveal, one argument. The reader leaves with a feeling, not a tutorial.

## The visual system (copy exactly)

Every artefact uses this palette and typography. Do not introduce new colors or fonts. Consistency across posts is how the site reads as one author's voice.

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
- Framing text is for anything a reader reads as prose. UI text is for labels, buttons, metrics, chips, small annotations.

## Structural conventions

Every artefact wraps its content in this pattern:

```html
<div class="wrap">              <!-- max-width: 1040px -->
  <div class="stage">            <!-- white card, border, rounded -->
    ...the one mechanism...
  </div>
</div>
```

The `.wrap` is 1040px max-width because the post page gives the artefact a 1080px stage (minus gutter). Going wider breaks the layout. Going narrower wastes the space we fought for.

## What NOT to include inside the artefact

**Strip all post-page framing.** The post provides the title, kicker, date, and the prose argument. The artefact must NOT duplicate any of:

- ❌ A kicker like `ARTEFACT 01 · STRUCTURE LAYER`
- ❌ An `<h1>` title
- ❌ A lede paragraph explaining what the artefact is
- ❌ Closing paragraphs, callouts, or footers with interpretive text
- ❌ "What this is" / "Why this matters" meta-commentary

The artefact is the mechanism. Nothing else. If the artefact alone doesn't make sense without those framings, the *mechanism* isn't clear enough — rebuild it sharper.

**One exception:** a single short question or prompt at the top of the stage (e.g., *"What needs your attention right now?"*) is fine if it's part of the mechanic, not framing. Keep it to one line.

## Starter template

See `template.html` in this skill's directory. Copy it, rename to the target slug, and modify *only* the `<body>` content (the mechanism) and any `<script>` logic. Do not change `:root` variables. Do not change the `.wrap`/`.stage` structure. Do not add external libraries unless strictly necessary — vanilla JS and CSS are almost always enough.

## Steps

1. **Confirm the idea is an artefact, not an image.** If the idea can be expressed in a static diagram with no interaction, it's probably a diagram. Only build an artefact when the argument *is* the reader doing something.

2. **Sketch the mechanic in prose before writing code.** One sentence: *"The reader does X, and Y happens, which reveals Z."* If that sentence is hard to write, the mechanic isn't ready.

3. **Copy the template** to `public/artefacts/<slug>.html`. Match the slug to the post's slug.

4. **Build the mechanism.** Keep the artefact under ~500 lines total. If it grows past that, you're probably building two mechanisms — cut one.

5. **Size the iframe.** After building, open the artefact in a browser, note the natural height of the content, and update the post's frontmatter `artefactHeight` to match (rounded to nearest 20px).

6. **Do not add the post's title, kicker, or explanatory copy inside the artefact.** Re-read the file and delete any framing text you accidentally added.

## Self-review checklist before shipping

- [ ] One mechanism only. No secondary interactive features.
- [ ] Uses only the declared `--*` CSS variables — no rogue hex colors.
- [ ] Serif for framing, Inter for UI, no other fonts.
- [ ] No `<h1>`, no kicker, no lede, no closing paragraphs, no footer.
- [ ] `.wrap` max-width is 1040px.
- [ ] Runs with no console errors. No external JS libraries unless necessary.
- [ ] Works without JavaScript failing silently on mobile (test the layout at 400px width).
- [ ] The reader leaves with a feeling that matches the post's claim, not a tutorial lesson.

## After building

Report to the user: file path, line count, suggested `artefactHeight` for the frontmatter, and the reminder that they need to take a hero screenshot (instructions in `dgnet-publish`).
