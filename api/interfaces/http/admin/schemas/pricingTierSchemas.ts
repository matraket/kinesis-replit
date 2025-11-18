import { z } from 'zod';

export const createPricingTierSchema = z.object({
  programId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  sessionsIncluded: z.number().int().min(0).optional(),
  validityDays: z.number().int().min(0).optional(),
  maxStudents: z.number().int().min(0).optional(),
  conditions: z.array(z.string()).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const updatePricingTierSchema = createPricingTierSchema.partial();

export const listPricingTiersQuerySchema = z.object({
  programId: z.string().uuid().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreatePricingTierDTO = z.infer<typeof createPricingTierSchema>;
export type UpdatePricingTierDTO = z.infer<typeof updatePricingTierSchema>;
export type ListPricingTiersQueryDTO = z.infer<typeof listPricingTiersQuerySchema>;
