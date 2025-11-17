import { IPageContentRepository } from '../../ports/IPageContentRepository.js';
import { PageContent } from '../../../domain/content/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetPageContentBySlug {
  constructor(private readonly pageContentRepository: IPageContentRepository) {}

  async execute(slug: string): Promise<Result<PageContent | null, Error>> {
    return this.pageContentRepository.findBySlug(slug);
  }
}
