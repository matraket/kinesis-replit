import { IFAQRepository, UpdateFAQInput } from '../../ports/IFAQRepository.js';
import { FAQ } from '../../../domain/faqs/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdateFaqUseCase {
  constructor(private faqRepository: IFAQRepository) {}

  async execute(id: string, input: UpdateFAQInput): Promise<Result<FAQ, Error>> {
    const existingResult = await this.faqRepository.findById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('FAQ not found'));
    }

    return this.faqRepository.update(id, input);
  }
}
