# davidgentile.net skills

Project-scoped Claude Code skills for maintaining the site. These live in the repo (not in `~/.claude/skills/`) so the conventions travel with the code and anyone with the repo can use them.

## The skills

| Skill | When to invoke |
|---|---|
| `dgnet-post` | **START HERE.** Orchestrates a whole post — clarify claim, decide artefact-or-not, plan beats, build, checkpoint, capture, publish. Calls the others internally. |
| `dgnet-new-post` | Mechanic: scaffolds the markdown file with frontmatter and essay skeleton. Called by `dgnet-post`. |
| `dgnet-new-artefact` | Mechanic: builds the interactive HTML piece, enforces the visual system. Called by `dgnet-post`. |
| `dgnet-capture` | Mechanic: drives the artefact through its phases and records hero PNG / social MP4+GIF. |
| `dgnet-publish` | Mechanic: pre-flight checks, commit, push to deploy. |

## Typical workflow

1. Idea strikes. Invoke `dgnet-post`. Answer its clarifying questions.
2. It plans the beats with you, scaffolds, then checkpoints mid-build for review.
3. Capture, publish. Deploy is automatic after push.

Target end-to-end time: 30 minutes per post. The skills exist to keep that target realistic by removing format-remembering overhead.

## On modifying these skills

Edit freely as the format evolves. Commit changes on their own so the site's convention history is legible. Suggested commit style: `Skills: <what changed>`.
