import { IPageContentRepository, CreatePageContentInput } from '../../ports/IPageContentRepository.js';
import { PageContent } from '../../../domain/content/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class CreatePageContentUseCase {
  constructor(private pageContentRepository: IPageContentRepository) {}

  async execute(input: CreatePageContentInput): Promise<Result<PageContent, Error>> {
    const existingByKeyResult = await this.pageContentRepository.findByPageKey(input.pageKey);
    if (!existingByKeyResult.ok) {
      return existingByKeyResult;
    }

    if (existingByKeyResult.value) {
      return Err(new Error(`Page with key '${input.pageKey}' already exists`));
    }

    const existingBySlugResult = await this.pageContentRepository.getPageBySlug(input.slug);
    if (!existingBySlugResult.ok) {
      return existingBySlugResult;
    }

    if (existingBySlugResult.value) {
      return Err(new Error(`Page with slug '${input.slug}' already exists`));
    }

    return this.pageContentRepository.create(input);
  }
}
