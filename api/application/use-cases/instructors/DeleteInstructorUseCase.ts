import { IInstructorRepository } from '../../ports/IInstructorRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteInstructorUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.instructorRepository.delete(id);
  }
}
