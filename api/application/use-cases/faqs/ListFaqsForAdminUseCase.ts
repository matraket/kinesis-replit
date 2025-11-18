import { IFAQRepository, AdminFAQFilters } from '../../ports/IFAQRepository.js';
import { FAQ } from '../../../domain/faqs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListFaqsForAdminUseCase {
  constructor(private faqRepository: IFAQRepository) {}

  async execute(filters: AdminFAQFilters): Promise<Result<{ faqs: FAQ[]; total: number }, Error>> {
    return this.faqRepository.listAll(filters);
  }
}
