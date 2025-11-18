import { IPageContentRepository } from '../../ports/IPageContentRepository.js';
import { PageContent } from '../../../domain/content/index.js';
import { Result, Ok, Err } from '../../../../shared/types/Result.js';

export class GetPageContentByKeyUseCase {
  constructor(private pageContentRepository: IPageContentRepository) {}

  async execute(pageKey: string): Promise<Result<PageContent, Error>> {
    const result = await this.pageContentRepository.findByPageKey(pageKey);
    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Err(new Error('Page not found'));
    }

    return Ok(result.value);
  }
}
