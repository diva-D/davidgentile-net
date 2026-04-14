---
name: dgnet-publish
description: Pre-flight check, commit, and push a davidgentile.net post to trigger a production deploy. Use when the user wants to publish, ship, deploy, or push a post live. Also triggers on "go live", "ship this", "publish the post".
---

# Publishing a post to davidgentile.net

This skill is the final step: validate the post is complete, take the hero screenshot if missing, commit with a descriptive message, and push to trigger the Vercel/Netlify deploy. Deploys are zero-config — a `git push` to `main` is all it takes.

## Pre-flight checks (run these, don't skip)

Before committing, verify the following. If any fail, fix before pushing — never ship a half-post.

### 1. The post file exists

`src/content/posts/<slug>.md` must exist with all required frontmatter: `title`, `description`, `date`, `tags`. Optional: `heroImage`, `artefact`, `artefactHeight`, `draft`.

If `draft: true` is set, warn the user — a draft will not appear on the homepage or in the RSS feed. Confirm they want to flip it to `false` (or remove the field) before publishing.

### 2. The essay is within length

Word count target: **180–400 words** of essay body (excluding frontmatter). Count with:

```bash
awk '/^---$/{f=!f; next} !f' src/content/posts/<slug>.md | wc -w
```

- Under 180: tell the user the post is too thin and ask if they want to flesh it out.
- Over 400: suggest cuts — point to paragraphs that recap the artefact, hedge, or introduce a second idea.
- Within range: proceed.

### 3. The artefact file exists (if referenced)

If frontmatter has `artefact: "/artefacts/<slug>.html"`, verify the file exists at `public/artefacts/<slug>.html`. If missing, stop — the post will 404 when the iframe loads.

### 4. The hero image exists (if referenced)

If frontmatter has `heroImage: "/images/<slug>-hero.png"`, verify `public/images/<slug>-hero.png` exists. **If missing, this is the most common publish-time failure.** The hero is what Twitter, LinkedIn, iMessage, and Slack render as the preview when someone shares the link. A missing OG image means your post shows up as a naked URL, which kills click-through.

If the hero is missing, walk the user through capturing it:

```
The hero screenshot needs to be taken manually from a real browser.
Here's the 30-second workflow:

  1. In a terminal: `npm run dev`
  2. Open http://localhost:4321/artefacts/<slug> in Chrome
  3. Interact with the artefact until it shows the "payoff state" —
     the moment where the mechanism's argument is clearest
     (e.g., after clicking the primary action)
  4. Cmd+Shift+4, drag across the artefact stage only (not the
     whole page), release to save to Desktop
  5. Open the screenshot in Preview, Tools → Adjust Size →
     set width to 1200px (preserve aspect ratio)
  6. Tools → Crop → 1200×630 (standard OG aspect ratio)
  7. Save as public/images/<slug>-hero.png

Then re-run this skill.
```

Do not generate the hero image yourself — hand-built SVG approximations look wrong. Only actual browser screenshots of the real artefact are acceptable.

### 5. Mobile works

Open the post at `http://localhost:4321/<slug>` in Chrome, open DevTools device emulation (Cmd+Shift+M), and walk through the post at **iPhone 13 (390×844)** and **iPad (768×1024)** widths.

- No horizontal scroll anywhere on the page.
- Artefact iframe fits cleanly — no cut-off content, no overlapping elements.
- Every phase (if artefact is phased) is readable and usable; Next/Back buttons stay tappable.
- Essay body text reads without zooming.

If any of these fail, stop. Fix in the artefact's `@media (max-width: 640px)` block or the post CSS before pushing. A post that ships broken on phones cuts off most of its readers.

### 6. Local build passes

Run `npm run build` and verify it exits 0. If it fails, show the user the error and stop. Do not push a post that breaks the build.

## The commit

Use a commit message of the form:

```
Post: <title>
```

For follow-up edits to an existing post:

```
Edit <slug>: <what changed in one phrase>
```

Commit only the files relevant to this post. Prefer explicit `git add` of specific paths over `git add -A`:

```bash
git add src/content/posts/<slug>.md \
        public/artefacts/<slug>.html \
        public/images/<slug>-hero.png
git commit -m "Post: <title>"
```

If other unrelated files are dirty in the working tree, ask the user whether to include them before adding.

## The push

```bash
git push origin main
```

Vercel/Netlify picks this up automatically and deploys in ~20 seconds. After pushing, tell the user:

- The commit SHA
- The URL where the post will be live (`https://davidgentile.net/<slug>`)
- Remind them to check the deploy status (Vercel dashboard or `gh run watch` if they're using Actions)
- Offer to draft the social post text (see below)

## Social post drafts (offered, not automatic)

If the user wants, generate short launch text for Twitter and LinkedIn. Format:

**Twitter (≤280 chars):** one-line hook that's NOT the title, then the URL on its own line.

```
<short hook sentence — usually the post's blockquote or a reframe of the description>

davidgentile.net/<slug>
```

**LinkedIn (2–4 short paragraphs):** more room, but still terse. Open with the sharp claim, expand for one paragraph, end with the link. No hashtag spam — at most two if directly relevant.

Do not auto-post to social. Always hand the text back to the user to post themselves.

## What to do if something breaks

- **Build fails:** show the Astro error verbatim, don't try to guess. Astro errors are usually clear (missing frontmatter field, broken markdown, bad import path).
- **Push rejected:** check if the remote has commits you don't have locally. `git pull --rebase`, resolve any conflicts, re-push.
- **Deploy green but site 404s the new post:** likely a slug mismatch. Verify the markdown filename matches the frontmatter `title`-derived slug and that the post file is in `src/content/posts/` (not elsewhere).
- **Hero image doesn't show in social previews:** check that `heroImage` path in frontmatter starts with `/` (absolute from site root), and that the file committed is under 8MB.

## Reminder on the spirit of publishing

The point is to ship, not to polish. If the essay is within length, the artefact works, the build passes, and the hero exists: push. Refinement can happen in follow-up commits. A post that's live and slightly rough beats a post that's perfect and still in a branch.
