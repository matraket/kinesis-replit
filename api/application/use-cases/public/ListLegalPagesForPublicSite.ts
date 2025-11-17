import { ILegalPageRepository } from '../../ports/ILegalPageRepository.js';
import { LegalPage } from '../../../domain/legal-pages/index.js';
import { Result } from '../../../../shared/types/Result.js';

export class ListLegalPagesForPublicSite {
  constructor(private readonly legalPageRepository: ILegalPageRepository) {}

  async execute(): Promise<Result<LegalPage[], Error>> {
    return this.legalPageRepository.listCurrent();
  }
}
