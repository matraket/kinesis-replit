import type { Program } from '../../domain/programs/index.js';
import type { ProgramsRepository, ProgramFilters } from '../../application/ports/index.js';
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

  async listPublicProgramsWithFilters(filters: ProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE p.is_active = true AND p.show_on_web = true';
      
      if (filters.businessModelSlug) {
        whereClause += ` AND bm.slug = $${paramIndex}`;
        queryParams.push(filters.businessModelSlug);
        paramIndex++;
      }
      
      if (filters.specialtyCode) {
        whereClause += ` AND s.code = $${paramIndex}`;
        queryParams.push(filters.specialtyCode);
        paramIndex++;
      }
      
      if (filters.difficulty) {
        whereClause += ` AND p.difficulty_level = $${paramIndex}`;
        queryParams.push(filters.difficulty);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `
        SELECT COUNT(*)
        FROM programs p
        LEFT JOIN business_models bm ON p.business_model_id = bm.id
        LEFT JOIN specialties s ON p.specialty_id = s.id
        ${whereClause}
      `;
      
      const dataQuery = `
        SELECT 
          p.id, p.code, p.name, p.subtitle,
          p.description_short as "descriptionShort",
          p.description_full as "descriptionFull",
          p.business_model_id as "businessModelId",
          p.specialty_id as "specialtyId",
          p.duration_minutes as "durationMinutes",
          p.sessions_per_week as "sessionsPerWeek",
          p.min_students as "minStudents",
          p.max_students as "maxStudents",
          p.min_age as "minAge",
          p.max_age as "maxAge",
          p.difficulty_level as "difficultyLevel",
          p.price_per_session as "pricePerSession",
          p.price_monthly as "priceMonthly",
          p.price_quarterly as "priceQuarterly",
          p.schedule_description as "scheduleDescription",
          p.featured_image_url as "featuredImageUrl",
          p.is_active as "isActive",
          p.show_on_web as "showOnWeb",
          p.is_featured as "isFeatured",
          p.allow_online_enrollment as "allowOnlineEnrollment",
          p.display_order as "displayOrder",
          p.slug, p.meta_title as "metaTitle",
          p.meta_description as "metaDescription",
          p.created_at as "createdAt",
          p.updated_at as "updatedAt",
          p.published_at as "publishedAt"
        FROM programs p
        LEFT JOIN business_models bm ON p.business_model_id = bm.id
        LEFT JOIN specialties s ON p.specialty_id = s.id
        ${whereClause}
        ORDER BY p.display_order, p.name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const programs: Program[] = dataResult.rows.map((row) => ({
        ...row,
        pricePerSession: row.pricePerSession ? parseFloat(row.pricePerSession) : undefined,
        priceMonthly: row.priceMonthly ? parseFloat(row.priceMonthly) : undefined,
        priceQuarterly: row.priceQuarterly ? parseFloat(row.priceQuarterly) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      }));
      
      return Ok({ programs, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing programs with filters'));
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
