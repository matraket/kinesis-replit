import { IInstructorRepository } from '../../ports/IInstructorRepository.js';
import { Instructor } from '../../../domain/instructors/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class GetInstructorByIdUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(id: string): Promise<Result<Instructor, Error>> {
    const result = await this.instructorRepository.findById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Instructor not found'));
    }

    return { ok: true, value: result.value };
  }
}
