import { IPricingTierRepository, UpdatePricingTierInput } from '../../ports/IPricingTierRepository.js';
import { PricingTier } from '../../../domain/pricing-tiers/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdatePricingTierUseCase {
  constructor(private pricingTierRepository: IPricingTierRepository) {}

  async execute(id: string, input: UpdatePricingTierInput): Promise<Result<PricingTier, Error>> {
    const existingResult = await this.pricingTierRepository.findById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('Pricing tier not found'));
    }

    return this.pricingTierRepository.update(id, input);
  }
}
