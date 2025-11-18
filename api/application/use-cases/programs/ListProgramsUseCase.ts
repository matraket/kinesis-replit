import { ProgramsRepository, AdminProgramFilters } from '../../ports/index.js';
import { Program } from '../../../domain/programs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListProgramsUseCase {
  constructor(private programsRepository: ProgramsRepository) {}

  async execute(filters: AdminProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>> {
    return this.programsRepository.listAll(filters);
  }
}
