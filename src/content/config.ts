import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Russell Fette'),
    postType: z.enum(['field-note', 'case-study', 'framework']).default('field-note'),
    topicCluster: z.string().optional(),
    ctaVariant: z.string().optional(),
    dominantClaim: z.string().optional(),
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
    pillar: z.number().int().min(1).max(3).optional(),
    pillarHub: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    clientStage: z.string().optional(),
    clientSize: z.string().optional(),
    engagementType: z.string().optional(),
    outcome: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    confidential: z.boolean().default(false),
    featured: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

const site = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).passthrough(),
});

export const collections = {
  blog,
  'case-studies': caseStudies,
  site,
};
