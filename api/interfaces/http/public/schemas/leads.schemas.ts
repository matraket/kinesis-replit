import { z } from 'zod';

const baseLeadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  message: z.string().max(2000).optional(),
  acceptsMarketing: z.boolean().optional(),
  acceptsTerms: z.boolean().optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
});

export const contactLeadSchema = baseLeadSchema.extend({
  message: z.string().min(1).max(2000),
});

export const preEnrollmentLeadSchema = baseLeadSchema.extend({
  studentName: z.string().min(1).max(200),
  studentAge: z.number().int().min(3).max(100),
  previousExperience: z.string().max(500).optional(),
  interestedInPrograms: z.array(z.string()).optional(),
  preferredSchedule: z.string().max(255).optional(),
});

export const eliteBookingLeadSchema = baseLeadSchema.extend({
  preferredDate: z.string().or(z.date()).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  preferredTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  sessionType: z.enum(['individual', 'couple', 'group']).optional(),
  message: z.string().max(2000).optional(),
});

export const weddingLeadSchema = baseLeadSchema.extend({
  preferredDate: z.string().or(z.date()).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  preferredTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  sessionType: z.literal('couple').optional(),
  message: z.string().max(2000).optional(),
});

export type ContactLeadDTO = z.infer<typeof contactLeadSchema>;
export type PreEnrollmentLeadDTO = z.infer<typeof preEnrollmentLeadSchema>;
export type EliteBookingLeadDTO = z.infer<typeof eliteBookingLeadSchema>;
export type WeddingLeadDTO = z.infer<typeof weddingLeadSchema>;
