import { PageContent } from '../../domain/content/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface IPageContentRepository {
  findBySlug(slug: string): Promise<Result<PageContent | null, Error>>;
}
