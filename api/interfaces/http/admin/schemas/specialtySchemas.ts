import { z } from 'zod';

export const createSpecialtySchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateSpecialtySchema = z.object({
  code: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const listSpecialtiesQuerySchema = z.object({
  isActive: z.string().transform(val => val === 'true').optional(),
  category: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreateSpecialtyDTO = z.infer<typeof createSpecialtySchema>;
export type UpdateSpecialtyDTO = z.infer<typeof updateSpecialtySchema>;
export type ListSpecialtiesQueryDTO = z.infer<typeof listSpecialtiesQuerySchema>;
