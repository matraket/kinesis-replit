import { IPageContentRepository } from '../../ports/IPageContentRepository.js';
import { PageContent } from '../../../domain/content/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class GetPageContentByIdUseCase {
  constructor(private pageContentRepository: IPageContentRepository) {}

  async execute(id: string): Promise<Result<PageContent, Error>> {
    const result = await this.pageContentRepository.findById(id);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Page not found'));
    }

    return result;
  }
}
