import { IPricingTierRepository, PricingTierFilters } from '../../ports/IPricingTierRepository.js';
import { PricingTier } from '../../../domain/pricing-tiers/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListPricingTiersForPublicSite {
  constructor(private readonly pricingTierRepository: IPricingTierRepository) {}

  async execute(filters: PricingTierFilters): Promise<Result<PricingTier[], Error>> {
    return this.pricingTierRepository.listPublished(filters);
  }
}
