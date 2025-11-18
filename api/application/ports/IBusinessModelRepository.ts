import { BusinessModel } from '../../domain/business-models/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface BusinessModelFilters {
  isActive?: boolean;
  showOnWeb?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateBusinessModelInput {
  internalCode: string;
  name: string;
  subtitle?: string;
  description: string;
  scheduleInfo?: string;
  targetAudience?: string;
  format?: string;
  featureTitle?: string;
  featureContent?: string;
  advantageTitle?: string;
  advantageContent?: string;
  benefitTitle?: string;
  benefitContent?: string;
  displayOrder?: number;
  isActive?: boolean;
  showOnWeb?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
}

export interface UpdateBusinessModelInput {
  internalCode?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  scheduleInfo?: string;
  targetAudience?: string;
  format?: string;
  featureTitle?: string;
  featureContent?: string;
  advantageTitle?: string;
  advantageContent?: string;
  benefitTitle?: string;
  benefitContent?: string;
  displayOrder?: number;
  isActive?: boolean;
  showOnWeb?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

export interface IBusinessModelRepository {
  listPublished(): Promise<Result<BusinessModel[], Error>>;
  findBySlug(slug: string): Promise<Result<BusinessModel | null, Error>>;
  listAll(filters: BusinessModelFilters): Promise<Result<{ businessModels: BusinessModel[]; total: number }, Error>>;
  findById(id: string): Promise<Result<BusinessModel | null, Error>>;
  findByInternalCode(internalCode: string): Promise<Result<BusinessModel | null, Error>>;
  create(input: CreateBusinessModelInput): Promise<Result<BusinessModel, Error>>;
  update(id: string, input: UpdateBusinessModelInput): Promise<Result<BusinessModel, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
