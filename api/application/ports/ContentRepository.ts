import type { PageContent } from '../../domain/content/index.js';
import type { Result } from '../../../shared/types/index.js';

export interface ContentRepository {
  getPageBySlug(slug: string): Promise<Result<PageContent | null, Error>>;
  
  getPageByKey(pageKey: string): Promise<Result<PageContent | null, Error>>;
  
  listPublishedPages(): Promise<Result<PageContent[], Error>>;
  
  listMainNavigationItems(): Promise<Result<PageContent[], Error>>;
}
