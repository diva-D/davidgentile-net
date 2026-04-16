---
name: dgnet-publish
description: Pre-flight check, commit, and push a davidgentile.net post to trigger a production deploy. Use when the user wants to publish, ship, deploy, or push a post live. Also triggers on "go live", "ship this", "publish the post".
---

# Publishing a post to davidgentile.net

This skill is the final step: validate the post is complete, confirm we're on the `post/<slug>` branch, commit any pending work there, then **merge the branch into main and push** to trigger the production deploy. Main is the deploy branch; everything until this point lived on `post/<slug>`.

## Branch model

- Every post is authored on its own branch: `post/<slug>`. `dgnet-new-post` creates this at scaffold time.
- All editing, design-editing, beat capture, reader review, and polish happens on the branch. Vercel auto-deploys the branch as a preview URL, which is where the reader review actually walks through the live page.
- `dgnet-publish` is the only skill that touches main. It merges the branch in, pushes main, and deletes the branch. That's "go live."

If the current branch is already `main` when this skill runs, stop and ask. The post should have been authored on a branch; going live from main means skipping the preview-review loop. Let the user confirm the intent before proceeding (e.g., hotfix commits to an already-published post).

## Pre-flight checks (run these, don't skip)

Before committing, verify the following. If any fail, fix before pushing — never ship a half-post.

### 1. The post file exists

`src/content/posts/<slug>.md` must exist with all required frontmatter: `title`, `description`, `date`, `tags`. Optional: `heroImage`, `beatImage`, `beatMov`, `artefact`, `artefactHeight`, `draft`.

For posts with a beat (most posts with artefacts), all three image fields should be set:
- `heroImage` — the still hero PNG (OG card, featured tile)
- `beatImage` — the GIF (homepage tile when post is not featured)
- `beatMov` — the MP4 (homepage tile where autoplay video is supported)

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

If frontmatter has `artefact: "/artefacts/<slug>/index.html"`, verify the file exists at `public/artefacts/<slug>/index.html`. If missing, stop — the post will 404 when the iframe loads. (Use the explicit `/index.html` path — the dev server 404s on trailing-slash URLs under `trailingSlash: 'never'`.)

### 4. The hero image exists (if referenced)

If frontmatter has `heroImage: "/images/<slug>/hero.png"`, verify `public/images/<slug>/hero.png` exists. **If missing, this is the most common publish-time failure.** The hero is what Twitter, LinkedIn, iMessage, and Slack render as the preview when someone shares the link. A missing OG image means your post shows up as a naked URL, which kills click-through.

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
  7. Save as public/images/<slug>/hero.png

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

### 6. Voice pass

Load the `dgnet-voice` skill and apply its review checklist to the post body, the description in frontmatter, and every string the artefact renders to the reader (narration, raw item text, typed cell values, button labels).

The two non-negotiable mechanical checks:

```bash
grep -n "—" src/content/posts/<slug>.md public/artefacts/<slug>/index.html
# expected: zero hits in any reader-visible string. Any hit gets fixed.

grep -niE "delve|leverage|robust|seamless|multifaceted|ultimately|in essence|that said|moreover|furthermore" \
  src/content/posts/<slug>.md public/artefacts/<slug>/index.html
# expected: zero. Each hit gets reviewed and almost always cut.
```

If anything trips, stop. Rewrite. Re-run. The voice rules are the bar; a post that sounds AI-generated has failed before it shipped.

### 7. Local build passes

Run `npm run build` and verify it exits 0. If it fails, show the user the error and stop. Do not push a post that breaks the build.

## The final commit on the branch

First, make sure everything on the branch is committed. Pre-flight may have produced no new changes (if the branch was already clean), in which case skip this step.

Commit message form:

```
Post: <title>
```

For follow-up edits to an already-published post (hotfix flow, see below):

```
Edit <slug>: <what changed in one phrase>
```

Commit only the files relevant to this post. Prefer explicit `git add` of specific paths over `git add -A`:

```bash
git add src/content/posts/<slug>.md \
        public/artefacts/<slug>/ \
        public/images/<slug>/
git commit -m "Post: <title>"
```

Per-post assets all live under `public/artefacts/<slug>/` and `public/images/<slug>/`, so adding the directories covers every file the post owns (artefact, beat, hero, mp4, gif, alt text).

If other unrelated files are dirty in the working tree, ask the user whether to include them before adding.

## The merge

Going live = merging `post/<slug>` into main, pushing main, deleting the branch.

```bash
# Push the branch (if not already up to date on remote)
git push -u origin post/<slug>

# Switch to main and fast-forward
git checkout main
git pull --ff-only

# Merge the branch. Use --no-ff so main's history shows the post as a unit.
git merge --no-ff post/<slug> -m "Publish <slug>: <title>"

# Push main — this is the actual deploy trigger.
git push origin main

# Clean up the branch (local + remote)
git branch -d post/<slug>
git push origin --delete post/<slug>
```

If the merge produces conflicts, stop. Don't force anything. Show the conflicts to the user and ask how to resolve.

Vercel picks up the push to main and deploys in ~20 seconds. After pushing, tell the user:

- The merge commit SHA on main
- The URL where the post will be live (`https://davidgentile.net/<slug>`)
- Remind them to check the deploy status on the Vercel dashboard
- Offer to draft the social post text via `dgnet-social`

## Hotfix flow (editing an already-published post)

If the user wants to edit a post that's already live on main:

1. Branch from main: `git checkout main && git pull --ff-only && git checkout -b post/<slug>-edit`
2. Make the edits on that branch. Preview URL still available.
3. Run this skill when ready. The merge commit message becomes `Edit <slug>: <what changed>` instead of `Publish`.

Never commit directly to main.

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
