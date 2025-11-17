import type { Program } from '../../domain/programs/index.js';
import type { ProgramsRepository } from '../ports/index.js';
import type { Result } from '../../../shared/types/index.js';

export class ProgramsService {
  constructor(private readonly programsRepo: ProgramsRepository) {}

  async listProgramsForPublicSite(): Promise<Result<Program[], Error>> {
    return this.programsRepo.listPublicPrograms();
  }

  async getProgramBySlug(slug: string): Promise<Result<Program | null, Error>> {
    if (!slug || slug.trim() === '') {
      return {
        ok: false,
        error: new Error('Slug is required'),
      };
    }
    return this.programsRepo.getProgramBySlug(slug);
  }

  async getProgramById(id: string): Promise<Result<Program | null, Error>> {
    if (!id || id.trim() === '') {
      return {
        ok: false,
        error: new Error('Program ID is required'),
      };
    }
    return this.programsRepo.getProgramById(id);
  }
}
