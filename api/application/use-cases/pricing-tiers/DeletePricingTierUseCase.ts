import { IPricingTierRepository } from '../../ports/IPricingTierRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeletePricingTierUseCase {
  constructor(private pricingTierRepository: IPricingTierRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.pricingTierRepository.delete(id);
  }
}
