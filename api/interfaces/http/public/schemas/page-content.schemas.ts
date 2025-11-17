import { z } from 'zod';

export const PageContentResponseSchema = z.object({
  id: z.string().uuid(),
  pageKey: z.string(),
  pageTitle: z.string(),
  contentHtml: z.string().optional(),
  contentJson: z.any().optional(),
  sections: z.any().optional(),
  heroImageUrl: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export type PageContentResponse = z.infer<typeof PageContentResponseSchema>;
