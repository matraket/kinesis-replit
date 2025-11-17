import { FAQ } from '../../domain/faqs/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface FAQFilters {
  category?: string;
  businessModelSlug?: string;
  page?: number;
  limit?: number;
}

export interface IFAQRepository {
  listPublishedWithFilters(filters: FAQFilters): Promise<Result<{ faqs: FAQ[]; total: number }, Error>>;
}
