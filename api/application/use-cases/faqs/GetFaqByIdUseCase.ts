import { IFAQRepository } from '../../ports/IFAQRepository.js';
import { FAQ } from '../../../domain/faqs/index.js';
import { Result, Ok, Err } from '../../../../shared/types/Result.js';

export class GetFaqByIdUseCase {
  constructor(private faqRepository: IFAQRepository) {}

  async execute(id: string): Promise<Result<FAQ, Error>> {
    const result = await this.faqRepository.findById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('FAQ not found'));
    }

    return Ok(result.value);
  }
}
