import { z } from 'zod';

export const createLegalPageSchema = z.object({
  pageType: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  version: z.string().min(1).max(20),
  effectiveDate: z.string().or(z.date()).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  isCurrent: z.boolean().optional(),
  slug: z.string().max(100).optional(),
});

export const updateLegalPageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  version: z.string().min(1).max(20).optional(),
  effectiveDate: z.string().or(z.date()).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }).optional(),
  isCurrent: z.boolean().optional(),
  slug: z.string().max(100).optional(),
});

export const listLegalPagesQuerySchema = z.object({
  pageType: z.string().optional(),
});

export type CreateLegalPageDTO = z.infer<typeof createLegalPageSchema>;
export type UpdateLegalPageDTO = z.infer<typeof updateLegalPageSchema>;
export type ListLegalPagesQueryDTO = z.infer<typeof listLegalPagesQuerySchema>;
