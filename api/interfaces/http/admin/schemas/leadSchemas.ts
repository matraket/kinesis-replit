import { z } from 'zod';

export const leadTypeEnum = z.enum(['contact', 'pre_enrollment', 'elite_booking', 'newsletter']);
export const leadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']);

export const listLeadsQuerySchema = z.object({
  leadType: leadTypeEnum.optional(),
  status: leadStatusEnum.optional(),
  from: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  to: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  source: z.string().optional(),
  campaign: z.string().optional(),
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 50),
});

export const updateLeadStatusSchema = z.object({
  leadStatus: leadStatusEnum,
  notes: z.string().optional(),
  contactedBy: z.string().uuid().optional(),
});

export const updateLeadNotesSchema = z.object({
  notes: z.string().min(1),
});

export type ListLeadsQueryDTO = z.infer<typeof listLeadsQuerySchema>;
export type UpdateLeadStatusDTO = z.infer<typeof updateLeadStatusSchema>;
export type UpdateLeadNotesDTO = z.infer<typeof updateLeadNotesSchema>;
