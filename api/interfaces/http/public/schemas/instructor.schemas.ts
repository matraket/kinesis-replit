import { z } from 'zod';

export const InstructorResponseSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().optional(),
  role: z.string().optional(),
  tagline: z.string().optional(),
  bioSummary: z.string().optional(),
  bioFull: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  profileImageUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  seniorityLevel: z.number(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const InstructorListResponseSchema = z.object({
  data: z.array(InstructorResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

export const InstructorQuerySchema = z.object({
  featured: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  specialtyCode: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type InstructorResponse = z.infer<typeof InstructorResponseSchema>;
export type InstructorListResponse = z.infer<typeof InstructorListResponseSchema>;
export type InstructorQuery = z.infer<typeof InstructorQuerySchema>;
