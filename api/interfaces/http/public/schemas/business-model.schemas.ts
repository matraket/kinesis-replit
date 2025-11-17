import { z } from 'zod';

export const BusinessModelResponseSchema = z.object({
  id: z.string().uuid(),
  internalCode: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  scheduleInfo: z.string().optional(),
  targetAudience: z.string().optional(),
  format: z.string().optional(),
  featureTitle: z.string().optional(),
  featureContent: z.string().optional(),
  advantageTitle: z.string().optional(),
  advantageContent: z.string().optional(),
  benefitTitle: z.string().optional(),
  benefitContent: z.string().optional(),
  displayOrder: z.number(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().optional(),
});

export const BusinessModelListResponseSchema = z.object({
  data: z.array(BusinessModelResponseSchema),
  count: z.number(),
});

export type BusinessModelResponse = z.infer<typeof BusinessModelResponseSchema>;
export type BusinessModelListResponse = z.infer<typeof BusinessModelListResponseSchema>;
