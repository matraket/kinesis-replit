import { IPageContentRepository, PageContentFilters } from '../../ports/IPageContentRepository.js';
import { PageContent } from '../../../domain/content/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListPagesForAdminUseCase {
  constructor(private pageContentRepository: IPageContentRepository) {}

  async execute(filters: PageContentFilters): Promise<Result<{ pages: PageContent[]; total: number }, Error>> {
    return this.pageContentRepository.listAll(filters);
  }
}
