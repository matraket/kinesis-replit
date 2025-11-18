import type { Program } from '../../domain/programs/index.js';
import type { 
  ProgramsRepository, 
  ProgramFilters, 
  AdminProgramFilters, 
  CreateProgramInput, 
  UpdateProgramInput 
} from '../../application/ports/index.js';
import type { Result } from '../../../shared/types/index.js';
import { Ok, Err } from '../../../shared/types/index.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

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

  async listAll(filters: AdminProgramFilters): Promise<Result<{ programs: Program[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.businessModelId) {
        whereClause += ` AND p.business_model_id = $${paramIndex}`;
        queryParams.push(filters.businessModelId);
        paramIndex++;
      }
      
      if (filters.specialtyId) {
        whereClause += ` AND p.specialty_id = $${paramIndex}`;
        queryParams.push(filters.specialtyId);
        paramIndex++;
      }
      
      if (filters.isActive !== undefined) {
        whereClause += ` AND p.is_active = $${paramIndex}`;
        queryParams.push(filters.isActive);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM programs p ${whereClause}`;
      
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
      return Err(error instanceof Error ? error : new Error('Unknown error listing all programs'));
    }
  }

  async create(input: CreateProgramInput): Promise<Result<Program, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO programs (
          id, code, name, subtitle, description_short, description_full,
          business_model_id, specialty_id, duration_minutes, sessions_per_week,
          min_students, max_students, min_age, max_age, difficulty_level,
          price_per_session, price_monthly, price_quarterly, schedule_description,
          featured_image_url, is_active, show_on_web, is_featured, allow_online_enrollment,
          display_order, slug, meta_title, meta_description,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19,
          $20, $21, $22, $23, $24,
          $25, $26, $27, $28,
          $29, $30
        ) RETURNING *`,
        [
          id,
          input.code,
          input.name,
          input.subtitle,
          input.descriptionShort,
          input.descriptionFull,
          input.businessModelId,
          input.specialtyId,
          input.durationMinutes,
          input.sessionsPerWeek,
          input.minStudents ?? 1,
          input.maxStudents ?? 20,
          input.minAge,
          input.maxAge,
          input.difficultyLevel,
          input.pricePerSession,
          input.priceMonthly,
          input.priceQuarterly,
          input.scheduleDescription,
          input.featuredImageUrl,
          input.isActive ?? true,
          input.showOnWeb ?? true,
          input.isFeatured ?? false,
          input.allowOnlineEnrollment ?? false,
          input.displayOrder ?? 0,
          input.slug,
          input.metaTitle,
          input.metaDescription,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const program: Program = {
        id: row.id,
        code: row.code,
        name: row.name,
        subtitle: row.subtitle,
        descriptionShort: row.description_short,
        descriptionFull: row.description_full,
        businessModelId: row.business_model_id,
        specialtyId: row.specialty_id,
        durationMinutes: row.duration_minutes,
        sessionsPerWeek: row.sessions_per_week,
        minStudents: row.min_students,
        maxStudents: row.max_students,
        minAge: row.min_age,
        maxAge: row.max_age,
        difficultyLevel: row.difficulty_level,
        pricePerSession: row.price_per_session ? parseFloat(row.price_per_session) : undefined,
        priceMonthly: row.price_monthly ? parseFloat(row.price_monthly) : undefined,
        priceQuarterly: row.price_quarterly ? parseFloat(row.price_quarterly) : undefined,
        scheduleDescription: row.schedule_description,
        featuredImageUrl: row.featured_image_url,
        isActive: row.is_active,
        showOnWeb: row.show_on_web,
        isFeatured: row.is_featured,
        allowOnlineEnrollment: row.allow_online_enrollment,
        displayOrder: row.display_order,
        slug: row.slug,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        publishedAt: row.published_at ? new Date(row.published_at) : undefined,
      };

      return Ok(program);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating program'));
    }
  }

  async update(id: string, input: UpdateProgramInput): Promise<Result<Program, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.code !== undefined) {
        updates.push(`code = $${paramIndex++}`);
        values.push(input.code);
      }
      if (input.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.subtitle !== undefined) {
        updates.push(`subtitle = $${paramIndex++}`);
        values.push(input.subtitle);
      }
      if (input.descriptionShort !== undefined) {
        updates.push(`description_short = $${paramIndex++}`);
        values.push(input.descriptionShort);
      }
      if (input.descriptionFull !== undefined) {
        updates.push(`description_full = $${paramIndex++}`);
        values.push(input.descriptionFull);
      }
      if (input.businessModelId !== undefined) {
        updates.push(`business_model_id = $${paramIndex++}`);
        values.push(input.businessModelId);
      }
      if (input.specialtyId !== undefined) {
        updates.push(`specialty_id = $${paramIndex++}`);
        values.push(input.specialtyId);
      }
      if (input.durationMinutes !== undefined) {
        updates.push(`duration_minutes = $${paramIndex++}`);
        values.push(input.durationMinutes);
      }
      if (input.sessionsPerWeek !== undefined) {
        updates.push(`sessions_per_week = $${paramIndex++}`);
        values.push(input.sessionsPerWeek);
      }
      if (input.minStudents !== undefined) {
        updates.push(`min_students = $${paramIndex++}`);
        values.push(input.minStudents);
      }
      if (input.maxStudents !== undefined) {
        updates.push(`max_students = $${paramIndex++}`);
        values.push(input.maxStudents);
      }
      if (input.minAge !== undefined) {
        updates.push(`min_age = $${paramIndex++}`);
        values.push(input.minAge);
      }
      if (input.maxAge !== undefined) {
        updates.push(`max_age = $${paramIndex++}`);
        values.push(input.maxAge);
      }
      if (input.difficultyLevel !== undefined) {
        updates.push(`difficulty_level = $${paramIndex++}`);
        values.push(input.difficultyLevel);
      }
      if (input.pricePerSession !== undefined) {
        updates.push(`price_per_session = $${paramIndex++}`);
        values.push(input.pricePerSession);
      }
      if (input.priceMonthly !== undefined) {
        updates.push(`price_monthly = $${paramIndex++}`);
        values.push(input.priceMonthly);
      }
      if (input.priceQuarterly !== undefined) {
        updates.push(`price_quarterly = $${paramIndex++}`);
        values.push(input.priceQuarterly);
      }
      if (input.scheduleDescription !== undefined) {
        updates.push(`schedule_description = $${paramIndex++}`);
        values.push(input.scheduleDescription);
      }
      if (input.featuredImageUrl !== undefined) {
        updates.push(`featured_image_url = $${paramIndex++}`);
        values.push(input.featuredImageUrl);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }
      if (input.showOnWeb !== undefined) {
        updates.push(`show_on_web = $${paramIndex++}`);
        values.push(input.showOnWeb);
      }
      if (input.isFeatured !== undefined) {
        updates.push(`is_featured = $${paramIndex++}`);
        values.push(input.isFeatured);
      }
      if (input.allowOnlineEnrollment !== undefined) {
        updates.push(`allow_online_enrollment = $${paramIndex++}`);
        values.push(input.allowOnlineEnrollment);
      }
      if (input.displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        values.push(input.displayOrder);
      }
      if (input.slug !== undefined) {
        updates.push(`slug = $${paramIndex++}`);
        values.push(input.slug);
      }
      if (input.metaTitle !== undefined) {
        updates.push(`meta_title = $${paramIndex++}`);
        values.push(input.metaTitle);
      }
      if (input.metaDescription !== undefined) {
        updates.push(`meta_description = $${paramIndex++}`);
        values.push(input.metaDescription);
      }

      if (updates.length === 0) {
        return this.getProgramById(id);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const query = `
        UPDATE programs
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('Program not found'));
      }

      const row = result.rows[0];
      const program: Program = {
        id: row.id,
        code: row.code,
        name: row.name,
        subtitle: row.subtitle,
        descriptionShort: row.description_short,
        descriptionFull: row.description_full,
        businessModelId: row.business_model_id,
        specialtyId: row.specialty_id,
        durationMinutes: row.duration_minutes,
        sessionsPerWeek: row.sessions_per_week,
        minStudents: row.min_students,
        maxStudents: row.max_students,
        minAge: row.min_age,
        maxAge: row.max_age,
        difficultyLevel: row.difficulty_level,
        pricePerSession: row.price_per_session ? parseFloat(row.price_per_session) : undefined,
        priceMonthly: row.price_monthly ? parseFloat(row.price_monthly) : undefined,
        priceQuarterly: row.price_quarterly ? parseFloat(row.price_quarterly) : undefined,
        scheduleDescription: row.schedule_description,
        featuredImageUrl: row.featured_image_url,
        isActive: row.is_active,
        showOnWeb: row.show_on_web,
        isFeatured: row.is_featured,
        allowOnlineEnrollment: row.allow_online_enrollment,
        displayOrder: row.display_order,
        slug: row.slug,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        publishedAt: row.published_at ? new Date(row.published_at) : undefined,
      };

      return Ok(program);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating program'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('DELETE FROM programs WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Program not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting program'));
    }
  }

  async assignSpecialties(programId: string, specialtyIds: string[]): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      if (specialtyIds.length > 0 && specialtyIds[0]) {
        await pool.query('UPDATE programs SET specialty_id = $1 WHERE id = $2', [specialtyIds[0], programId]);
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error assigning specialties to program'));
    }
  }

  async assignInstructors(programId: string, instructorIds: string[]): Promise<Result<void, Error>> {
    try {
      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error assigning instructors to program'));
    }
  }
}
