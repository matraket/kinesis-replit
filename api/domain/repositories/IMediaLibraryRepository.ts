import { Result } from '../../../shared/types/Result.js';
import { MediaLibrary, CreateMediaInput, MediaFilters } from '../entities/MediaLibrary.js';

export interface IMediaLibraryRepository {
  list(filters: MediaFilters): Promise<Result<{ media: MediaLibrary[]; total: number }, Error>>;
  findById(id: string): Promise<Result<MediaLibrary | null, Error>>;
  create(input: CreateMediaInput): Promise<Result<MediaLibrary, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
