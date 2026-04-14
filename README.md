# davidgentile.net

Personal site — short arguments and small interactive artefacts about AI, structure, and the intelligence interface.

## Stack

- [Astro 5](https://astro.build) — content collections + static build
- Markdown posts + raw HTML artefacts (iframed into posts)
- Vercel / Netlify for deploy (zero-config static build)

## Local dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static build → ./dist
npm run preview   # serve the built site
```

## Project layout

```
src/
  pages/
    index.astro         homepage: reverse-chron post list
    [...slug].astro     dynamic route rendering each post
    rss.xml.js          rss feed
  layouts/
    Base.astro          shell — OG tags, header, footer
  content/
    config.ts           post frontmatter schema
    posts/
      *.md              one post per file
public/
  artefacts/            single-file HTML artefacts, iframed into posts
  images/               hero images + og fallbacks
  styles/global.css     site-wide styles
  favicon.svg
```

## Publishing a new post

1. Build the artefact as a single-file HTML in `public/artefacts/<slug>.html`.
2. Drop the hero image in `public/images/<slug>-hero.png` (1200×675).
3. Create `src/content/posts/<slug>.md` with frontmatter:

   ```yaml
   ---
   title: "Post title"
   description: "One-line summary used for OG + listing."
   date: YYYY-MM-DD
   heroImage: "/images/<slug>-hero.png"
   artefact: "/artefacts/<slug>.html"
   artefactHeight: 900     # iframe px height (tune per artefact)
   tags: ["Intelligence interface"]
   ---

   Essay body here. 200–400 words. Markdown. Blockquotes for punchlines.
   ```

4. `git push` → Vercel/Netlify builds and deploys.

Each post lives at `davidgentile.net/<slug>`. The artefact is also directly linkable at `davidgentile.net/artefacts/<slug>`.

## Deploy

Point the domain at Vercel (recommended) or Netlify. Both auto-detect Astro and need zero configuration. Free tier is fine for this site's traffic profile forever.

## Philosophy

One post = one idea = one page. Headline, hero image, 200–400 words, one interactive artefact when the idea rewards it. Shipped when useful, not when polished.
