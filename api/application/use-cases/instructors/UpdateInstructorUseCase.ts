import { IInstructorRepository, UpdateInstructorInput } from '../../ports/IInstructorRepository.js';
import { Instructor } from '../../../domain/instructors/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdateInstructorUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(id: string, input: UpdateInstructorInput): Promise<Result<Instructor, Error>> {
    const existingResult = await this.instructorRepository.findById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('Instructor not found'));
    }

    return this.instructorRepository.update(id, input);
  }
}
