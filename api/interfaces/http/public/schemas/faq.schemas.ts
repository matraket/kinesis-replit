import { z } from 'zod';

export const FAQResponseSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  displayOrder: z.number(),
  isFeatured: z.boolean(),
});

export const FAQListResponseSchema = z.object({
  data: z.array(FAQResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

export const FAQQuerySchema = z.object({
  category: z.string().optional(),
  businessModelSlug: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type FAQResponse = z.infer<typeof FAQResponseSchema>;
export type FAQListResponse = z.infer<typeof FAQListResponseSchema>;
export type FAQQuery = z.infer<typeof FAQQuerySchema>;
