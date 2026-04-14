---
name: dgnet-reader
description: Reader-persona review for davidgentile.net posts. Opens the artefact in Chrome, runs through phases, reads the essay, and flags where it doesn't land. Use AFTER dgnet-editor and dgnet-design-editor, before dgnet-publish. Triggers on "reader review", "persona review", "does this land", "would a reader get this", "cold read".
---

# Reading a davidgentile.net post as a reader

The author knows too much. By the time a post is drafted, edited, and design-edited, the author can't see it cold anymore. This skill forces a cold read.

Your job is to **stop being the author and become a reader**. Open the post. Click through the artefact. React honestly. Flag where the thing breaks.

## The three personas

Run the post through each of these in turn. Don't merge them — each catches different failure modes.

### Persona 1 — The Skeptic

Believes the opposite of the post's claim, or is at least unconvinced. Read looking for:

- The earliest sentence where you'd close the tab.
- Claims the post asserts but doesn't earn.
- Hand-waves ("obviously", "everyone knows", "as we've established") where you're not sold.
- The strongest counter-argument the post doesn't address.

Report: **"A skeptical reader would bounce at <sentence/moment>. Here's why."**

### Persona 2 — The Domain-Adjacent Reader

Works in a related field but not this exact one. Knows the general territory but not the author's specific frame. Read looking for:

- Jargon used without definition that a smart reader wouldn't know.
- References to tools, frameworks, or acronyms that assume prior context.
- Analogies that only land for insiders.
- The artefact's mechanism — does it make sense if you've never seen this kind of thing before?

Report: **"A domain-adjacent reader would trip at <X>. Fix or add scaffolding."**

### Persona 3 — The Cold Reader

Never seen the site before. Arrived via a shared link. Doesn't know the author. Read looking for:

- Is the claim clear in the first two sentences?
- Does the opening make them want to keep reading, or is it throat-clearing?
- If they only read the first paragraph and the pullquote, do they get the point?
- Does the post end with something worth remembering, or does it trail off?

Report: **"A cold reader's takeaway after 30 seconds would be <X>."** If that takeaway isn't the post's actual claim, the post isn't landing.

## The artefact walkthrough

For each persona, actually **open the artefact in Chrome** (via the `mcp__claude-in-chrome__*` tools). Don't just read the code. Do this:

1. Start dev server if needed (`npm run dev`), or open the artefact directly from `public/artefacts/<slug>.html`.
2. Navigate to the artefact.
3. Walk through every phase, clicking what the reader would click.
4. At each phase, ask (in persona):
   - **Do I know what just happened?**
   - **Do I know what to do next?**
   - **Did this phase teach me the thing it was supposed to teach?**
5. At the final phase, ask: **"Do I feel the payoff the post promised?"**

If the answer is no at any phase, that's a flag.

**Mobile too.** Resize the window to 375px and walk through again. Most readers are on phones. An artefact that works great at desktop but fumbles at 375px is failing its primary audience.

## The essay walkthrough

For each persona, read the post top to bottom **out loud** (or as close as you can get — literally generate the text verbatim and pace through it).

Flag:
- **Stumble points:** sentences where you had to re-read to parse.
- **Dead spots:** paragraphs where attention drifts.
- **Mismatches:** moments where the prose says X and the artefact shows Y.
- **Missing connective tissue:** gaps where the argument jumps without bridging.

## The one-thing question

After all three personas, finish with: **"If this post only lands one thing in the reader's head, what is it?"**

Answer in one sentence. Then check: does that sentence match what the post's author-intended claim was? If not, the post is drifting. The fix is usually cutting whatever's pulling it off-thesis, not adding clarification.

## How to report the review

Hand back:

1. **One paragraph per persona.** What they saw, where they bounced, what flagged.
2. **The one-thing sentence.** What actually lands.
3. **A prioritised list of fixes.** Three to five items. Each:
   - The symptom (where it breaks)
   - The persona that caught it
   - A suggested fix (but only if obvious — "this paragraph isn't carrying its weight" is valid without a rewrite)
4. **A green / yellow / red call.** Green = ship it. Yellow = fixable in a pass. Red = structural problem, go back to beats/argument.

## What this skill does NOT do

- Fix the issues. You flag. The author (or another skill) fixes.
- Rewrite prose. That's `dgnet-editor` + `dgnet-voice`.
- Redesign the artefact. That's `dgnet-design-editor`.
- Ship. That's `dgnet-publish`.

## After this skill runs

If the call is green, advance the post's frontmatter `stage` from `design-edited` (or `edited`, if no artefact) to `read`. If yellow, leave the stage where it was and let the author iterate. If red, roll the stage back to `draft` and recommend re-planning.
