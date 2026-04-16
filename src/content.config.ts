import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),       // e.g. "/images/friction-tax/hero.png"
    beatImage: z.string().optional(),
    beatMov: z.string().optional(),
    artefact: z.string().optional(),        // e.g. "/artefacts/friction-tax/index.html" — used by homepage preview
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    stage: z.enum(['draft', 'edited', 'design-edited', 'read', 'polished', 'distilled', 'published']).optional(),
  }),
});

export const collections = { posts };
