import { z } from 'zod';

export const createProgramSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  subtitle: z.string().optional(),
  descriptionShort: z.string().optional(),
  descriptionFull: z.string().optional(),
  businessModelId: z.string().uuid().optional(),
  specialtyId: z.string().uuid().optional(),
  durationMinutes: z.number().int().min(0).optional(),
  sessionsPerWeek: z.number().int().min(0).optional(),
  minStudents: z.number().int().min(0).optional(),
  maxStudents: z.number().int().min(0).optional(),
  minAge: z.number().int().min(0).optional(),
  maxAge: z.number().int().min(0).optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).optional(),
  pricePerSession: z.number().min(0).optional(),
  priceMonthly: z.number().min(0).optional(),
  priceQuarterly: z.number().min(0).optional(),
  scheduleDescription: z.string().optional(),
  featuredImageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  showOnWeb: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  allowOnlineEnrollment: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateProgramSchema = createProgramSchema.partial();

export const listProgramsQuerySchema = z.object({
  businessModelId: z.string().uuid().optional(),
  specialtyId: z.string().uuid().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreateProgramDTO = z.infer<typeof createProgramSchema>;
export type UpdateProgramDTO = z.infer<typeof updateProgramSchema>;
export type ListProgramsQueryDTO = z.infer<typeof listProgramsQuerySchema>;
