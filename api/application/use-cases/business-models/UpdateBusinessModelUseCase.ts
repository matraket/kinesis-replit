import { IBusinessModelRepository, UpdateBusinessModelInput } from '../../ports/IBusinessModelRepository.js';
import { BusinessModel } from '../../../domain/business-models/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdateBusinessModelUseCase {
  constructor(private businessModelRepository: IBusinessModelRepository) {}

  async execute(id: string, input: UpdateBusinessModelInput): Promise<Result<BusinessModel, Error>> {
    const existingResult = await this.businessModelRepository.findById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('Business model not found'));
    }

    if (input.slug && input.slug !== existingResult.value.slug) {
      const slugCheckResult = await this.businessModelRepository.findBySlug(input.slug);
      if (!slugCheckResult.ok) {
        return slugCheckResult;
      }
      if (slugCheckResult.value && slugCheckResult.value.id !== id) {
        return Err(new Error(`Business model with slug '${input.slug}' already exists`));
      }
    }

    if (input.internalCode && input.internalCode !== existingResult.value.internalCode) {
      const codeCheckResult = await this.businessModelRepository.findByInternalCode(input.internalCode);
      if (!codeCheckResult.ok) {
        return codeCheckResult;
      }
      if (codeCheckResult.value && codeCheckResult.value.id !== id) {
        return Err(new Error(`Business model with internal code '${input.internalCode}' already exists`));
      }
    }

    return this.businessModelRepository.update(id, input);
  }
}
