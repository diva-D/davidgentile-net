---
name: dgnet-process
description: Stateful workflow orchestrator for davidgentile.net posts. Reads the `stage` field in post frontmatter and routes to the next skill (edit → design-edit → read → polish → publish + social). Use when the user says "what's next on this post", "run the next stage", "move this post forward", "process this post", or invokes /dgnet-process with a slug.
---

# The post process

`dgnet-post` owns creation (clarify → build). This skill owns everything after the first draft exists: **the editing / review / polish / ship loop**, tracked as state in frontmatter.

The post itself carries its own process state. That means:
- You can pause a post halfway through, come back in a week, and the process knows where to resume.
- Multiple posts can be in-flight at different stages.
- The workflow is visible in the file, not in some external tracker.

Very meta. Structured work using a tiny schema. Deliberate.

## The stages

```
draft ──► edited ──► design-edited ──► read ──► polished ──► published
           (skip design-edited if no artefact)
```

Each stage is the **output** of running one skill:

| Stage            | Produced by          | Means                                       |
|------------------|----------------------|---------------------------------------------|
| `draft`          | `dgnet-new-post`     | First full draft exists. Prose + artefact if applicable. |
| `edited`         | `dgnet-editor`       | Copy-edit pass done. Post is shorter, sharper. |
| `design-edited`  | `dgnet-design-editor`| Artefact pass done. Dead state cut, noise removed. Skipped if no artefact. |
| `read`           | `dgnet-reader`       | All three personas walked the post. No red flags. |
| `polished`       | (final prose pass)   | Any reader-review fixes applied. Voice re-checked. Mobile re-checked. |
| `published`      | `dgnet-publish`      | Committed + pushed. Live on davidgentile.net. |

## How to invoke

Two modes:

### Mode 1 — Status (read-only)

```
/dgnet-process <slug>
```

Just reports the current stage, what skill ran to get there, and what the next recommended stage is. No action taken. Useful for "where is this post at?"

### Mode 2 — Advance (route and run)

```
/dgnet-process <slug> next
```

Read the frontmatter `stage`. Load the skill for the next stage. Run it. On completion (with user sign-off), update the frontmatter `stage` field to the new value. Report.

If the user explicitly names a stage (`/dgnet-process <slug> read`), jump to that stage regardless of current state. Permissive, not strict.

## The routing table

```
current stage         next skill to load
─────────────────────────────────────────
(no stage set)        dgnet-new-post (if no draft exists) OR dgnet-editor (if draft exists)
draft                 dgnet-editor
edited + artefact     dgnet-design-editor
edited + no artefact  dgnet-reader
design-edited         dgnet-reader
read                  polish pass (see below)
polished              dgnet-publish
published             (done — report + offer social drafts if not yet done)
```

## The polish pass

`polished` is the only stage without a dedicated skill. It's a merge:

1. Apply any fixes from `dgnet-reader`.
2. Re-run the voice grep (from `dgnet-publish` stage 6):
   ```bash
   grep -n "—" src/content/posts/<slug>.md public/artefacts/<slug>.html
   grep -niE "delve|leverage|robust|seamless|multifaceted|ultimately|in essence|that said|moreover|furthermore" \
     src/content/posts/<slug>.md public/artefacts/<slug>.html
   ```
3. Re-check mobile (iPhone + iPad) if the artefact changed.
4. Re-read the post once end to end, out loud.

If all clean, mark `polished`. If anything flags, fix in place.

## How to update the stage

After a review skill completes AND the user signs off, update the post's frontmatter:

```yaml
stage: edited  # or whatever the new stage is
```

Do this with `Edit` on the post file. Do not touch any other frontmatter field. Do not rewrite the post file.

**If the user doesn't sign off** (they push back on the pass's recommendations), leave the stage where it was. Stage changes require user confirmation.

## Artefact-aware routing

Check the post's frontmatter for an `artefact:` field before routing:

- Present → include `design-edited` stage.
- Absent → skip straight from `edited` to `read`.

Don't run `dgnet-design-editor` on a post with no artefact; it'll have nothing to do and the stage label will mislead.

## Reporting

At every stop (status mode or after an advance), report in this shape:

```
Post: <slug>
Title: "<title>"
Artefact: yes/no
Stage: <current>
Last skill run: <name>
Recommended next: <skill or action>
```

Keep it terse. This skill is plumbing, not prose.

## Publishing side: social assets

After `published`, the process isn't quite done. `dgnet-publish` offers to draft Twitter/LinkedIn text. If the user wants them:

1. Generate both, following the format in `dgnet-publish`.
2. Save drafts to `social-drafts/<slug>.md` (create the directory if it doesn't exist). This keeps drafts out of the Astro content tree but in the repo for reference.
3. Hand the text back to the user to post manually. Never auto-post.

## Non-negotiables

- **Never advance a stage without user sign-off.** The whole point of the stages is explicit checkpoints.
- **Never silently modify content.** This skill routes and marks state; the review skills do the actual work.
- **Never skip `dgnet-voice`.** Voice rules apply at every stage. Editor, design-editor, reader, and polish all assume voice rules are live.
- **Respect the permissive model.** If the user says "run reader now" on a draft that hasn't been edited, do it. Flag that you're skipping stages but don't refuse.

## What this skill does NOT do

- Write or edit prose. Hands off to review skills.
- Decide whether a post is good. The review skills decide that; this skill just routes.
- Own stage-1/2/3 of `dgnet-post` (clarify, decide, plan). `dgnet-post` owns idea-to-first-draft. This skill owns first-draft-to-ship.
- Create posts. `dgnet-new-post` does that.
