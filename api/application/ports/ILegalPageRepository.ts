import { LegalPage } from '../../domain/legal-pages/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface ILegalPageRepository {
  listCurrent(): Promise<Result<LegalPage[], Error>>;
  findBySlug(slug: string): Promise<Result<LegalPage | null, Error>>;
}
