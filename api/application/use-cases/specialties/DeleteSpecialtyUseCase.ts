import { ISpecialtyRepository } from '../../ports/ISpecialtyRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.specialtyRepository.delete(id);
  }
}
