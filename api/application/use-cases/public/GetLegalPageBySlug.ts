import { ILegalPageRepository } from '../../ports/ILegalPageRepository.js';
import { LegalPage } from '../../../domain/legal-pages/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class GetLegalPageBySlug {
  constructor(private readonly legalPageRepository: ILegalPageRepository) {}

  async execute(slug: string): Promise<Result<LegalPage | null, Error>> {
    return this.legalPageRepository.findBySlug(slug);
  }
}
