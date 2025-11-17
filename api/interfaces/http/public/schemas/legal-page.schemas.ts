import { z } from 'zod';

export const LegalPageResponseSchema = z.object({
  id: z.string().uuid(),
  pageType: z.string(),
  title: z.string(),
  content: z.string(),
  version: z.string(),
  effectiveDate: z.string(),
  slug: z.string().optional(),
});

export const LegalPageListResponseSchema = z.object({
  data: z.array(LegalPageResponseSchema),
  count: z.number(),
});

export type LegalPageResponse = z.infer<typeof LegalPageResponseSchema>;
export type LegalPageListResponse = z.infer<typeof LegalPageListResponseSchema>;
