import { z } from 'zod';

export const ProgramResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  descriptionShort: z.string().optional(),
  descriptionFull: z.string().optional(),
  businessModelId: z.string().uuid().optional(),
  specialtyId: z.string().uuid().optional(),
  durationMinutes: z.number().optional(),
  sessionsPerWeek: z.number().optional(),
  minStudents: z.number(),
  maxStudents: z.number(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).optional(),
  pricePerSession: z.number().optional(),
  priceMonthly: z.number().optional(),
  priceQuarterly: z.number().optional(),
  scheduleDescription: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  displayOrder: z.number(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const ProgramListResponseSchema = z.object({
  data: z.array(ProgramResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

export const ProgramQuerySchema = z.object({
  businessModelSlug: z.string().optional(),
  specialtyCode: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type ProgramResponse = z.infer<typeof ProgramResponseSchema>;
export type ProgramListResponse = z.infer<typeof ProgramListResponseSchema>;
export type ProgramQuery = z.infer<typeof ProgramQuerySchema>;
