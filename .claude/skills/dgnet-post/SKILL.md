---
name: dgnet-post
description: Orchestrate a full post from idea to publish — clarify the claim, decide if it needs an artefact, plan the beats, build and iterate with the user, then scaffold, capture, and publish. Use this as the FIRST step any time the user says "let's write a post", "new post idea", "I want to publish something about X", "help me turn this into a post", or describes an idea they want to put on davidgentile.net. This is the default entry point — prefer it over invoking dgnet-new-post / dgnet-new-artefact directly.
---

# Writing a davidgentile.net post, start to finish

This skill is the orchestrator. The sub-skills (`dgnet-new-post`, `dgnet-new-artefact`, `dgnet-capture`, `dgnet-publish`) are mechanics. This skill ensures we don't skip to mechanics before the idea is sharp.

## The loop

```
   clarify ──► decide ──► plan ──► build ──► review ◄──┐
                                        │              │
                                        └──── iterate ─┘
                                        │
                                        ▼
                                    capture ──► publish
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

1. `dgnet-new-post` — creates the markdown skeleton with frontmatter.
2. If artefact: `dgnet-new-artefact` — copies the phased template, implements the beats.
3. Fill in the essay prose.
4. Fill in the artefact JS to realise the agreed beats.

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

## Stage 6 — Capture

Invoke `dgnet-capture`. Generate hero PNG and (if appropriate) social MP4/GIF. Show the user the outputs. If they read badly as a scroll-past, loop back to Stage 5 — the artefact needs a clearer payoff state.

## Stage 7 — Publish

Invoke `dgnet-publish`. Run its pre-flight checks. Commit + push only after the user confirms.

## Non-negotiables

- Never skip Stage 1. "I have an idea, just build it" is how posts end up off-thesis.
- Never skip Stage 5 checkpoints. The whole value of this skill is forcing mid-build review.
- Never advance a stage on your own judgement alone — every stage boundary is a checkpoint.
- If at any stage the claim starts to feel tired, say so. Killing a post early is a feature.

## What to report at the end

When a post ships, report:
- Slug + URL
- Whether it had an artefact and how many phases
- Total checkpoints hit (rough count is fine)
- One thing that was harder than expected (feeds the skill's own evolution)
