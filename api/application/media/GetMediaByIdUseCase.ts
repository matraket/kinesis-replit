import { Result } from '../../../shared/types/Result.js';
import { MediaLibrary } from '../../domain/entities/MediaLibrary.js';
import { IMediaLibraryRepository } from '../../domain/repositories/IMediaLibraryRepository.js';

export class GetMediaByIdUseCase {
  constructor(private mediaRepository: IMediaLibraryRepository) {}

  async execute(id: string): Promise<Result<MediaLibrary | null, Error>> {
    return this.mediaRepository.findById(id);
  }
}
