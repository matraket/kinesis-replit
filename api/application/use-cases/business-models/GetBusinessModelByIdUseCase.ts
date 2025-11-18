import { IBusinessModelRepository } from '../../ports/IBusinessModelRepository.js';
import { BusinessModel } from '../../../domain/business-models/index.js';
import { Result, Ok, Err } from '../../../../shared/types/Result.js';

export class GetBusinessModelByIdUseCase {
  constructor(private businessModelRepository: IBusinessModelRepository) {}

  async execute(id: string): Promise<Result<BusinessModel, Error>> {
    const result = await this.businessModelRepository.findById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Business model not found'));
    }

    return Ok(result.value);
  }
}
