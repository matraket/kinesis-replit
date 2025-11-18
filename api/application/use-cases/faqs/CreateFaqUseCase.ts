import { IFAQRepository, CreateFAQInput } from '../../ports/IFAQRepository.js';
import { FAQ } from '../../../domain/faqs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class CreateFaqUseCase {
  constructor(private faqRepository: IFAQRepository) {}

  async execute(input: CreateFAQInput): Promise<Result<FAQ, Error>> {
    return this.faqRepository.create(input);
  }
}
