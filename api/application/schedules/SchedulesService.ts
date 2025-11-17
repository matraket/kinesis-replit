import type { Schedule } from '../../domain/schedules/index.js';
import type { SchedulesRepository } from '../ports/index.js';
import type { Result } from '../../../shared/types/index.js';

export class SchedulesService {
  constructor(private readonly schedulesRepo: SchedulesRepository) {}

  async listSchedulesForProgram(programId: string): Promise<Result<Schedule[], Error>> {
    if (!programId || programId.trim() === '') {
      return {
        ok: false,
        error: new Error('Program ID is required'),
      };
    }
    return this.schedulesRepo.listSchedulesForProgram(programId);
  }

  async listActiveSchedules(): Promise<Result<Schedule[], Error>> {
    return this.schedulesRepo.listActiveSchedules();
  }
}
