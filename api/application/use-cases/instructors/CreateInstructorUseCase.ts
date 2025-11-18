import { IInstructorRepository, CreateInstructorInput } from '../../ports/IInstructorRepository.js';
import { Instructor } from '../../../domain/instructors/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateInstructorUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(input: CreateInstructorInput): Promise<Result<Instructor, Error>> {
    return this.instructorRepository.create(input);
  }
}
