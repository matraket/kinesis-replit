import { Result, Err } from '../../../shared/types/Result.js';
import { IMediaLibraryRepository } from '../../domain/repositories/IMediaLibraryRepository.js';

export class DeleteMediaUseCase {
  constructor(private mediaRepository: IMediaLibraryRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    // First check if media exists
    const mediaResult = await this.mediaRepository.findById(id);
    
    if (!mediaResult.ok) {
      return mediaResult;
    }
    
    if (!mediaResult.value) {
      return Err(new Error('Media not found'));
    }

    // Delete from database (file cleanup would happen here if needed)
    return this.mediaRepository.delete(id);
  }
}
