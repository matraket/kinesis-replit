import { Setting, CreateSettingInput, UpdateSettingInput } from '../../domain/settings/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface ISettingsRepository {
  list(type?: string): Promise<Result<Setting[], Error>>;
  
  findByKey(key: string): Promise<Result<Setting | null, Error>>;
  
  create(input: CreateSettingInput): Promise<Result<Setting, Error>>;
  
  updateByKey(key: string, input: UpdateSettingInput): Promise<Result<Setting, Error>>;
}
