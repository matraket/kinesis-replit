import { ISpecialtyRepository } from '../../ports/ISpecialtyRepository.js';
import { Specialty } from '../../../domain/specialties/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class GetSpecialtyByIdUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute(id: string): Promise<Result<Specialty, Error>> {
    const result = await this.specialtyRepository.findById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Specialty not found'));
    }

    return { ok: true, value: result.value };
  }
}
