import { Instructor } from '../../domain/instructors/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface InstructorFilters {
  featured?: boolean;
  specialtyCode?: string;
  page?: number;
  limit?: number;
}

export interface AdminInstructorFilters {
  isActive?: boolean;
  showOnWeb?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateInstructorInput {
  firstName: string;
  lastName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  tagline?: string;
  bioSummary?: string;
  bioFull?: string;
  achievements?: string[];
  education?: string[];
  profileImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  showOnWeb?: boolean;
  showInTeamPage?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  seniorityLevel?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateInstructorInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  tagline?: string;
  bioSummary?: string;
  bioFull?: string;
  achievements?: string[];
  education?: string[];
  profileImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  showOnWeb?: boolean;
  showInTeamPage?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  seniorityLevel?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface IInstructorRepository {
  listPublishedWithFilters(filters: InstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number }, Error>>;
  findBySlug(slug: string): Promise<Result<Instructor | null, Error>>;
  listAll(filters: AdminInstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Instructor | null, Error>>;
  create(input: CreateInstructorInput): Promise<Result<Instructor, Error>>;
  update(id: string, input: UpdateInstructorInput): Promise<Result<Instructor, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
  isAssignedToActivePrograms(id: string): Promise<Result<boolean, Error>>;
  assignSpecialties(instructorId: string, specialtyIds: string[]): Promise<Result<void, Error>>;
  removeSpecialties(instructorId: string, specialtyIds: string[]): Promise<Result<void, Error>>;
}
