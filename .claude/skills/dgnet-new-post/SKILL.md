---
name: dgnet-new-post
description: Scaffold a new post for davidgentile.net. Use when the user wants to draft, create, start, or write a new post, note, essay, or entry on the site. Also triggers on "new post", "add a post", "write about X" when working in the davidgentile-net repo.
---

# Creating a new post for davidgentile.net

**Read `/AUDIENCE.md` first.** It describes the reader this post has to land with. If the idea you're about to scaffold doesn't fit that reader, stop and push back before creating files.

This skill produces a single-idea post that fits the site's established format. Each post is one page with three zones: narrow header, wide interactive artefact, narrow essay. This skill creates the markdown file. Use `dgnet-new-artefact` separately to build the interactive piece.

## The format, non-negotiable

- **One idea per post.** If it splits into two ideas, it's two posts. Resist combining.
- **Essay length: 180–400 words.** Shorter is better. Longer is always a sign the idea isn't sharp yet.
- **Structure: argument → mechanism → blockquote → implication.** Not every post needs every beat, but most do.
- **One interactive artefact when the idea rewards playing with it.** Not every post needs one — some ideas are essay-only. Forcing an artefact onto an idea that doesn't need it burns build time for zero reader payoff.
- **No hand-holding of the artefact in the essay.** The artefact sits above the essay and speaks for itself. Don't write "play with the widget below and click the button on the right" — that's the artefact's job, not the prose's.

## The voice

Direct. Declarative. Zero filler. No "in this post I'll explore" openers. No "hopefully this was useful" closers. One blockquote per post, reserved for the idea's sharpest sentence — the one you'd screenshot. Italic emphasis on verbs and concrete nouns, not adjectives. Never "I think" or "in my opinion" — if it's in the post, it's a claim.

Good example opening: *"The friction tax isn't the work. It's the re-reading."*

Bad example opening: *"In this post, I want to explore the hidden cost of unstructured information in modern workflows."*

## Steps

1. **Get the idea from the user.** Ask: title, one-line description, and whether it needs an interactive artefact. If they haven't thought about whether it needs an artefact, ask: *"Is the argument a claim (essay-only works) or a mechanism (interactive makes it feel real)?"*

2. **Derive the slug** from the title: lowercase, hyphenated, no stop words if it makes the slug cleaner. E.g., "The friction tax of unstructured work" → `friction-tax`. Keep slugs short, 1–3 words ideal.

3. **Create a `post/<slug>` branch and switch to it.** Every post lives on its own branch until it's ready to go live. Vercel auto-deploys branches as preview URLs, so the whole review loop happens on the branch. Main stays clean; only the merge is the "go live" moment.

   ```bash
   git checkout main
   git pull --ff-only
   git checkout -b post/<slug>
   ```

   If the branch already exists (resumed work), check it out instead: `git checkout post/<slug>`. If the working tree is dirty when this step runs, stop and ask the user how to handle it. Don't stash silently.

4. **Create the file** at `src/content/posts/<slug>.md` with the frontmatter template below.

5. **Write or draft the essay** following the voice rules above. If the user has notes, distill them; don't copy their draft verbatim if it has filler. Read aloud the opening sentence before committing. If it sounds like a LinkedIn post, rewrite it.

6. **Stop at the essay.** Do not build the artefact inside this skill (that's `dgnet-new-artefact`). Do not commit (that's `dgnet-publish`). The branch is the workspace; commits during editing/design stages are normal, but the merge to main only happens at publish.

## Frontmatter template

```yaml
---
title: "Short, declarative title. No colon-subtitle-pattern."
description: "One-line summary — this becomes the OG/Twitter preview description. 140 chars or less. Lead with the claim, not the context."
date: YYYY-MM-DD
heroImage: "/images/<slug>/hero.png"    # captured from beat's final frame (see dgnet-beat)
artefact: "/artefacts/<slug>/index.html" # explicit; dev server 404s on trailing-slash paths under trailingSlash:'never'. Omit if essay-only.
artefactHeight: 820                     # iframe height; tune after artefact is built
artefactCaption: "Click the 'Next' button to walk through N phases." # italic figcaption above the iframe; name the actual control the reader must click
tags: ["Intelligence interface"]        # first tag is the post kicker — usually this one
---
```

## Essay template (delete before shipping)

```markdown
[Opening claim. One or two short sentences. State the thesis without preamble.]

[Supporting paragraph. Evidence or mechanism. Name things concretely: *GTD was ontology engineering in disguise.* Avoid abstractions when a concrete example would land harder.]

> [The blockquote. This is the screenshotable sentence. Make it worth isolating.]

[Closing. Implication, not summary. What changes because of the claim? Leave the reader with the stakes, not a recap.]
```

## Common mistakes to catch

- **Essay recaps the artefact.** If paragraphs describe what the interactive does, cut them. The reader can see it.
- **Two ideas in one post.** If the closing paragraph introduces a new claim, it's a second post. Pull it out.
- **Hedging language.** "Perhaps," "somewhat," "could be argued" — delete. Make the claim or don't write it.
- **Filler openers.** "It's no secret that…", "In today's fast-paced world…", "Many of us struggle with…" — delete the entire paragraph if it starts this way.
- **Slug too long.** `the-friction-tax-of-unstructured-work` is bad. `friction-tax` is right.

## After scaffolding

Report to the user: branch name (`post/<slug>`), file path created, current word count of the draft, and the next suggested step (build artefact with `dgnet-new-artefact`, or if essay-only, skip to `dgnet-publish`). Remind the user that all further work stays on the branch until `dgnet-publish` merges it to main.
