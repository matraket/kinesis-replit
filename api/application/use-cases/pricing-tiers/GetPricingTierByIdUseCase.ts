import { IPricingTierRepository } from '../../ports/IPricingTierRepository.js';
import { PricingTier } from '../../../domain/pricing-tiers/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class GetPricingTierByIdUseCase {
  constructor(private pricingTierRepository: IPricingTierRepository) {}

  async execute(id: string): Promise<Result<PricingTier, Error>> {
    const result = await this.pricingTierRepository.findById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Pricing tier not found'));
    }

    return { ok: true, value: result.value };
  }
}
