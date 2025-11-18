import { IInstructorRepository, AdminInstructorFilters } from '../../ports/IInstructorRepository.js';
import { Instructor } from '../../../domain/instructors/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListInstructorsUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(filters: AdminInstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number }, Error>> {
    return this.instructorRepository.listAll(filters);
  }
}
