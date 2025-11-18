import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { MediaLibrary, CreateMediaInput } from '../../domain/entities/MediaLibrary.js';
import { IMediaLibraryRepository } from '../../domain/repositories/IMediaLibraryRepository.js';

export class UploadMediaUseCase {
  constructor(private mediaRepository: IMediaLibraryRepository) {}

  async execute(input: CreateMediaInput): Promise<Result<MediaLibrary, Error>> {
    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(input.mimeType)) {
      return Err(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (input.sizeBytes > maxSize) {
      return Err(new Error('File size exceeds maximum of 10MB'));
    }

    return this.mediaRepository.create(input);
  }
}
