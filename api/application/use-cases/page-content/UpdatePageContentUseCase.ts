import { IPageContentRepository, UpdatePageContentInput } from '../../ports/IPageContentRepository.js';
import { PageContent } from '../../../domain/content/index.js';
import { Result, Err } from '../../../../shared/types/Result.js';

export class UpdatePageContentUseCase {
  constructor(private pageContentRepository: IPageContentRepository) {}

  async execute(id: string, input: UpdatePageContentInput): Promise<Result<PageContent, Error>> {
    const existingResult = await this.pageContentRepository.findById(id);
    if (!existingResult.ok) {
      return existingResult;
    }

    if (!existingResult.value) {
      return Err(new Error('Page not found'));
    }

    if (input.slug && input.slug !== existingResult.value.slug) {
      const slugCheckResult = await this.pageContentRepository.findBySlug(input.slug);
      if (!slugCheckResult.ok) {
        return slugCheckResult;
      }
      if (slugCheckResult.value && slugCheckResult.value.id !== id) {
        return Err(new Error(`Page with slug '${input.slug}' already exists`));
      }
    }

    if (input.pageKey && input.pageKey !== existingResult.value.pageKey) {
      const keyCheckResult = await this.pageContentRepository.findByPageKey(input.pageKey);
      if (!keyCheckResult.ok) {
        return keyCheckResult;
      }
      if (keyCheckResult.value && keyCheckResult.value.id !== id) {
        return Err(new Error(`Page with key '${input.pageKey}' already exists`));
      }
    }

    return this.pageContentRepository.update(id, input);
  }
}
