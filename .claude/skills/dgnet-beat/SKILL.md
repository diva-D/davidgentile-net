---
name: dgnet-beat
description: Author the distilled "beat" for a davidgentile.net post. The beat is a purpose-built ~5s silent film that captures the post's single most argumentative moment. Lives at public/artefacts/<slug>/beat.html alongside the real artefact. Feeds social MP4, hero PNG, homepage tile. Runs at the `polished → distilled` boundary — after reader, polish, and all prose/artefact edits are frozen, and before publish. Triggers on "build the beat", "author the beat", "make the social film", "distill this post".
---

# Authoring the beat

The real artefact teaches. The beat **punches**. Different goals, different file.

A beat is a ~5-second silent film — no controls, no narration to read, no phase advances. It plays from zero, lands on a strong final frame, loops cleanly. It's the single moment that makes the post's argument land for someone who hasn't read the post. It is what the homepage tile shows, what social MP4 records, what the hero PNG is captured from.

Authoring the beat is design work. You're directing 5 seconds of film. The bar is high because this is what gets linked, shared, and previewed everywhere.

## What the beat is NOT

- A sped-up replay of the real artefact.
- A screen recording of someone clicking through phases.
- A montage of "highlights." One moment, not a reel.
- A narrated explainer. It's silent; text on screen is allowed only if it's instantly legible.

If the beat feels like "the artefact but faster," go back and re-ask what the post's argument actually is. The beat is a *thesis image in motion*, not a trailer.

## The authoring brief

Before writing a line of beat code, answer these five questions. Write the answers at the top of `<slug>.beat.html` as a comment block so future-you knows the intent.

1. **What's the one sentence argument of the post?** In 15 words or less. If you can't write it, the beat can't carry it.
2. **What does the reader see in the first 200ms?** The opening frame has to load the premise (the mess, the before-state, the question).
3. **What's the moment that makes the argument?** The punch. Usually a transformation: unstructured → structured, chaos → order, noise → signal.
4. **What does the final frame say on its own?** This frame is the hero PNG. It's the OG card. It's what someone sees when motion doesn't render. If they never see the video, they should still get the point.
5. **How does it loop?** Default: content-to-content cut. Final frame holds for ~1s, MP4 ends, player loops by cutting back to the opening frame (which already shows the premise). Both ends content-rich. Don't try to fade out / fade in around the seam — see Pass 5.

## The file

`public/artefacts/<slug>/beat.html`. Standalone HTML. Shares visual primitives with the real artefact (same item cards, same schema panel, same colour tokens) so the social asset feels like the post, not a separate product.

Reuse by either:
- **Copy primitives** from the real artefact's CSS/components block into the beat file. Faster to iterate, no cross-file dependency, duplicates code. Acceptable because the beat is small.
- **Import shared CSS** via `<link rel="stylesheet" href="/artefacts/<slug>.shared.css">` if the artefact has been refactored to expose shared styles. Cleaner but only if the refactor already happened — don't introduce it for the beat.

Default to copy. One short beat file beats one refactor.

## The contract

The beat file exposes `window.__beat`:

- `duration` — total beat length in ms (e.g., 4500). Capture uses this to know how long to record.
- `stillFrameAt()` — returns the ms offset (relative to `start()`) for the hero PNG capture. Pick a moment in the held final state. Default if omitted: `duration - 200`.
- `onReady()` — Promise that resolves when fonts/assets are loaded and the opening frame is painted. Capture waits on this before kicking off the schedule.
- `start()` — function the capture driver calls to begin the schedule. The schedule is timer-driven (setTimeout) and starts only when start() runs.

### Auto-start vs capture

Beats must NOT auto-run on load. They auto-start only when opened directly in a browser; the capture driver disables this. The convention:

```js
const isCapture = new URLSearchParams(location.search).has("capture");
document.fonts.ready.then(() => {
  readyResolve();
  if (!isCapture) setTimeout(() => start(), 50);
});
```

