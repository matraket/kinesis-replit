import { z } from 'zod';

const publicationStatusEnum = z.enum(['draft', 'published', 'archived']);

const pageSectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number(),
  metadata: z.record(z.any()).optional(),
});

export const createPageContentSchema = z.object({
  pageKey: z.string().min(1).max(100),
  pageTitle: z.string().min(1).max(200),
  contentHtml: z.string().optional(),
  contentJson: z.record(z.any()).optional(),
  sections: z.array(pageSectionSchema).optional(),
  heroImageUrl: z.string().url().optional(),
  galleryImages: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
  status: publicationStatusEnum.optional(),
  slug: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().url().optional(),
});

export const updatePageContentSchema = z.object({
  pageKey: z.string().min(1).max(100).optional(),
  pageTitle: z.string().min(1).max(200).optional(),
  contentHtml: z.string().optional(),
  contentJson: z.record(z.any()).optional(),
  sections: z.array(pageSectionSchema).optional(),
  heroImageUrl: z.string().url().optional(),
  galleryImages: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
  status: publicationStatusEnum.optional(),
  slug: z.string().min(1).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().url().optional(),
});

export const listPagesQuerySchema = z.object({
  status: publicationStatusEnum.optional(),
  pageKey: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreatePageContentDTO = z.infer<typeof createPageContentSchema>;
export type UpdatePageContentDTO = z.infer<typeof updatePageContentSchema>;
export type ListPagesQueryDTO = z.infer<typeof listPagesQuerySchema>;
