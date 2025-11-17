import type { Program } from '../../domain/programs/index.js';
import type { Result } from '../../../shared/types/index.js';

export interface ProgramFilters {
  businessModelSlug?: string;
  specialtyCode?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export interface ProgramsRepository {
  listPublicPrograms(): Promise<Result<Program[], Error>>;
  
  listPublicProgramsWithFilters(filters: ProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>>;
  
  getProgramBySlug(slug: string): Promise<Result<Program | null, Error>>;
  
  getProgramById(id: string): Promise<Result<Program | null, Error>>;
  
  listProgramsByBusinessModel(businessModelId: string): Promise<Result<Program[], Error>>;
}
