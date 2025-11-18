import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  programId: z.string().uuid().optional(),
  businessModelId: z.string().uuid().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateFaqSchema = z.object({
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  programId: z.string().uuid().optional(),
  businessModelId: z.string().uuid().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const listFaqsQuerySchema = z.object({
  isActive: z.string().transform(val => val === 'true').optional(),
  category: z.string().optional(),
  businessModelId: z.string().uuid().optional(),
  programId: z.string().uuid().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreateFaqDTO = z.infer<typeof createFaqSchema>;
export type UpdateFaqDTO = z.infer<typeof updateFaqSchema>;
export type ListFaqsQueryDTO = z.infer<typeof listFaqsQuerySchema>;