The capture script appends `?capture=1` to the beat URL. That suppresses auto-start so the recorder controls timing precisely. Without this, the schedule fires before recording begins and the captured MP4 starts mid-animation.

Why deferred start matters: the opening frame must be the first frame of the captured video. If the schedule auto-runs, the fade-in / first-state transitions happen before the recorder is attached.

## Dimensions

Target canvas: **1200×675** (16:9). Matches social MP4 at native resolution. Homepage tile crops or letterboxes to its own aspect. OG card crops to 1200×630 — keep the top/bottom 22px safe.

Keep all important content inside a 1160×600 safe area (centered). Text must be legible at 600×338 (the smallest size it'll render in-feed on mobile).

### Sizing discipline

The beat HTML **must** set its `html, body` and `.stage` dimensions to exactly **1200×675**. The capture script (`scripts/capture.mjs`) opens a Playwright viewport at 1200×675 and clips the hero screenshot to `{ x: 0, y: 0, width: 1200, height: 675 }`. If the beat declares a different canvas (e.g. 1080×1350 portrait), content will render at the viewport width, overflow the viewport height, and get clipped — the hero image cuts off mid-specimen.

Layout implications for the 16:9 landscape canvas:
- **Side-by-side layouts** (hero text left, specimen right) work well. Stacked vertical layouts run out of vertical space fast at only 675px tall.
- **Section labels and annotations** outside the main card use the horizontal space that landscape gives you. Position them to the left or right of the card with absolute positioning + margin on the card to make room.
- **Monospace specimen text** at 11–12px is the practical floor for legibility at 600×338 mobile rendering. Below that, code becomes unreadable.
- **Section padding** in split-state specimens: 6–8px vertical is tight enough for 5 sections to fit; 12px+ will push the bottom sections off-canvas.
- **Labels outside the card** should be at least 14px bold uppercase to remain legible at half-size social rendering. Use the accent color — muted grey disappears at small sizes.
- **Watermark** should match the friction-tax reference: 16px+, font-weight 700, `var(--ink)` color. Muted grey watermarks vanish when the image is compressed for social.
- **GIF quality**: Always use two-pass palette generation (`palettegen` → `paletteuse` with `dither=bayer:bayer_scale=5:diff_mode=rectangle`). Single-pass GIF encoding produces visible banding and colour artifacts on the warm background tones. Render at 1080px wide (not 600px) — half-resolution GIFs look pixelated on retina displays and high-DPI social feeds.

## The six-pass design bar

Same disposition as `dgnet-design-editor`. Cut until the beat is just the punch.

### Pass 1 — Opening frame

The first frame should already show the premise. No fade-in from blank. The scroll-stop moment is wasted on dead frames, and the captured MP4's first 200ms is exactly when a feed viewer's eye lands. Ask:
- Is the opening frame *content-rich* the moment recording begins? Headers, raw inputs, the before-state — all painted at frame 1.
- Could a reader who pauses on only this frame guess the post's topic within 80%?
- Is there any loading flash, layout shift, or font swap visible during the recording window?

If you find yourself reaching for an opening fade-in, stop. Render the premise statically. The transformation that follows is what the eye tracks; the premise is just the canvas.

### Pass 2 — The transformation

The middle of the beat is the argument. Ask:
- Is the transformation the reader sees the one the post is actually about?
- Is it visually legible — can the eye track what changed?
- Is it paced so a first-time viewer catches it without pausing?

### Pass 3 — The final frame

This frame lives forever as the OG card. Ask:
- Does it state the post's conclusion without copy?
- Would you be proud of it as a still on a colleague's desk?
- At 1200×630 crop, is anything important clipped?

### Pass 4 — Silent legibility

Beats are silent. Text on screen has to compensate. Ask:
- Any text under 24px at 1200×675? Cut or enlarge.
- Any text that requires reading more than 4 words in under 500ms? Too dense.
- Could a colourblind viewer follow the transformation?

### Pass 5 — Loop seam

Short autoloop social MP4s loop whether you want them to or not (X, LinkedIn, homepage `<video loop>`). Don't fight that — design for it. The strongest pattern: **content-to-content cut**. The MP4 ends on the held final frame; the player loops by cutting back to the opening (which already shows the premise). Both ends are content-rich, so the cut replays the story rather than hiding a seam.

Don't try to fade out at the end and fade in at the start. It looks like a video that froze, dead air takes up loop time, and the timing is fragile under capture. Cut.

Ask:
- Does the final frame hold long enough (~1s) that the reader parses it before the loop?
- At the loop boundary, does the cut from final frame to opening frame *make sense as a re-told story* (before → after → before → after)?
- If the answer is "the final frame is the whole point and a re-loop adds nothing," don't loop — just hold. But the platform will probably loop anyway, so prefer designing the cut.

### Pass 6 — Voice in the beat

Every string rendered in the beat passes `dgnet-voice`. That's rare — beats are mostly silent — but if there's a label, a chip, a status word, it obeys the rules. Em dashes especially.

## Running capture

Once the beat file passes the bar:

```
node scripts/capture.mjs <slug> --mode=beat
```

This produces:
- `public/images/<slug>/beat.mp4` — the social film
- `public/images/<slug>/beat.gif` — GIF version (1080px wide, 15fps, two-pass palette) for platforms that don't autoplay MP4
- `public/images/<slug>/hero.png` — the still from `stillFrameAt()` or final frame

After capture, add all three paths to the post's frontmatter:

```yaml
heroImage: "/images/<slug>/hero.png"
beatImage: "/images/<slug>/beat.gif"
beatMov: "/images/<slug>/beat.mp4"
```

`heroImage` is the OG card / featured tile. `beatImage` (GIF) is shown on the homepage when the post is not the featured post. `beatMov` (MP4) is used where autoplay video is supported. All three are required for a complete publish.

### How capture works (and why it's set up this way)

The recorder uses Playwright's native video capture. The page plays in real wall-clock time and the browser's compositor pipes frames to a WebM, which ffmpeg converts to MP4. CSS transitions interpolate naturally because the rendering pipeline sees real time.

Earlier iterations tried frame-by-frame screenshots with virtual-time stepping. Don't go back to that — CSS transitions don't interpolate cleanly when the clock is stepped 33ms at a time, and the captured MP4 looks jerky.

The capture script cleans the `.capture/<slug>-beat-video/` directory before each recording pass. Without this, Playwright may leave a stale webm from a previous run, and the `readdirSync` that finds the webm can pick up the old one — producing an MP4 and GIF that show outdated content even though the beat HTML has changed.

What this means for you as a beat author:
- Use plain CSS transitions and timer-driven schedules. They'll record correctly.
- Don't rely on virtual-time-only tricks (e.g. requestAnimationFrame loops that need a frame budget).
- Keep `start()` + `?capture=1` discipline. If you skip them, recording starts mid-animation.

### Watermark

Every beat carries a `davidgentile.net/<slug>` watermark in the bottom-right of the **stage** (not the body). Beats travel without copy when people screenshot, repost, or strip the link — the watermark is the only attribution that survives.

Anchor it inside the `.stage` element, not the body. Body-anchored watermarks get clipped when the asset is rendered into a narrower iframe or feed crop. Stage-anchored sits on the card itself.

Make it survive video compression. Faint grey at 13–15px gets crushed by h264 at low CRF and disappears entirely from the MP4 even though the hero PNG screenshots fine. Use solid ink colour, font-weight 600+, font-size 16–18px, with a low-opacity white chip behind it. The capture pipeline encodes at CRF 18 / preset slow, but a fragile watermark still won't survive scaling and yuv420p subsampling.

### FOUT and end-trim

Playwright records from page-load, not from `start()`. The first ~500–1000ms of the recording is fonts loading (Inter via external CSS swaps in) and assets resolving. The capture script trims the **end** of the webm — not the start — so the MP4 is exactly the last `duration` ms of recording, which is the beat playing with fonts loaded.

If you ever need to debug capture and re-implement trimming, keep this rule: **trim from end, not start.** Trimming from start keeps the FOUT period and clips the beat's tail.

### Stale webm files

Playwright writes each recording to `.capture/<slug>-beat-video/page@<hash>.webm` and never cleans up. If you re-run capture and inspect "the latest webm" via `ls -t`, you may grab a stale one from a previous run that pre-dates your edits. Either delete the directory between captures or trust the MP4 that capture writes (it always uses the recording from the current run).

### Alt text

Every beat ships with alt text. Screen readers can't see the animation; LinkedIn, X, and the post page itself all have alt fields. Skipping it makes the post inaccessible and quietly dings social reach (platforms boost posts with descriptive alt).

Write the alt at beat-author time and save it to `public/images/<slug>/beat.alt.txt` (one line, plain text). Both the GIF and MP4 reuse the same string; the hero PNG can reuse it too unless the still tells a meaningfully different story than the animation, in which case write a separate `<slug>-hero.alt.txt`.

Rules:
- **Describe the mechanism, not the moral.** What moves, in what order, with what labels. Not "the friction tax disappears." Trust the reader to draw the meaning.
- **120–200 chars.** Long enough to be useful, short enough to be heard before the user skips.
- **Lead with the structure.** "Split-screen animation:" or "Four-phase progression:" sets the frame before naming pieces.
- **Name on-screen labels verbatim.** If a chip says "Next", call it "Next" — not "to-do" or "action item". Sighted and unsighted readers should hear the same words.
- **No editorial verbs.** "Collapses", "morphs", "lands" are fine — they describe motion. "Reveals", "transforms", "unlocks" are the start of marketing copy.
- **Voice rules apply.** Em-dash sweep + phrase blocklist (`dgnet-voice`).

Example (friction-tax):
> Split-screen animation: four lines of raw brain-dump notes on the left collapse one by one into typed task rows on the right, each tagged with a status chip (Next, Waiting, Someday) and a context. An "AI" chip sits between the columns.

`dgnet-social` reads `<slug>-beat.alt.txt` and includes it in each platform draft's asset block, so the author copy-pastes it into the upload dialog without re-deriving it.

### Status / vocabulary variety

If your beat shows typed objects (status chips, categories, etc.), vary them. A wall of identical chips reads as a loop, not as a populated dataset. Two of the dominant value plus one or two alternates makes the right side feel real.

Keep ctx and label vocabulary consistent with the real artefact. If the artefact uses `none` for empty due dates, the beat uses `none` — not `no rush`. Mismatched vocab between beat and artefact reads as two products instead of one.

## Self-review before handing off

- [ ] Beat file opens directly in Chrome and plays without input
- [ ] Three loops watched end-to-end, no stumbles
- [ ] Final frame screenshots cleanly as a standalone image
- [ ] At 375px wide, the beat still reads (mobile feed preview)
- [ ] MP4 file under 5MB (Twitter comfortable cap)
- [ ] Hero PNG under 500KB
- [ ] No em dashes anywhere on-screen
- [ ] Watermark `davidgentile.net/<slug>` rendered inside the stage, visible in both hero PNG and a sampled MP4 frame
- [ ] Alt text written to `public/images/<slug>/beat.alt.txt` and passes the voice check
- [ ] A reader who sees only the beat (no post) gets the argument

## What this skill does NOT do

- Redesign the real artefact. That's `dgnet-design-editor`.
- Write post prose. That's `dgnet-editor`.
- Ship. That's `dgnet-publish`.
- Produce social copy. That's `dgnet-social`.

## After this skill runs

The `distilled` stage completes when the beat file exists, the MP4 + hero PNG have been captured from it, and the self-review bar is met. The post then advances to `published` (via `dgnet-publish`). Beat authoring happens *after* reader/polish so capture runs once against a frozen post rather than being re-run on every upstream edit.
