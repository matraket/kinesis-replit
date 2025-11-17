import { IFAQRepository, FAQFilters } from '../../ports/IFAQRepository.js';
import { FAQ } from '../../../domain/faqs/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListFAQsForPublicSite {
  constructor(private readonly faqRepository: IFAQRepository) {}

  async execute(filters: FAQFilters): Promise<Result<{ faqs: FAQ[]; total: number; page: number; limit: number }, Error>> {
    const result = await this.faqRepository.listPublishedWithFilters(filters);
    
    if (!result.ok) {
      return result;
    }
    
    return {
      ok: true,
      value: {
        faqs: result.value.faqs,
        total: result.value.total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      }
    };
  }
}
