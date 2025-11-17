import type { Schedule } from '../../domain/schedules/index.js';
import type { Result } from '../../../shared/types/index.js';

export interface SchedulesRepository {
  listSchedulesForProgram(programId: string): Promise<Result<Schedule[], Error>>;
  
  getScheduleById(id: string): Promise<Result<Schedule | null, Error>>;
  
  listActiveSchedules(): Promise<Result<Schedule[], Error>>;
}
