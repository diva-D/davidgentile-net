import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),       // e.g. "/images/friction-tax-hero.png"
    artefact: z.string().optional(),        // e.g. "/artefacts/friction-tax.html"
    artefactHeight: z.number().optional(),  // iframe height in px
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    stage: z.enum(['draft', 'edited', 'design-edited', 'read', 'polished', 'distilled', 'published']).optional(),
  }),
});

export const collections = { posts };
