import type { Program, DifficultyLevel } from '../../domain/programs/index.js';
import type { Result } from '../../../shared/types/index.js';

export interface ProgramFilters {
  businessModelSlug?: string;
  specialtyCode?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export interface AdminProgramFilters {
  businessModelId?: string;
  specialtyId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProgramInput {
  code: string;
  name: string;
  subtitle?: string;
  descriptionShort?: string;
  descriptionFull?: string;
  businessModelId?: string;
  specialtyId?: string;
  durationMinutes?: number;
  sessionsPerWeek?: number;
  minStudents?: number;
  maxStudents?: number;
  minAge?: number;
  maxAge?: number;
  difficultyLevel?: DifficultyLevel;
  pricePerSession?: number;
  priceMonthly?: number;
  priceQuarterly?: number;
  scheduleDescription?: string;
  featuredImageUrl?: string;
  isActive?: boolean;
  showOnWeb?: boolean;
  isFeatured?: boolean;
  allowOnlineEnrollment?: boolean;
  displayOrder?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateProgramInput {
  code?: string;
  name?: string;
  subtitle?: string;
  descriptionShort?: string;
  descriptionFull?: string;
  businessModelId?: string;
  specialtyId?: string;
  durationMinutes?: number;
  sessionsPerWeek?: number;
  minStudents?: number;
  maxStudents?: number;
  minAge?: number;
  maxAge?: number;
  difficultyLevel?: DifficultyLevel;
  pricePerSession?: number;
  priceMonthly?: number;
  priceQuarterly?: number;
  scheduleDescription?: string;
  featuredImageUrl?: string;
  isActive?: boolean;
  showOnWeb?: boolean;
  isFeatured?: boolean;
  allowOnlineEnrollment?: boolean;
  displayOrder?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProgramsRepository {
  listPublicPrograms(): Promise<Result<Program[], Error>>;
  
  listPublicProgramsWithFilters(filters: ProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>>;
  
  getProgramBySlug(slug: string): Promise<Result<Program | null, Error>>;
  
  getProgramById(id: string): Promise<Result<Program | null, Error>>;
  
  listProgramsByBusinessModel(businessModelId: string): Promise<Result<Program[], Error>>;

  listAll(filters: AdminProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>>;
  create(input: CreateProgramInput): Promise<Result<Program, Error>>;
  update(id: string, input: UpdateProgramInput): Promise<Result<Program, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
  assignSpecialties(programId: string, specialtyIds: string[]): Promise<Result<void, Error>>;
  assignInstructors(programId: string, instructorIds: string[]): Promise<Result<void, Error>>;
}
