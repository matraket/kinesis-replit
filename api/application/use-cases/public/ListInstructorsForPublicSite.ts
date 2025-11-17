import { IInstructorRepository, InstructorFilters } from '../../ports/IInstructorRepository.js';
import { Instructor } from '../../../domain/instructors/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListInstructorsForPublicSite {
  constructor(private readonly instructorRepository: IInstructorRepository) {}

  async execute(filters: InstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number; page: number; limit: number }, Error>> {
    const result = await this.instructorRepository.listPublishedWithFilters(filters);
    
    if (!result.ok) {
      return result;
    }
    
    return {
      ok: true,
      value: {
        instructors: result.value.instructors,
        total: result.value.total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      }
    };
  }
}
