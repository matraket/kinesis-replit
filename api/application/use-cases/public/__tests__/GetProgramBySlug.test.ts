import { describe, it, expect } from 'vitest';
import { GetProgramBySlug } from '../GetProgramBySlug.js';
import { ProgramsRepository, ProgramFilters } from '../../../ports/ProgramsRepository.js';
import { Program, createProgram } from '../../../../domain/programs/index.js';
import { Result, Ok } from '../../../../../shared/types/Result.js';

class MockProgramsRepository implements ProgramsRepository {
  async getProgramBySlug(slug: string): Promise<Result<Program | null, Error>> {
    if (slug === 'test-program') {
      const mockProgram = createProgram({
        id: '1',
        code: 'TEST_PROG',
        name: 'Test Program',
        slug: 'test-program'
      });
      return Ok(mockProgram);
    }
    return Ok(null);
  }

  async listPublicPrograms(): Promise<Result<Program[], Error>> {
    return Ok([]);
  }

  async listPublicProgramsWithFilters(_filters: ProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>> {
    return Ok({ programs: [], total: 0 });
  }

  async getProgramById(_id: string): Promise<Result<Program | null, Error>> {
    return Ok(null);
  }

  async listProgramsByBusinessModel(_businessModelId: string): Promise<Result<Program[], Error>> {
    return Ok([]);
  }
}

describe('GetProgramBySlug', () => {
  it('should return a program when found by slug', async () => {
    const repository = new MockProgramsRepository();
    const useCase = new GetProgramBySlug(repository);
    
    const result = await useCase.execute('test-program');
    
    expect(result.ok).toBe(true);
    if (result.ok && result.value) {
      expect(result.value.name).toBe('Test Program');
      expect(result.value.slug).toBe('test-program');
    }
  });

  it('should return null when program not found', async () => {
    const repository = new MockProgramsRepository();
    const useCase = new GetProgramBySlug(repository);
    
    const result = await useCase.execute('non-existent');
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeNull();
    }
  });
});
