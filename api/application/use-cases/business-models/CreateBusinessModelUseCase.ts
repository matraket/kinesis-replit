import { IBusinessModelRepository, CreateBusinessModelInput } from '../../ports/IBusinessModelRepository.js';
import { BusinessModel } from '../../../domain/business-models/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class CreateBusinessModelUseCase {
  constructor(private businessModelRepository: IBusinessModelRepository) {}

  async execute(input: CreateBusinessModelInput): Promise<Result<BusinessModel, Error>> {
    const existingByCodeResult = await this.businessModelRepository.findByInternalCode(input.internalCode);
    if (!existingByCodeResult.ok) {
      return existingByCodeResult;
    }

    if (existingByCodeResult.value) {
      return Err(new Error(`Business model with internal code '${input.internalCode}' already exists`));
    }

    const existingBySlugResult = await this.businessModelRepository.findBySlug(input.slug);
    if (!existingBySlugResult.ok) {
      return existingBySlugResult;
    }

    if (existingBySlugResult.value) {
      return Err(new Error(`Business model with slug '${input.slug}' already exists`));
    }

    return this.businessModelRepository.create(input);
  }
}
