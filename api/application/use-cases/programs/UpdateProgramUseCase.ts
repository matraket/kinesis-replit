import { ProgramsRepository, UpdateProgramInput } from '../../ports/index.js';
import { Program } from '../../../domain/programs/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdateProgramUseCase {
  constructor(private programsRepository: ProgramsRepository) {}

  async execute(id: string, input: UpdateProgramInput): Promise<Result<Program, Error>> {
    const existingResult = await this.programsRepository.getProgramById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('Program not found'));
    }

    return this.programsRepository.update(id, input);
  }
}
