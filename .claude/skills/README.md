# davidgentile.net skills

Project-scoped Claude Code skills for maintaining the site. These live in the repo (not in `~/.claude/skills/`) so the conventions travel with the code and anyone with the repo can use them.

## The three skills

| Skill | When to invoke |
|---|---|
| `dgnet-new-post` | Starting a new post — scaffolds the markdown file with frontmatter and essay skeleton |
| `dgnet-new-artefact` | Building the interactive HTML piece of a post — enforces the visual system |
| `dgnet-publish` | Pre-flight checks, commit, push to deploy |

## Typical workflow

1. Idea strikes. Invoke `dgnet-new-post`. Draft the essay.
2. If the idea rewards it, invoke `dgnet-new-artefact`. Build the mechanism.
3. Take a hero screenshot manually from the running dev server (workflow in `dgnet-publish/SKILL.md`).
4. Invoke `dgnet-publish`. Commit + push. Deploy is automatic.

Target end-to-end time: 30 minutes per post. The skills exist to keep that target realistic by removing format-remembering overhead.

## On modifying these skills

Edit freely as the format evolves. Commit changes on their own so the site's convention history is legible. Suggested commit style: `Skills: <what changed>`.
