import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('CaloriesIn Editorial Team'),
    category: z.enum(['nutrition', 'weight-loss', 'meal-plans', 'guides']),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
