import { IBusinessModelRepository } from '../../ports/IBusinessModelRepository.js';
import { BusinessModel } from '../../../domain/business-models/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetBusinessModelBySlug {
  constructor(private readonly businessModelRepository: IBusinessModelRepository) {}

  async execute(slug: string): Promise<Result<BusinessModel | null, Error>> {
    return this.businessModelRepository.findBySlug(slug);
  }
}
