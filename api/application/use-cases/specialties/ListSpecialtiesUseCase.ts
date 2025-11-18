import { ISpecialtyRepository, SpecialtyFilters } from '../../ports/ISpecialtyRepository.js';
import { Specialty } from '../../../domain/specialties/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListSpecialtiesUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute(filters: SpecialtyFilters): Promise<Result<{ specialties: Specialty[]; total: number }, Error>> {
    return this.specialtyRepository.listAll(filters);
  }
}
