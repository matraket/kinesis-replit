import { z } from 'zod';

export const createInstructorSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  tagline: z.string().optional(),
  bioSummary: z.string().optional(),
  bioFull: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  profileImageUrl: z.string().url().optional(),
  heroImageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  showOnWeb: z.boolean().optional(),
  showInTeamPage: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  seniorityLevel: z.number().int().min(0).optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateInstructorSchema = createInstructorSchema.partial();

export const listInstructorsQuerySchema = z.object({
  isActive: z.string().transform(val => val === 'true').optional(),
  showOnWeb: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type CreateInstructorDTO = z.infer<typeof createInstructorSchema>;
export type UpdateInstructorDTO = z.infer<typeof updateInstructorSchema>;
export type ListInstructorsQueryDTO = z.infer<typeof listInstructorsQuerySchema>;
