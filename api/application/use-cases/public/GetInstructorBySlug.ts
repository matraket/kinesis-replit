import { IInstructorRepository } from '../../ports/IInstructorRepository.js';
import { Instructor } from '../../../domain/instructors/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetInstructorBySlug {
  constructor(private readonly instructorRepository: IInstructorRepository) {}

  async execute(slug: string): Promise<Result<Instructor | null, Error>> {
    return this.instructorRepository.findBySlug(slug);
  }
}
