import { FAQ } from '../../domain/faqs/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface FAQFilters {
  category?: string;
  businessModelSlug?: string;
  page?: number;
  limit?: number;
}

export interface AdminFAQFilters {
  category?: string;
  isActive?: boolean;
  businessModelId?: string;
  programId?: string;
  page?: number;
  limit?: number;
}

export interface CreateFAQInput {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  programId?: string;
  businessModelId?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateFAQInput {
  question?: string;
  answer?: string;
  category?: string;
  tags?: string[];
  programId?: string;
  businessModelId?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface IFAQRepository {
  listPublishedWithFilters(filters: FAQFilters): Promise<Result<{ faqs: FAQ[]; total: number }, Error>>;
  listAll(filters: AdminFAQFilters): Promise<Result<{ faqs: FAQ[]; total: number }, Error>>;
  findById(id: string): Promise<Result<FAQ | null, Error>>;
  create(input: CreateFAQInput): Promise<Result<FAQ, Error>>;
  update(id: string, input: UpdateFAQInput): Promise<Result<FAQ, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
