import { ProgramsRepository } from '../../ports/ProgramsRepository.js';
import { Program } from '../../../domain/programs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetProgramBySlug {
  constructor(private readonly programsRepository: ProgramsRepository) {}

  async execute(slug: string): Promise<Result<Program | null, Error>> {
    return this.programsRepository.getProgramBySlug(slug);
  }
}
