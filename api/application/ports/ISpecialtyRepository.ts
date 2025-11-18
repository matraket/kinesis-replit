import { Specialty } from '../../domain/specialties/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface SpecialtyFilters {
  isActive?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}

export interface CreateSpecialtyInput {
  code: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateSpecialtyInput {
  code?: string;
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface ISpecialtyRepository {
  listAll(filters: SpecialtyFilters): Promise<Result<{ specialties: Specialty[]; total: number }, Error>>;
  findById(id: string): Promise<Result<Specialty | null, Error>>;
  findByCode(code: string): Promise<Result<Specialty | null, Error>>;
  create(input: CreateSpecialtyInput): Promise<Result<Specialty, Error>>;
  update(id: string, input: UpdateSpecialtyInput): Promise<Result<Specialty, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
  isUsedByPrograms(id: string): Promise<Result<boolean, Error>>;
  isUsedByInstructors(id: string): Promise<Result<boolean, Error>>;
}
