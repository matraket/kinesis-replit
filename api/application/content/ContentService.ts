import type { PageContent } from '../../domain/content/index.js';
import type { ContentRepository } from '../ports/index.js';
import type { Result } from '../../../shared/types/index.js';

export class ContentService {
  constructor(private readonly contentRepo: ContentRepository) {}

  async getPageBySlug(slug: string): Promise<Result<PageContent | null, Error>> {
    if (!slug || slug.trim() === '') {
      return {
        ok: false,
        error: new Error('Slug is required'),
      };
    }
    return this.contentRepo.getPageBySlug(slug);
  }

  async getPageByKey(pageKey: string): Promise<Result<PageContent | null, Error>> {
    if (!pageKey || pageKey.trim() === '') {
      return {
        ok: false,
        error: new Error('Page key is required'),
      };
    }
    return this.contentRepo.getPageByKey(pageKey);
  }

  async listMainNavigationItems(): Promise<Result<PageContent[], Error>> {
    return this.contentRepo.listMainNavigationItems();
  }
}
