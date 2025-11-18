import { PricingTier } from '../../domain/pricing-tiers/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface PricingTierFilters {
  businessModelSlug?: string;
  programSlug?: string;
}

export interface AdminPricingTierFilters {
  programId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreatePricingTierInput {
  programId?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  sessionsIncluded?: number;
  validityDays?: number;
  maxStudents?: number;
  conditions?: string[];
  displayOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdatePricingTierInput {
  programId?: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  sessionsIncluded?: number;
  validityDays?: number;
  maxStudents?: number;
  conditions?: string[];
  displayOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface IPricingTierRepository {
  listPublished(filters: PricingTierFilters): Promise<Result<PricingTier[], Error>>;
  listAll(filters: AdminPricingTierFilters): Promise<Result<{ pricingTiers: PricingTier[]; total: number }, Error>>;
  findById(id: string): Promise<Result<PricingTier | null, Error>>;
  create(input: CreatePricingTierInput): Promise<Result<PricingTier, Error>>;
  update(id: string, input: UpdatePricingTierInput): Promise<Result<PricingTier, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
