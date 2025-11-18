export type SettingType = 'site' | 'email' | 'social' | 'analytics';

export interface Setting {
  id: string;
  settingKey: string;
  settingValue: Record<string, unknown>;
  settingType: SettingType;
  description?: string;
  updatedAt: Date;
  updatedBy?: string;
}

export interface CreateSettingInput {
  settingKey: string;
  settingValue: Record<string, unknown>;
  settingType: SettingType;
  description?: string;
  updatedBy?: string;
}

export interface UpdateSettingInput {
  settingValue: Record<string, unknown>;
  description?: string;
  updatedBy?: string;
}

export function createSetting(id: string, input: CreateSettingInput): Setting {
  return {
    id,
    settingKey: input.settingKey,
    settingValue: input.settingValue,
    settingType: input.settingType,
    description: input.description,
    updatedAt: new Date(),
    updatedBy: input.updatedBy,
  };
}

export function updateSetting(existing: Setting, input: UpdateSettingInput): Setting {
  return {
    ...existing,
    settingValue: input.settingValue,
    description: input.description !== undefined ? input.description : existing.description,
    updatedAt: new Date(),
    updatedBy: input.updatedBy || existing.updatedBy,
  };
}
