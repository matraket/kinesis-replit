import { LegalPage, CreateLegalPageInput, UpdateLegalPageInput } from '../../domain/legal-pages/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface ILegalPageRepository {
  listCurrent(): Promise<Result<LegalPage[], Error>>;
  
  list(pageType?: string): Promise<Result<LegalPage[], Error>>;
  
  findBySlug(slug: string): Promise<Result<LegalPage | null, Error>>;
  
  findById(id: string): Promise<Result<LegalPage | null, Error>>;
  
  findByType(pageType: string): Promise<Result<LegalPage | null, Error>>;
  
  create(input: CreateLegalPageInput): Promise<Result<LegalPage, Error>>;
  
  update(id: string, input: UpdateLegalPageInput): Promise<Result<LegalPage, Error>>;
  
  delete(id: string): Promise<Result<void, Error>>;
}
