import { IBusinessModelRepository, BusinessModelFilters } from '../../ports/IBusinessModelRepository.js';
import { BusinessModel } from '../../../domain/business-models/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListBusinessModelsForAdminUseCase {
  constructor(private businessModelRepository: IBusinessModelRepository) {}

  async execute(filters: BusinessModelFilters): Promise<Result<{ businessModels: BusinessModel[]; total: number }, Error>> {
    return this.businessModelRepository.listAll(filters);
  }
}
