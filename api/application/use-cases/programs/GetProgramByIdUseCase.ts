import { ProgramsRepository } from '../../ports/index.js';
import { Program } from '../../../domain/programs/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class GetProgramByIdUseCase {
  constructor(private programsRepository: ProgramsRepository) {}

  async execute(id: string): Promise<Result<Program, Error>> {
    const result = await this.programsRepository.getProgramById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Program not found'));
    }

    return { ok: true, value: result.value };
  }
}
