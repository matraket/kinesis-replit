import { Instructor } from '../../domain/instructors/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface InstructorFilters {
  featured?: boolean;
  specialtyCode?: string;
  page?: number;
  limit?: number;
}

export interface IInstructorRepository {
  listPublishedWithFilters(filters: InstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number }, Error>>;
  findBySlug(slug: string): Promise<Result<Instructor | null, Error>>;
}
