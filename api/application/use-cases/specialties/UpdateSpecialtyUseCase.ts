import { ISpecialtyRepository, UpdateSpecialtyInput } from '../../ports/ISpecialtyRepository.js';
import { Specialty } from '../../../domain/specialties/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdateSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute(id: string, input: UpdateSpecialtyInput): Promise<Result<Specialty, Error>> {
    const existingResult = await this.specialtyRepository.findById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('Specialty not found'));
    }

    if (input.code && input.code !== existingResult.value.code) {
      const codeCheckResult = await this.specialtyRepository.findByCode(input.code);
      if (!codeCheckResult.ok) {
        return codeCheckResult;
      }
      if (codeCheckResult.value) {
        return Err(new Error(`Specialty with code '${input.code}' already exists`));
      }
    }

    return this.specialtyRepository.update(id, input);
  }
}
