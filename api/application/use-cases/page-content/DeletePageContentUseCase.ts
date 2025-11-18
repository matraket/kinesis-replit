import { IPageContentRepository } from '../../ports/IPageContentRepository.js';
import { Result } from '../../../../shared/types/Result.js';

export class DeletePageContentUseCase {
  constructor(private pageContentRepository: IPageContentRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return this.pageContentRepository.delete(id);
  }
}
