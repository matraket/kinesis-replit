import { IBusinessModelRepository } from '../../ports/IBusinessModelRepository.js';
import { BusinessModel } from '../../../domain/business-models/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListBusinessModelsForPublicSite {
  constructor(private readonly businessModelRepository: IBusinessModelRepository) {}

  async execute(): Promise<Result<BusinessModel[], Error>> {
    return this.businessModelRepository.listPublished();
  }
}
