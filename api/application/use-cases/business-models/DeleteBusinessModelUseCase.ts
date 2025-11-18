import { IBusinessModelRepository } from '../../ports/IBusinessModelRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteBusinessModelUseCase {
  constructor(private businessModelRepository: IBusinessModelRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.businessModelRepository.delete(id);
  }
}
