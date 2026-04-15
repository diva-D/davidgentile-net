---
name: dgnet-editor
description: Ruthless copy editor for davidgentile.net posts. Cuts every sentence that isn't earning its place. Use AFTER dgnet-voice (voice rules) and before dgnet-reader. Triggers on "edit the post", "tighten this", "cut it down", "copy edit", "editorial pass".
---

# Editing a davidgentile.net post

Voice rules already ran (via `dgnet-voice`). That pass makes the prose sound human. This pass asks a harder question: **does this sentence need to exist at all?**

Every word on the page is renting the reader's attention. Cut the ones that aren't paying.

## The mindset

You are not the author here. You are a reader with a red pen and no patience. Your job is to make the post shorter, sharper, and more load-bearing. If you find yourself defending a sentence, that is a tell — it probably goes.

Default disposition: **suspicious of every sentence until it proves itself.**

## The cuts, in order

Run these passes sequentially. Don't combine them. Each pass looks for a different class of waste.

### Pass 1 — The throat-clearing sweep

First sentence of every paragraph. Is it setup, or is it the point? If it's setup ("Let me explain why..." / "There's a concept here..." / "One way to think about this..."), delete it. The reader will figure out what the paragraph is about from the paragraph.

Also look for:
- Transitional throat-clearers ("So", "Now", "Anyway") at the start of paragraphs — usually fine in moderation, but more than two in a 300-word post is a pattern, cut the weakest.
- Rhetorical questions the author then immediately answers ("What does this mean? It means..."). Just state the answer.

### Pass 2 — The echo sweep

Look for sentences that say the same thing as an adjacent sentence. AI does this constantly; humans do it under fatigue. Keep the stronger of the two, cut the other.

Specifically:
- Two consecutive sentences with the same subject and verb shape.
- The "in other words" restatement after a strong sentence. If the first line landed, the second is noise.
- A concluding sentence that paraphrases the blockquote or the lede. The reader remembers.

### Pass 3 — The adjective/adverb audit

For every adjective and adverb, ask: *does removing this change the meaning?* If the sentence means the same thing without it, cut it.

High-value targets:
- "Really", "very", "quite", "rather", "actually", "literally" — almost never load-bearing.
- "Just" as a softener ("it's just a matter of...") — cut.
- Stacked adjectives ("a small, tight, well-made thing") — pick one.

### Pass 4 — The hedge purge

Cut every "could", "might", "maybe", "perhaps", "potentially", "arguably", "it seems", "in some sense" that isn't doing real epistemic work. The post has a view. State it.

Keep hedges only where the author is genuinely uncertain and wants the reader to know. Everywhere else, the hedge is cowardice disguised as humility.

### Pass 5 — The list collapse

Check every list in the post (comma-separated or bulleted).

- Two-item lists: usually fine.
- Three-item lists: scrutinise. Is the third item doing work, or is it padding because "three sounds better"?
- Four+ lists: ask if any item overlaps another. Collapse or cut.

Bulleted lists specifically: davidgentile.net posts are essays. If there's a bulleted list in the body, ask whether it should be prose instead. Bullets fragment argument.

### Pass 6 — The whole-paragraph cut

Final and hardest pass. For each paragraph, ask: **if I deleted this entire paragraph, would the post be worse?**

If the answer is "no, or only marginally", delete it. This is the cut authors resist most and readers benefit from most.

Common candidates for deletion:
- The "setup" paragraph explaining what the post is about.
- The recap paragraph summarising what was just said.
- The "one more thought" paragraph added because the post felt short.

## The bar

After your passes, the post should:

- Be **shorter than when it came in**. If it isn't, you didn't cut hard enough.
- Have **zero throat-clearing openers**.
- Have **no adjacent echoes**.
- Have **no padding hedges**.
- End on a **specific image or a sharp turn**, not a summary.

Target: most davidgentile.net posts should land 180-280 words after editing. Over 300 is allowed but needs to justify itself.

## How to report the edit

When handing back to the user:

1. **Word count before / after.** Hard number. If you didn't reduce by at least 10%, say so and explain why the rest genuinely earned its place.
2. **Three cuts you'd flag as judgment calls.** Show the user the sentences you cut where you're less than 95% sure. Let them overrule.
3. **One thing you didn't cut but wanted to.** Preserves your editorial taste for them to react to.

Do not silently make sweeping changes. Show the diff and justify.

## Two modes

This skill runs in one of two modes:

**Full-pass mode** (default, used when `dgnet-process` advances `draft` → `edited`): walk all six passes above, end-to-end.

**Targeted-fix mode** (used when `dgnet-reader` flagged a `target: prose` fix): apply the specific change the reader proposed, nothing else. Do not run the full six passes. Show the diff, get sign-off, done. The reader did the diagnostic work; this is the surgical execution.

The orchestrator tells you which mode to run in. If unclear, default to full-pass.

## What this skill does NOT do

- Rewrite for voice. That's `dgnet-voice`.
- Fact-check. You're editing, not verifying.
- Fix the artefact. That's `dgnet-design-editor`.
- Restructure the argument. If the argument is broken, flag it and stop — don't invent a new one.

## After this skill runs

The post's frontmatter `stage` field should advance from `draft` to `edited`. Update it once the user signs off on the edit pass. If they don't sign off (they push back on the cuts), leave the stage where it was and iterate.
