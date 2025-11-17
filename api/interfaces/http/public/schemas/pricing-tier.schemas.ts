import { z } from 'zod';

export const PricingTierResponseSchema = z.object({
  id: z.string().uuid(),
  programId: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  originalPrice: z.number().optional(),
  sessionsIncluded: z.number().optional(),
  validityDays: z.number().optional(),
  maxStudents: z.number().optional(),
  conditions: z.array(z.string()).optional(),
  displayOrder: z.number(),
  isFeatured: z.boolean(),
});

export const PricingTierListResponseSchema = z.object({
  data: z.array(PricingTierResponseSchema),
  count: z.number(),
});

export const PricingTierQuerySchema = z.object({
  businessModelSlug: z.string().optional(),
  programSlug: z.string().optional(),
});

export type PricingTierResponse = z.infer<typeof PricingTierResponseSchema>;
export type PricingTierListResponse = z.infer<typeof PricingTierListResponseSchema>;
export type PricingTierQuery = z.infer<typeof PricingTierQuerySchema>;
