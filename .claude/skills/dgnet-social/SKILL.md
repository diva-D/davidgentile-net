---
name: dgnet-social
description: Produce per-platform social drafts for a published davidgentile.net post. Consumes the beat MP4, hero PNG, and post body; writes draft files for X, LinkedIn, Bluesky, and newsletter into social-drafts/<slug>/. Never auto-posts. Use after dgnet-publish, or on demand for any already-published post. Triggers on "draft the socials", "social posts", "distribute this", "write the tweet", "promote this post".
---

# Social drafts for a post

The post is the hub. Social is the spoke. Every platform gets the same asset set but its own wrapper copy, because what works on X gets read as formal on LinkedIn and what works on LinkedIn reads as try-hard on X.

This skill writes drafts to files. It never posts. The author copy-pastes.

## What it consumes

Per post:
- **Post file** — `src/content/posts/<slug>.md` (frontmatter + body)
- **Beat MP4** — `public/images/<slug>-beat.mp4` (if present)
- **Hero PNG** — `public/images/<slug>-hero.png`
- **Published URL** — `https://davidgentile.net/posts/<slug>/`

If the beat MP4 is missing, the skill still produces drafts — they just reference the hero PNG for every platform. If the hero is missing too, stop and send the user back to `dgnet-beat` or capture.

## What it writes

A directory per post under `social-drafts/<slug>/`:

```
social-drafts/<slug>/
  x.md           # Twitter/X post
  linkedin.md    # LinkedIn post
  bluesky.md     # Bluesky post
  newsletter.md  # Short blurb for the newsletter/RSS summary
  README.md      # Asset paths, post URL, posting order notes
```

Each draft file is copy-paste ready: wrapper copy + asset reference + URL. No tracking params, no UTMs (site is small; UTMs signal "marketing funnel" and off-tone).

## The voice

All drafts run through `dgnet-voice`. Non-negotiable:
- No em dashes anywhere in any draft.
- No phrase-blocklist words (delve, leverage, robust, seamless, ultimately, etc.).
- Fragments allowed. Mid-thought allowed. First person allowed.
- Point of view, not summary. Drafts state the claim with teeth.

## Per-platform drafts

### X (Twitter)

- **Length:** one hook line + URL. Under 240 chars total.
- **Asset:** MP4 upload (native video autoplays in feed). If no MP4, hero PNG as large card.
- **Format:** hook → blank line → URL. No hashtags by default; add one only if directly relevant.
- **Hook shape:** a concrete claim, a tension, or a self-contained observation. Never "just published a post about X."

Example shape (not real copy — rewrite per post):
```
<one-line claim that stands alone as a tweet>

https://davidgentile.net/posts/<slug>/

[attach: <slug>-beat.mp4]
```

### LinkedIn

- **Length:** 2–3 short paragraphs. 80–150 words.
- **Asset:** MP4 upload (LinkedIn autoplays video). If no MP4, hero PNG.
- **Format:** opening hook (stands alone even if feed truncates), short middle that develops one idea, closing line that points at the post without begging for clicks.
- **Avoid:** "I'm excited to share", "thoughts?", "what do you think?", "would love to hear", hashtag pileups. All of these are LinkedIn smell. One hashtag max, only if there's a genuine community tag that fits.

### Bluesky

- **Length:** under 300 chars total (Bluesky cap).
- **Asset:** MP4 upload (supports native video). If no MP4, hero PNG.
- **Format:** same hook as X, but can be a touch longer since the cap is bigger. URL at the end.
- **Tone:** slightly more relaxed than X. Bluesky reads closer to old Twitter. A beat of personality is fine.

### Newsletter / RSS

- **Length:** 40–80 words.
- **Asset:** hero PNG only (newsletters rarely render video inline, RSS readers never do).
- **Format:** one-sentence hook, one-sentence what-it's-about, link. This is the summary that appears in the site's own RSS feed and any newsletter blurb.
- **Tone:** slightly more explanatory than social — readers here opted in, so a sentence of context earns its place.

## The draft generation pass

Step through these in order. Each step has an output.

