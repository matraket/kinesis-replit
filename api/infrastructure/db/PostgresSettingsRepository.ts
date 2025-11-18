import { randomUUID } from 'crypto';
import { ISettingsRepository } from '../../application/ports/ISettingsRepository.js';
import { Setting, CreateSettingInput, UpdateSettingInput, createSetting, updateSetting } from '../../domain/settings/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';

export class PostgresSettingsRepository implements ISettingsRepository {
  async list(type?: string): Promise<Result<Setting[], Error>> {
    try {
      const pool = getDbPool();
      
      let query = `
        SELECT 
          id,
          setting_key as "settingKey",
          setting_value as "settingValue",
          setting_type as "settingType",
          description,
          updated_at as "updatedAt",
          updated_by as "updatedBy"
        FROM settings
      `;
      
      const params: any[] = [];
      
      if (type) {
        query += ` WHERE setting_type = $1`;
        params.push(type);
      }
      
      query += ` ORDER BY setting_key`;
      
      const result = await pool.query(query, params);
      
      const settings: Setting[] = result.rows.map((row) => ({
        ...row,
        updatedAt: new Date(row.updatedAt),
      }));
      
      return Ok(settings);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing settings'));
    }
  }

  async findByKey(key: string): Promise<Result<Setting | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id,
          setting_key as "settingKey",
          setting_value as "settingValue",
          setting_type as "settingType",
          description,
          updated_at as "updatedAt",
          updated_by as "updatedBy"
        FROM settings
        WHERE setting_key = $1`,
        [key]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const setting: Setting = {
        ...row,
        updatedAt: new Date(row.updatedAt),
      };

      return Ok(setting);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding setting by key'));
    }
  }

  async create(input: CreateSettingInput): Promise<Result<Setting, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const setting = createSetting(id, input);

      await pool.query(
        `INSERT INTO settings (
          id, setting_key, setting_value, setting_type, description, updated_at, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          setting.id,
          setting.settingKey,
          JSON.stringify(setting.settingValue),
          setting.settingType,
          setting.description,
          setting.updatedAt,
          setting.updatedBy,
        ]
      );

      return Ok(setting);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating setting'));
    }
  }

  async updateByKey(key: string, input: UpdateSettingInput): Promise<Result<Setting, Error>> {
    try {
      const pool = getDbPool();
      
      const existingResult = await this.findByKey(key);
      if (existingResult.isErr()) {
        return existingResult;
      }
      
      const existing = existingResult.value;
      if (!existing) {
        return Err(new Error(`Setting with key ${key} not found`));
      }

      const updated = updateSetting(existing, input);

      await pool.query(
        `UPDATE settings 
        SET setting_value = $1, description = $2, updated_at = $3, updated_by = $4
        WHERE setting_key = $5`,
        [
          JSON.stringify(updated.settingValue),
          updated.description,
          updated.updatedAt,
          updated.updatedBy,
          key,
        ]
      );

      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating setting'));
    }
  }
}
