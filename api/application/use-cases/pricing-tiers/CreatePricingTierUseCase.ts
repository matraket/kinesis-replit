import { IPricingTierRepository, CreatePricingTierInput } from '../../ports/IPricingTierRepository.js';
import { PricingTier } from '../../../domain/pricing-tiers/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreatePricingTierUseCase {
  constructor(private pricingTierRepository: IPricingTierRepository) {}

  async execute(input: CreatePricingTierInput): Promise<Result<PricingTier, Error>> {
    return this.pricingTierRepository.create(input);
  }
}
