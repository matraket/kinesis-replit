import { Result } from '../../../shared/types/Result.js';
import { MediaLibrary, MediaFilters } from '../../domain/entities/MediaLibrary.js';
import { IMediaLibraryRepository } from '../../domain/repositories/IMediaLibraryRepository.js';

export class ListMediaUseCase {
  constructor(private mediaRepository: IMediaLibraryRepository) {}

  async execute(filters: MediaFilters): Promise<Result<{ media: MediaLibrary[]; total: number }, Error>> {
    return this.mediaRepository.list(filters);
  }
}
