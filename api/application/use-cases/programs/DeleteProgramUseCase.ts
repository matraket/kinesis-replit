import { ProgramsRepository } from '../../ports/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteProgramUseCase {
  constructor(private programsRepository: ProgramsRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.programsRepository.delete(id);
  }
}
