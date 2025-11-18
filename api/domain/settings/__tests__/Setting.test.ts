import { describe, it, expect } from 'vitest';
import { createSetting, updateSetting, type CreateSettingInput, type UpdateSettingInput } from '../Setting.js';

describe('Setting Domain Entity', () => {
  describe('createSetting', () => {
    it('should create a setting with all required fields', () => {
      const input: CreateSettingInput = {
        settingKey: 'site.title',
        settingValue: { en: 'Kinesis Dance Studio', es: 'Estudio de Danza Kinesis' },
        settingType: 'site',
      };

      const setting = createSetting('test-setting-id', input);

      expect(setting.id).toBe('test-setting-id');
      expect(setting.settingKey).toBe('site.title');
      expect(setting.settingValue).toEqual({ en: 'Kinesis Dance Studio', es: 'Estudio de Danza Kinesis' });
      expect(setting.settingType).toBe('site');
      expect(setting.updatedAt).toBeInstanceOf(Date);
      expect(setting.description).toBeUndefined();
      expect(setting.updatedBy).toBeUndefined();
    });

    it('should create a setting with optional description', () => {
      const input: CreateSettingInput = {
        settingKey: 'email.smtp_host',
        settingValue: { host: 'smtp.example.com', port: 587 },
        settingType: 'email',
        description: 'SMTP server configuration',
      };

      const setting = createSetting('email-setting-id', input);

      expect(setting.description).toBe('SMTP server configuration');
    });

    it('should create a setting with updatedBy field', () => {
      const input: CreateSettingInput = {
        settingKey: 'analytics.google_id',
        settingValue: { id: 'GA-123456789' },
        settingType: 'analytics',
        updatedBy: 'admin-user-123',
      };

      const setting = createSetting('analytics-setting-id', input);

      expect(setting.updatedBy).toBe('admin-user-123');
    });

    it('should handle complex JSON value structures', () => {
      const complexValue = {
        primary: { color: '#FF5733', shade: 'vibrant' },
        secondary: { color: '#33FF57', shade: 'calm' },
        fonts: ['Roboto', 'Arial', 'sans-serif'],
        metadata: { version: 2, lastUpdated: '2025-11-18' },
      };

      const input: CreateSettingInput = {
        settingKey: 'site.theme',
        settingValue: complexValue,
        settingType: 'site',
      };

      const setting = createSetting('theme-setting-id', input);

      expect(setting.settingValue).toEqual(complexValue);
      expect(setting.settingValue.primary).toEqual({ color: '#FF5733', shade: 'vibrant' });
    });

    it('should support all setting types', () => {
      const types: Array<'site' | 'email' | 'social' | 'analytics'> = ['site', 'email', 'social', 'analytics'];

      types.forEach((type) => {
        const input: CreateSettingInput = {
          settingKey: `test.${type}`,
          settingValue: { test: true },
          settingType: type,
        };

        const setting = createSetting(`${type}-id`, input);
        expect(setting.settingType).toBe(type);
      });
    });
  });

  describe('updateSetting', () => {
    const existingSetting = createSetting('existing-id', {
      settingKey: 'site.contact_email',
      settingValue: { email: 'old@example.com', displayName: 'Old Contact' },
      settingType: 'site',
      description: 'Contact email for the site',
      updatedBy: 'admin-1',
    });

    it('should update settingValue and preserve other fields', () => {
      const updateInput: UpdateSettingInput = {
        settingValue: { email: 'new@example.com', displayName: 'New Contact' },
      };

      const updated = updateSetting(existingSetting, updateInput);

      expect(updated.settingValue).toEqual({ email: 'new@example.com', displayName: 'New Contact' });
      expect(updated.settingKey).toBe('site.contact_email');
      expect(updated.settingType).toBe('site');
      expect(updated.description).toBe('Contact email for the site');
      expect(updated.updatedAt).toBeInstanceOf(Date);
      expect(updated.updatedAt.getTime()).toBeGreaterThan(existingSetting.updatedAt.getTime() - 1000);
    });

    it('should update description when provided', () => {
      const updateInput: UpdateSettingInput = {
        settingValue: { email: 'updated@example.com' },
        description: 'Updated contact email configuration',
      };

      const updated = updateSetting(existingSetting, updateInput);

      expect(updated.description).toBe('Updated contact email configuration');
    });

    it('should clear description when explicitly set to undefined', () => {
      const updateInput: UpdateSettingInput = {
        settingValue: { email: 'test@example.com' },
        description: undefined,
      };

      const updated = updateSetting(existingSetting, updateInput);

      expect(updated.description).toBeUndefined();
    });

    it('should update updatedBy field', () => {
      const updateInput: UpdateSettingInput = {
        settingValue: { email: 'admin@example.com' },
        updatedBy: 'admin-2',
      };

      const updated = updateSetting(existingSetting, updateInput);

      expect(updated.updatedBy).toBe('admin-2');
    });

    it('should preserve updatedBy when not provided in update', () => {
      const updateInput: UpdateSettingInput = {
        settingValue: { email: 'noupdate@example.com' },
      };

      const updated = updateSetting(existingSetting, updateInput);

      expect(updated.updatedBy).toBe('admin-1');
    });

    it('should update all mutable fields at once', () => {
      const newValue = { 
        email: 'complete@example.com', 
        displayName: 'Complete Update',
        verified: true,
      };
      
      const updateInput: UpdateSettingInput = {
        settingValue: newValue,
        description: 'Completely updated setting',
        updatedBy: 'super-admin',
      };

      const updated = updateSetting(existingSetting, updateInput);

      expect(updated.settingValue).toEqual(newValue);
      expect(updated.description).toBe('Completely updated setting');
      expect(updated.updatedBy).toBe('super-admin');
      expect(updated.id).toBe(existingSetting.id);
      expect(updated.settingKey).toBe(existingSetting.settingKey);
      expect(updated.settingType).toBe(existingSetting.settingType);
    });

    it('should update timestamp on every update', () => {
      const originalTime = existingSetting.updatedAt.getTime();
      
      const updateInput: UpdateSettingInput = {
        settingValue: { email: 'timestamp@example.com' },
      };

      const updated = updateSetting(existingSetting, updateInput);
      const updatedTime = updated.updatedAt.getTime();

      expect(updatedTime).toBeGreaterThanOrEqual(originalTime);
    });
  });
});
