import { ISpecialtyRepository, CreateSpecialtyInput } from '../../ports/ISpecialtyRepository.js';
import { Specialty } from '../../../domain/specialties/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class CreateSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute(input: CreateSpecialtyInput): Promise<Result<Specialty, Error>> {
    const existingResult = await this.specialtyRepository.findByCode(input.code);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (existingResult.value) {
      return Err(new Error(`Specialty with code '${input.code}' already exists`));
    }

    return this.specialtyRepository.create(input);
  }
}
