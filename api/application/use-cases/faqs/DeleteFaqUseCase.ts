import { IFAQRepository } from '../../ports/IFAQRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeleteFaqUseCase {
  constructor(private faqRepository: IFAQRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.faqRepository.delete(id);
  }
}
