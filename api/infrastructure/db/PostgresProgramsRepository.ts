import type { Program } from '../../domain/programs/index.js';
import type { ProgramsRepository } from '../../application/ports/index.js';
import type { Result } from '../../../shared/types/index.js';
import { Ok, Err } from '../../../shared/types/index.js';
import { getDbPool } from './client.js';

export class PostgresProgramsRepository implements ProgramsRepository {
  async listPublicPrograms(): Promise<Result<Program[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, subtitle, 
          description_short as "descriptionShort",
          description_full as "descriptionFull",
          business_model_id as "businessModelId",
          specialty_id as "specialtyId",
          duration_minutes as "durationMinutes",
          sessions_per_week as "sessionsPerWeek",
          min_students as "minStudents",
          max_students as "maxStudents",
          min_age as "minAge",
          max_age as "maxAge",
          difficulty_level as "difficultyLevel",
          price_per_session as "pricePerSession",
          price_monthly as "priceMonthly",
          price_quarterly as "priceQuarterly",
          schedule_description as "scheduleDescription",
          featured_image_url as "featuredImageUrl",
          is_active as "isActive",
          show_on_web as "showOnWeb",
          is_featured as "isFeatured",
          allow_online_enrollment as "allowOnlineEnrollment",
          display_order as "displayOrder",
          slug, meta_title as "metaTitle",
          meta_description as "metaDescription",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM programs
        WHERE is_active = true AND show_on_web = true
        ORDER BY display_order, name`
      );
      
      const programs: Program[] = result.rows.map((row) => ({
        ...row,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : undefined,
        priceQuarterly: row.priceQuarterly ? parseFloat(row.priceQuarterly) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      }));
      
      return Ok(programs);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing programs'));
    }
  }

  async getProgramBySlug(slug: string): Promise<Result<Program | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, subtitle,
          description_short as "descriptionShort",
          description_full as "descriptionFull",
          business_model_id as "businessModelId",
          specialty_id as "specialtyId",
          duration_minutes as "durationMinutes",
          sessions_per_week as "sessionsPerWeek",
          min_students as "minStudents",
          max_students as "maxStudents",
          min_age as "minAge",
          max_age as "maxAge",
          difficulty_level as "difficultyLevel",
          price_per_session as "pricePerSession",
          price_monthly as "priceMonthly",
          price_quarterly as "priceQuarterly",
          schedule_description as "scheduleDescription",
          featured_image_url as "featuredImageUrl",
          is_active as "isActive",
          show_on_web as "showOnWeb",
          is_featured as "isFeatured",
          allow_online_enrollment as "allowOnlineEnrollment",
          display_order as "displayOrder",
          slug, meta_title as "metaTitle",
          meta_description as "metaDescription",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM programs
        WHERE slug = $1 AND is_active = true AND show_on_web = true`,
        [slug]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const program: Program = {
        ...row,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : undefined,
        priceQuarterly: row.priceQuarterly ? parseFloat(row.priceQuarterly) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      };

      return Ok(program);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting program by slug'));
    }
  }

  async getProgramById(id: string): Promise<Result<Program | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, subtitle,
          description_short as "descriptionShort",
          description_full as "descriptionFull",
          business_model_id as "businessModelId",
          specialty_id as "specialtyId",
          duration_minutes as "durationMinutes",
          sessions_per_week as "sessionsPerWeek",
          min_students as "minStudents",
          max_students as "maxStudents",
          min_age as "minAge",
          max_age as "maxAge",
          difficulty_level as "difficultyLevel",
          price_per_session as "pricePerSession",
          price_monthly as "priceMonthly",
          price_quarterly as "priceQuarterly",
          schedule_description as "scheduleDescription",
          featured_image_url as "featuredImageUrl",
          is_active as "isActive",
          show_on_web as "showOnWeb",
          is_featured as "isFeatured",
          allow_online_enrollment as "allowOnlineEnrollment",
          display_order as "displayOrder",
          slug, meta_title as "metaTitle",
          meta_description as "metaDescription",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM programs
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const program: Program = {
        ...row,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : undefined,
        priceQuarterly: row.priceQuarterly ? parseFloat(row.priceQuarterly) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      };

      return Ok(program);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting program by ID'));
    }
  }

  async listProgramsByBusinessModel(businessModelId: string): Promise<Result<Program[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, subtitle,
          description_short as "descriptionShort",
          description_full as "descriptionFull",
          business_model_id as "businessModelId",
          specialty_id as "specialtyId",
          duration_minutes as "durationMinutes",
          sessions_per_week as "sessionsPerWeek",
          min_students as "minStudents",
          max_students as "maxStudents",
          min_age as "minAge",
          max_age as "maxAge",
          difficulty_level as "difficultyLevel",
          price_per_session as "pricePerSession",
          price_monthly as "priceMonthly",
          price_quarterly as "priceQuarterly",
          schedule_description as "scheduleDescription",
          featured_image_url as "featuredImageUrl",
          is_active as "isActive",
          show_on_web as "showOnWeb",
          is_featured as "isFeatured",
          allow_online_enrollment as "allowOnlineEnrollment",
          display_order as "displayOrder",
          slug, meta_title as "metaTitle",
          meta_description as "metaDescription",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM programs
        WHERE business_model_id = $1 AND is_active = true AND show_on_web = true
        ORDER BY display_order, name`,
        [businessModelId]
      );

      const programs: Program[] = result.rows.map((row) => ({
        ...row,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : undefined,
        priceQuarterly: row.priceQuarterly ? parseFloat(row.priceQuarterly) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      }));

      return Ok(programs);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing programs by business model'));
    }
  }
}