### 1. Read the inputs

- `src/content/posts/<slug>.md` — extract title, description, body
- Check `public/images/<slug>-beat.mp4` and `-hero.png` exist
- Construct post URL from slug

### 2. Find the punch

Before drafting anything, answer: **what is the post's one-sentence punch?** Re-read the body. The punch is almost always either the pullquote or the closing line. Sometimes it's a mid-post sentence that the post spent paragraphs earning. Write it out in one sentence.

The punch is the seed for every draft. X is the punch + URL. LinkedIn is the punch developed over two paragraphs. Newsletter is the punch + context.

### 3. Write the X draft first

It's the hardest (tightest cap, no room to hide). If the X draft lands, everything else is easier. If it won't land, the punch you extracted is probably wrong — go back to step 2.

### 4. Adapt for each platform

- LinkedIn: expand the X hook into a short paragraph structure. Don't just repeat it longer — develop it with one concrete example or one follow-up claim.
- Bluesky: usually a minor edit of the X version, slightly looser.
- Newsletter: more explanatory, less punchy.

### 5. Voice review pass

Run `dgnet-voice`'s quick checks on every draft:
- `grep -c "—"` per file — should be zero
- Scan for phrase blocklist hits
- Read each draft out loud
- Gut check: does this sound like a person, or like a social media manager?

### 6. Write the README

`social-drafts/<slug>/README.md` includes:
- Post title and URL
- Asset paths
- Recommended posting order (usually: X → Bluesky within same hour; LinkedIn next morning; newsletter in next scheduled send)
- Any notes on the punch (what you picked, why)
- Reminder: never auto-post

## Draft file format

Each platform file is plain markdown. Structure:

```markdown
# <Platform>

**Asset:** `public/images/<slug>-beat.mp4` (or hero PNG if no beat)

**Post URL:** https://davidgentile.net/posts/<slug>/

---

<the draft copy, ready to copy-paste>

---

## Notes

- (Optional) Anything the author should know before posting, e.g., "X version strips one word that only works on LinkedIn."
```

Keep the copy block clean so copy-paste to the platform's composer is one selection.

## Secondary drafts (optional)

A well-received post deserves a second pass a few days later. If the user asks for "follow-up" or "second wave" drafts:

- **X thread** — break the post's argument into 3–5 tweets, each self-contained
- **LinkedIn text-only** — no video, just the claim developed in writing, for feed variety
- **Quote post** — a different hook pointing at the same URL

Save these in `social-drafts/<slug>/followup/`. Don't generate by default; only on request.

## Two modes

**Fresh-post mode** (default): called after `dgnet-publish` completes. Generates the full draft set for a newly-live post.

**Replay mode**: user points at an already-published post and asks for drafts. Same process; just skips the "did publish complete" check.

## Non-negotiables

- **Never post.** This skill only writes files. The author posts.
- **Never invent stats.** If a draft needs a number, it must come from the post body or be cut.
- **Never @ anyone without user sign-off.** If the post references a person and the draft would tag them, flag it and ask.
- **Never pile on hashtags.** Zero is usually right. One if genuinely relevant. More than one is noise.

## Self-review before handing off

- [ ] All four draft files exist
- [ ] Every file passes the em-dash grep
- [ ] Every file passes the phrase-blocklist scan
- [ ] X draft fits in 240 chars (including URL)
- [ ] Bluesky draft fits in 300 chars
- [ ] LinkedIn draft is 80–150 words
- [ ] Newsletter draft is 40–80 words
- [ ] The punch is the same across all four — same claim, different clothes
- [ ] README lists asset paths and posting order

## What this skill does NOT do

- Author the beat or hero. That's `dgnet-beat`.
- Publish the post. That's `dgnet-publish`.
- Post to platforms. Never.
- Schedule. If the user wants scheduling, they use their own queue tool and paste the drafts in.

## After this skill runs

The post's frontmatter can optionally track social status by advancing `stage` to `distributed` — but only if the user wants that state in the schema. Default: `stage` stays at `published`; the presence of `social-drafts/<slug>/` is the signal that drafts exist.
