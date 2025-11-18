import { z } from 'zod';

export const createBusinessModelSchema = z.object({
  internalCode: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  scheduleInfo: z.string().optional(),
  targetAudience: z.string().optional(),
  format: z.string().optional(),
  featureTitle: z.string().optional(),
  featureContent: z.string().optional(),
  advantageTitle: z.string().optional(),
  advantageContent: z.string().optional(),
  benefitTitle: z.string().optional(),
  benefitContent: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().min(1),
});

export const updateBusinessModelSchema = z.object({
  internalCode: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  subtitle: z.string().optional(),
  description: z.string().min(1).optional(),
  scheduleInfo: z.string().optional(),
  targetAudience: z.string().optional(),
  format: z.string().optional(),
  featureTitle: z.string().optional(),
  featureContent: z.string().optional(),
  advantageTitle: z.string().optional(),
  advantageContent: z.string().optional(),
  benefitTitle: z.string().optional(),
  benefitContent: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().min(1).optional(),
});

export const listBusinessModelsQuerySchema = z.object({
  isActive: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreateBusinessModelDTO = z.infer<typeof createBusinessModelSchema>;
export type UpdateBusinessModelDTO = z.infer<typeof updateBusinessModelSchema>;
export type ListBusinessModelsQueryDTO = z.infer<typeof listBusinessModelsQuerySchema>;
