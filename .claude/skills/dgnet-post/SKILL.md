---
name: dgnet-post
description: Idea-to-first-draft orchestrator for davidgentile.net. Clarifies the claim, decides if it needs an artefact, plans the beats, builds and iterates with checkpoints, then hands off to dgnet-process for editing, beat authoring, reader review, polish, publish, and social. Use this as the FIRST step any time the user says "let's write a post", "new post idea", "I want to publish something about X", "help me turn this into a post", or describes an idea they want to put on davidgentile.net. Default entry point for new posts — prefer it over invoking dgnet-new-post / dgnet-new-artefact directly. Does NOT ship posts; that's dgnet-process.
---

# Writing a davidgentile.net post: idea to first draft

**Read `/AUDIENCE.md` first.** Every clarify/decide/plan step is a test against the audience doc. A post idea that doesn't fit the reader described there, or doesn't pass the "is there a real interactive you could build for it" test, should get killed at the clarify stage rather than limp through to draft.

This skill owns the **front half** of a post's life: idea → first draft. Everything after the draft exists (editing, beat authoring, reader review, polish, publish, social drafts) is owned by `dgnet-process`, which reads the post's `stage` frontmatter and routes sub-skills accordingly.

This split exists because the pre-draft work is *creative* (claim clarification, beat planning, mid-build review) and the post-draft work is *mechanical* (a stage machine with checkpoints). One skill per disposition.

## The loop

```
   clarify ──► decide ──► plan ──► build ──► review ◄──┐
                                        │              │
                                        └──── iterate ─┘
                                        │
                                        ▼
                             hand off to dgnet-process
```

At every ► there is a **checkpoint with the user**. Do not advance past a checkpoint without explicit confirmation. The checkpoints are the point of the skill.

## Stage 1 — Clarify (before anything is written)

Goal: extract the *one claim* in the reader's language.

Ask the user, in this order, one at a time unless they've already answered:

1. **"In one sentence, what's the idea?"** — capture verbatim.
2. **"Who is the reader, and what do they currently believe?"** — if the reader already agrees, there's no post. The claim must move someone.
3. **"What would change if they took this seriously?"** — the so-what. If there's no so-what, it's a tweet, not a post.
4. **"What's the hardest pushback someone could make?"** — pre-empts the weakness in the claim.

Write the answers back to the user in this shape and get confirmation:

> **Claim:** <one sentence>
> **Reader:** <who, what they believe>
> **So-what:** <what changes>
> **Pushback:** <strongest objection>

**Do not proceed until the user agrees these four are right.** If the answers make the claim feel tired, too obvious, or too narrow, say so — kill it here, not after building.

## Stage 2 — Decide (artefact or not)

Ask: does this claim reward *experience*, or just *explanation*?

- **Artefact-worthy:** there's a mechanism the reader has to *feel* to believe. The claim is counter-intuitive, or the cost / benefit only lands when you see the numbers shift. Phased journey will earn the insight.
- **Prose-only:** the claim is a clean observation, a reframe, a synthesis. Adding an interactive would be decoration, not argument.

State the call: *"I think this wants an artefact because …"* or *"I think this is prose-only because …"*. Get confirmation. If unsure, default to prose-only — artefacts take longer and bad artefacts weaken posts.

## Stage 3 — Plan (write the beats in English before code)

Only if Stage 2 said artefact.

Write out the phases in plain English — one sentence per phase, 3–5 phases. No code yet.

> **Phase 1** — <what the reader sees / does>
> **Phase 2** — <what shifts>
> **Phase 3** — <the reveal>
> **Phase 4** — <the payoff>

Rules:
- Phase 1 is the reader's own world. Not the abstraction.
- Each phase adds *one* thing. If a phase description has an "and" joining two claims, split it.
- Phase N (last) is the payoff the reader earns, not a summary the author writes.

Show the user. Iterate. Do not write code until the beats are agreed.

Also agree on the essay shape:

> **Essay shape:** <few-sentence outline — lede, middle, close>

## Stage 4 — Build (scaffold and implement)

Now invoke the mechanics skills:

1. `dgnet-new-post`. Creates the markdown skeleton with frontmatter.
2. If artefact: `dgnet-new-artefact`. Copies the phased template, implements the beats.
3. **Load `dgnet-voice` before writing any prose.** Voice rules for the site (no em dashes, no AI tells, no filler). Every word that ships (post body, artefact narration, raw item text inside artefacts, the description string in frontmatter) must pass the voice rules.
4. Fill in the essay prose.
5. Fill in the artefact JS to realise the agreed beats.

Work in small increments. After any substantive change to the artefact, **stop and checkpoint** (Stage 5) before continuing.

## Stage 5 — Review (the checkpoint that matters)

After each build increment, pause and report to the user:

- **What's built now** (one sentence)
- **What I see when I look at it** (one honest reaction — does it feel right, feel thin, feel off-brand?)
- **One specific thing I'd like the user to react to** (not "any feedback?" — a pointed question)

Wait for the user's response. Expect one of:
- *"Keep going"* — continue
- *"Change X"* — iterate on X, loop back to Stage 5
- *"This isn't working"* — go back to Stage 3 (replan beats) or Stage 2 (maybe it's prose-only)
- *"Done"* — advance

Do not skip this checkpoint out of politeness or perceived momentum. Honest mid-build reactions are the whole reason this skill exists.

## Stage 5.5 — Mobile check (mandatory)

Before handing off, view the artefact at **375px (iPhone portrait)** and **768px (tablet)**. Report back what you see. Fix any of these that are true:

- Horizontal scrolling anywhere.
- Content clipped, overflowing, or forced behind another element.
- Tap targets smaller than 36px on clickable controls.
- Text smaller than 12px for body content.

Most scrollers are on phones. A broken phone experience is a broken artefact, regardless of how good the desktop version looks. This stage is not skippable.

## Stage 6 — Hand off to dgnet-process

When the user says "done" at Stage 5:

1. Set `stage: draft` in the post's frontmatter using `Edit`. Do not touch any other field.
2. Report back in this shape:

   ```
   First draft complete.
   Post: <slug>
   Title: "<title>"
   Artefact: yes/no
   Stage: draft

   Handing off to dgnet-process. Next skill: dgnet-editor.
   Say "next" to advance, or name a specific stage to jump to.
   ```

3. Stop. Do not invoke `dgnet-editor`, `dgnet-design-editor`, `dgnet-beat`, `dgnet-reader`, `dgnet-capture`, or `dgnet-publish` yourself. The user (or `dgnet-process`) drives from here.

The review loop, beat authoring, polish pass, publish, and social drafts all live downstream of this skill. Respect the seam.

## Non-negotiables

- Never skip Stage 1. "I have an idea, just build it" is how posts end up off-thesis.
- Never skip Stage 5 checkpoints. The whole value of this skill is forcing mid-build review.
- Never advance a stage on your own judgement alone — every stage boundary is a checkpoint.
- Never ship from this skill. Shipping is `dgnet-process` → `dgnet-publish`.
- If at any stage the claim starts to feel tired, say so. Killing a post early is a feature.
