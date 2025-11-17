import type { Schedule, DayOfWeek } from '../../domain/schedules/index.js';
import type { SchedulesRepository } from '../../application/ports/index.js';
import type { Result } from '../../../shared/types/index.js';
import { Ok, Err } from '../../../shared/types/index.js';
import { getDbPool } from './client.js';

export class PostgresSchedulesRepository implements SchedulesRepository {
  async listSchedulesForProgram(programId: string): Promise<Result<Schedule[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, program_id as "programId",
          day_of_week as "dayOfWeek",
          start_time as "startTime",
          end_time as "endTime",
          instructor_id as "instructorId",
          location,
          max_capacity as "maxCapacity",
          current_enrollment as "currentEnrollment",
          is_active as "isActive",
          valid_from as "validFrom",
          valid_until as "validUntil",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM schedules
        WHERE program_id = $1 AND is_active = true
        ORDER BY 
          CASE day_of_week
            WHEN 'monday' THEN 1
            WHEN 'tuesday' THEN 2
            WHEN 'wednesday' THEN 3
            WHEN 'thursday' THEN 4
            WHEN 'friday' THEN 5
            WHEN 'saturday' THEN 6
            WHEN 'sunday' THEN 7
          END,
          start_time`,
        [programId]
      );

      const schedules: Schedule[] = result.rows.map((row) => ({
        ...row,
        dayOfWeek: row.dayOfWeek as DayOfWeek,
        validFrom: row.validFrom ? new Date(row.validFrom) : undefined,
        validUntil: row.validUntil ? new Date(row.validUntil) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));

      return Ok(schedules);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing schedules'));
    }
  }

  async getScheduleById(id: string): Promise<Result<Schedule | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, program_id as "programId",
          day_of_week as "dayOfWeek",
          start_time as "startTime",
          end_time as "endTime",
          instructor_id as "instructorId",
          location,
          max_capacity as "maxCapacity",
          current_enrollment as "currentEnrollment",
          is_active as "isActive",
          valid_from as "validFrom",
          valid_until as "validUntil",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM schedules
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const schedule: Schedule = {
        ...row,
        dayOfWeek: row.dayOfWeek as DayOfWeek,
        validFrom: row.validFrom ? new Date(row.validFrom) : undefined,
        validUntil: row.validUntil ? new Date(row.validUntil) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      return Ok(schedule);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting schedule'));
    }
  }

  async listActiveSchedules(): Promise<Result<Schedule[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, program_id as "programId",
          day_of_week as "dayOfWeek",
          start_time as "startTime",
          end_time as "endTime",
          instructor_id as "instructorId",
          location,
          max_capacity as "maxCapacity",
          current_enrollment as "currentEnrollment",
          is_active as "isActive",
          valid_from as "validFrom",
          valid_until as "validUntil",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM schedules
        WHERE is_active = true
          AND (valid_from IS NULL OR valid_from <= NOW())
          AND (valid_until IS NULL OR valid_until >= NOW())
        ORDER BY 
          CASE day_of_week
            WHEN 'monday' THEN 1
            WHEN 'tuesday' THEN 2
            WHEN 'wednesday' THEN 3
            WHEN 'thursday' THEN 4
            WHEN 'friday' THEN 5
            WHEN 'saturday' THEN 6
            WHEN 'sunday' THEN 7
          END,
          start_time`
      );

      const schedules: Schedule[] = result.rows.map((row) => ({
        ...row,
        dayOfWeek: row.dayOfWeek as DayOfWeek,
        validFrom: row.validFrom ? new Date(row.validFrom) : undefined,
        validUntil: row.validUntil ? new Date(row.validUntil) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));

      return Ok(schedules);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing active schedules'));
    }
  }
}
