import { PricingTier } from '../../domain/pricing-tiers/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface PricingTierFilters {
  businessModelSlug?: string;
  programSlug?: string;
}

export interface IPricingTierRepository {
  listPublished(filters: PricingTierFilters): Promise<Result<PricingTier[], Error>>;
}
