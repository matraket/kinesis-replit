import { ProgramsRepository, ProgramFilters } from '../../ports/ProgramsRepository.js';
import { Program } from '../../../domain/programs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListProgramsForPublicSite {
  constructor(private readonly programsRepository: ProgramsRepository) {}

  async execute(filters: ProgramFilters): Promise<Result<{ programs: Program[]; total: number; page: number; limit: number }, Error>> {
    const result = await this.programsRepository.listPublicProgramsWithFilters(filters);
    
    if (!result.ok) {
      return result;
    }
    
    return {
      ok: true,
      value: {
        programs: result.value.programs,
        total: result.value.total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      }
    };
  }
}
