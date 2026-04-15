# davidgentile.net skills

Project-scoped Claude Code skills for maintaining the site. These live in the repo (not in `~/.claude/skills/`) so the conventions travel with the code and anyone with the repo can use them.

## The two orchestrators

End-to-end post lifecycle is split across two skills. Pick based on where you are:

| Skill | Owns |
|---|---|
| `dgnet-post` | **Idea → first draft.** Clarify claim, decide artefact-or-not, plan beats, build, mid-build checkpoints. Sets `stage: draft` and hands off. |
| `dgnet-process` | **First draft → shipped + social.** Stateful stage machine reading `stage` frontmatter. Routes per stage, checkpoints at every seam. |

[Getting Things Done)) - Wikipedia](https://en.wikipedia.org/wiki/Getting_Things_Done)))pedia.org/wiki/Getting_Things_Done))) any existing draft with `dgnet-process <slug>`.

## The stages (owned by `dgnet-process`)

```
draft ──► edited ──► design-edited ──► read ──► polished ──► distilled ──► published
                        (skip design-edited if no artefact)         (skip distilled if no artefact)
```

Each stage has a dedicated review skill. `dgnet-process` invokes them with your sign-off at every boundary.

## All skills

| Skill | Role |
|---|---|
| `dgnet-post` | Orchestrator, idea → draft |
| `dgnet-process` | Orchestrator, draft → shipped + social |
| `dgnet-voice` | Voice rules for all prose (load before any writing) |
| `dgnet-new-post` | Mechanic: scaffold markdown file |
| `dgnet-new-artefact` | Mechanic: scaffold interactive HTML piece |
| `dgnet-editor` | Review: ruthless prose copy-edit (stage: edited) |
| `dgnet-design-editor` | Review: ruthless artefact tightening (stage: design-edited) |
| `dgnet-beat` | Author: purpose-built ~5s silent film that distils the post's punch (stage: distilled, runs after polish) |
| `dgnet-reader` | Review: three-persona cold read (stage: read) |
| `dgnet-capture` | Mechanic: produces MP4 + hero PNG from artefact or beat |
| `dgnet-publish` | Mechanic: pre-flight, commit, push to deploy (stage: published) |
| `dgnet-social` | Producer: per-platform social drafts in `social-drafts/<slug>/` |

## Typical workflow

1. Idea → `dgnet-post`. Answer clarify/decide/plan/build checkpoints.
2. Draft lands with `stage: draft`. Hand off.
3. `dgnet-process <slug> next` → `dgnet-editor` runs → sign off → stage advances.
4. Repeat through `design-edited` (artefact), `read`, `polished`, `distilled` (beat + capture), `published`.
5. After publish, `dgnet-process` offers `dgnet-social` to draft the spoke assets.

Each stage change requires explicit user sign-off. Nothing silently advances.

## The hub-and-spoke asset model

The post is the hub. Every post that wants motion produces:

- `public/artefacts/<slug>.html` — the real interactive, teaches at its own pace
- `public/artefacts/<slug>.beat.html` — the purpose-built 5s film that punches
- `public/images/<slug>-beat.mp4` — captured from the beat file (social, homepage tile)
- `public/images/<slug>-hero.png` — captured from the beat's final frame (OG card, RSS, newsletter)

Posts without a beat fall back to a static hero + text-only social.

## On modifying these skills

Edit freely as the format evolves. Commit changes on their own so the site's convention history is legible. Suggested commit style: `Skills: <what changed>`.
