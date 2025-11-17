import { BusinessModel } from '../../domain/business-models/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface IBusinessModelRepository {
  listPublished(): Promise<Result<BusinessModel[], Error>>;
  findBySlug(slug: string): Promise<Result<BusinessModel | null, Error>>;
}
