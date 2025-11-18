import { IPricingTierRepository, AdminPricingTierFilters } from '../../ports/IPricingTierRepository.js';
import { PricingTier } from '../../../domain/pricing-tiers/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListPricingTiersUseCase {
  constructor(private pricingTierRepository: IPricingTierRepository) {}

  async execute(filters: AdminPricingTierFilters): Promise<Result<{ pricingTiers: PricingTier[]; total: number }, Error>> {
    return this.pricingTierRepository.listAll(filters);
  }
}
