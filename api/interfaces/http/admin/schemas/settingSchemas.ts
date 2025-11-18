import { z } from 'zod';

export const createSettingSchema = z.object({
  settingKey: z.string().min(1).max(100),
  settingValue: z.record(z.unknown()),
  settingType: z.enum(['site', 'email', 'social', 'analytics']),
  description: z.string().optional(),
});

export const updateSettingSchema = z.object({
  settingValue: z.record(z.unknown()),
  description: z.string().optional(),
});

export const listSettingsQuerySchema = z.object({
  type: z.enum(['site', 'email', 'social', 'analytics']).optional(),
});

export type CreateSettingDTO = z.infer<typeof createSettingSchema>;
export type UpdateSettingDTO = z.infer<typeof updateSettingSchema>;
export type ListSettingsQueryDTO = z.infer<typeof listSettingsQuerySchema>;
