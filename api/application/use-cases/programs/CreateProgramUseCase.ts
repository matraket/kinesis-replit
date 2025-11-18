import { ProgramsRepository, CreateProgramInput } from '../../ports/index.js';
import { Program } from '../../../domain/programs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateProgramUseCase {
  constructor(private programsRepository: ProgramsRepository) {}

  async execute(input: CreateProgramInput): Promise<Result<Program, Error>> {
    return this.programsRepository.create(input);
  }
}
