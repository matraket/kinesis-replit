import { 
  IInstructorRepository, 
  InstructorFilters, 
  AdminInstructorFilters, 
  CreateInstructorInput, 
  UpdateInstructorInput 
} from '../../application/ports/IInstructorRepository.js';
import { Instructor, createInstructor } from '../../domain/instructors/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresInstructorRepository implements IInstructorRepository {
  async listPublishedWithFilters(filters: InstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE i.is_active = true AND i.show_on_web = true';
      
      if (filters.featured !== undefined) {
        whereClause += ` AND i.is_featured = $${paramIndex}`;
        queryParams.push(filters.featured);
        paramIndex++;
      }
      
      if (filters.specialtyCode) {
        whereClause += ` AND EXISTS (
          SELECT 1 FROM instructor_specialties ins
          JOIN specialties s ON ins.specialty_id = s.id
          WHERE ins.instructor_id = i.id AND s.code = $${paramIndex}
        )`;
        queryParams.push(filters.specialtyCode);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `
        SELECT COUNT(*)
        FROM instructors i
        ${whereClause}
      `;
      
      const dataQuery = `
        SELECT 
          i.id, i.first_name as "firstName", i.last_name as "lastName",
          i.display_name as "displayName", i.email, i.phone, i.role, i.tagline,
          i.bio_summary as "bioSummary", i.bio_full as "bioFull",
          i.achievements, i.education, i.profile_image_url as "profileImageUrl",
          i.hero_image_url as "heroImageUrl", i.video_url as "videoUrl",
          i.show_on_web as "showOnWeb", i.show_in_team_page as "showInTeamPage",
          i.is_featured as "isFeatured", i.is_active as "isActive",
          i.display_order as "displayOrder", i.seniority_level as "seniorityLevel",
          i.slug, i.meta_title as "metaTitle", i.meta_description as "metaDescription",
          i.created_at as "createdAt", i.updated_at as "updatedAt"
        FROM instructors i
        ${whereClause}
        ORDER BY i.seniority_level DESC, i.display_order, i.last_name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const instructors = dataResult.rows.map((row: any) => createInstructor({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        displayName: row.displayName,
        email: row.email,
        phone: row.phone,
        role: row.role,
        tagline: row.tagline,
        bioSummary: row.bioSummary,
        bioFull: row.bioFull,
        achievements: row.achievements,
        education: row.education,
        profileImageUrl: row.profileImageUrl,
        heroImageUrl: row.heroImageUrl,
        videoUrl: row.videoUrl,
        showOnWeb: row.showOnWeb,
        showInTeamPage: row.showInTeamPage,
        isFeatured: row.isFeatured,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        seniorityLevel: row.seniorityLevel,
        slug: row.slug,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));
      
      return Ok({ instructors, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing instructors'));
    }
  }

  async findBySlug(slug: string): Promise<Result<Instructor | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, first_name as "firstName", last_name as "lastName",
          display_name as "displayName", email, phone, role, tagline,
          bio_summary as "bioSummary", bio_full as "bioFull",
          achievements, education, profile_image_url as "profileImageUrl",
          hero_image_url as "heroImageUrl", video_url as "videoUrl",
          show_on_web as "showOnWeb", show_in_team_page as "showInTeamPage",
          is_featured as "isFeatured", is_active as "isActive",
          display_order as "displayOrder", seniority_level as "seniorityLevel",
          slug, meta_title as "metaTitle", meta_description as "metaDescription",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM instructors
         WHERE slug = $1 AND is_active = true AND show_on_web = true
         LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const instructor = createInstructor({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        displayName: row.displayName,
        email: row.email,
        phone: row.phone,
        role: row.role,
        tagline: row.tagline,
        bioSummary: row.bioSummary,
        bioFull: row.bioFull,
        achievements: row.achievements,
        education: row.education,
        profileImageUrl: row.profileImageUrl,
        heroImageUrl: row.heroImageUrl,
        videoUrl: row.videoUrl,
        showOnWeb: row.showOnWeb,
        showInTeamPage: row.showInTeamPage,
        isFeatured: row.isFeatured,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        seniorityLevel: row.seniorityLevel,
        slug: row.slug,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      });

      return Ok(instructor);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding instructor'));
    }
  }

  async listAll(filters: AdminInstructorFilters): Promise<Result<{ instructors: Instructor[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.isActive !== undefined) {
        whereClause += ` AND i.is_active = $${paramIndex}`;
        queryParams.push(filters.isActive);
        paramIndex++;
      }
      
      if (filters.showOnWeb !== undefined) {
        whereClause += ` AND i.show_on_web = $${paramIndex}`;
        queryParams.push(filters.showOnWeb);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM instructors i ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          i.id, i.first_name as "firstName", i.last_name as "lastName",
          i.display_name as "displayName", i.email, i.phone, i.role, i.tagline,
          i.bio_summary as "bioSummary", i.bio_full as "bioFull",
          i.achievements, i.education, i.profile_image_url as "profileImageUrl",
          i.hero_image_url as "heroImageUrl", i.video_url as "videoUrl",
          i.show_on_web as "showOnWeb", i.show_in_team_page as "showInTeamPage",
          i.is_featured as "isFeatured", i.is_active as "isActive",
          i.display_order as "displayOrder", i.seniority_level as "seniorityLevel",
          i.slug, i.meta_title as "metaTitle", i.meta_description as "metaDescription",
          i.created_at as "createdAt", i.updated_at as "updatedAt"
        FROM instructors i
        ${whereClause}
        ORDER BY i.seniority_level DESC, i.display_order, i.last_name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const instructors = dataResult.rows.map((row: any) => createInstructor({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        displayName: row.displayName,
        email: row.email,
        phone: row.phone,
        role: row.role,
        tagline: row.tagline,
        bioSummary: row.bioSummary,
        bioFull: row.bioFull,
        achievements: row.achievements,
        education: row.education,
        profileImageUrl: row.profileImageUrl,
        heroImageUrl: row.heroImageUrl,
        videoUrl: row.videoUrl,
        showOnWeb: row.showOnWeb,
        showInTeamPage: row.showInTeamPage,
        isFeatured: row.isFeatured,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        seniorityLevel: row.seniorityLevel,
        slug: row.slug,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));
      
      return Ok({ instructors, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing all instructors'));
    }
  }

  async findById(id: string): Promise<Result<Instructor | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, first_name as "firstName", last_name as "lastName",
          display_name as "displayName", email, phone, role, tagline,
          bio_summary as "bioSummary", bio_full as "bioFull",
          achievements, education, profile_image_url as "profileImageUrl",
          hero_image_url as "heroImageUrl", video_url as "videoUrl",
          show_on_web as "showOnWeb", show_in_team_page as "showInTeamPage",
          is_featured as "isFeatured", is_active as "isActive",
          display_order as "displayOrder", seniority_level as "seniorityLevel",
          slug, meta_title as "metaTitle", meta_description as "metaDescription",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM instructors
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const instructor = createInstructor({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        displayName: row.displayName,
        email: row.email,
        phone: row.phone,
        role: row.role,
        tagline: row.tagline,
        bioSummary: row.bioSummary,
        bioFull: row.bioFull,
        achievements: row.achievements,
        education: row.education,
        profileImageUrl: row.profileImageUrl,
        heroImageUrl: row.heroImageUrl,
        videoUrl: row.videoUrl,
        showOnWeb: row.showOnWeb,
        showInTeamPage: row.showInTeamPage,
        isFeatured: row.isFeatured,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        seniorityLevel: row.seniorityLevel,
        slug: row.slug,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      });

      return Ok(instructor);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding instructor by id'));
    }
  }

  async create(input: CreateInstructorInput): Promise<Result<Instructor, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO instructors (
          id, first_name, last_name, display_name, email, phone,
          role, tagline, bio_summary, bio_full, achievements, education,
          profile_image_url, hero_image_url, video_url,
          show_on_web, show_in_team_page, is_featured, is_active,
          display_order, seniority_level, slug, meta_title, meta_description,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18, $19,
          $20, $21, $22, $23, $24,
          $25, $26
        ) RETURNING *`,
        [
          id,
          input.firstName,
          input.lastName,
          input.displayName,
          input.email,
          input.phone,
          input.role,
          input.tagline,
          input.bioSummary,
          input.bioFull,
          input.achievements,
          input.education,
          input.profileImageUrl,
          input.heroImageUrl,
          input.videoUrl,
          input.showOnWeb ?? true,
          input.showInTeamPage ?? true,
          input.isFeatured ?? false,
          input.isActive ?? true,
          input.displayOrder ?? 0,
          input.seniorityLevel ?? 0,
          input.slug,
          input.metaTitle,
          input.metaDescription,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const instructor = createInstructor({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        displayName: row.display_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        tagline: row.tagline,
        bioSummary: row.bio_summary,
        bioFull: row.bio_full,
        achievements: row.achievements,
        education: row.education,
        profileImageUrl: row.profile_image_url,
        heroImageUrl: row.hero_image_url,
        videoUrl: row.video_url,
        showOnWeb: row.show_on_web,
        showInTeamPage: row.show_in_team_page,
        isFeatured: row.is_featured,
        isActive: row.is_active,
        displayOrder: row.display_order,
        seniorityLevel: row.seniority_level,
        slug: row.slug,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });

      return Ok(instructor);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating instructor'));
    }
  }

  async update(id: string, input: UpdateInstructorInput): Promise<Result<Instructor, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.firstName !== undefined) {
        updates.push(`first_name = $${paramIndex++}`);
        values.push(input.firstName);
      }
      if (input.lastName !== undefined) {
        updates.push(`last_name = $${paramIndex++}`);
        values.push(input.lastName);
      }
      if (input.displayName !== undefined) {
        updates.push(`display_name = $${paramIndex++}`);
        values.push(input.displayName);
      }
      if (input.email !== undefined) {
        updates.push(`email = $${paramIndex++}`);
        values.push(input.email);
      }
      if (input.phone !== undefined) {
        updates.push(`phone = $${paramIndex++}`);
        values.push(input.phone);
      }
      if (input.role !== undefined) {
        updates.push(`role = $${paramIndex++}`);
        values.push(input.role);
      }
      if (input.tagline !== undefined) {
        updates.push(`tagline = $${paramIndex++}`);
        values.push(input.tagline);
      }
      if (input.bioSummary !== undefined) {
        updates.push(`bio_summary = $${paramIndex++}`);
        values.push(input.bioSummary);
      }
      if (input.bioFull !== undefined) {
        updates.push(`bio_full = $${paramIndex++}`);
        values.push(input.bioFull);
      }
      if (input.achievements !== undefined) {
        updates.push(`achievements = $${paramIndex++}`);
        values.push(input.achievements);
      }
      if (input.education !== undefined) {
        updates.push(`education = $${paramIndex++}`);
        values.push(input.education);
      }
      if (input.profileImageUrl !== undefined) {
        updates.push(`profile_image_url = $${paramIndex++}`);
        values.push(input.profileImageUrl);
      }
      if (input.heroImageUrl !== undefined) {
        updates.push(`hero_image_url = $${paramIndex++}`);
        values.push(input.heroImageUrl);
      }
      if (input.videoUrl !== undefined) {
        updates.push(`video_url = $${paramIndex++}`);
        values.push(input.videoUrl);
      }
      if (input.showOnWeb !== undefined) {
        updates.push(`show_on_web = $${paramIndex++}`);
        values.push(input.showOnWeb);
      }
      if (input.showInTeamPage !== undefined) {
        updates.push(`show_in_team_page = $${paramIndex++}`);
        values.push(input.showInTeamPage);
      }
      if (input.isFeatured !== undefined) {
        updates.push(`is_featured = $${paramIndex++}`);
        values.push(input.isFeatured);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }
      if (input.displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        values.push(input.displayOrder);
      }
      if (input.seniorityLevel !== undefined) {
        updates.push(`seniority_level = $${paramIndex++}`);
        values.push(input.seniorityLevel);
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
        return this.findById(id);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const query = `
        UPDATE instructors
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('Instructor not found'));
      }

      const row = result.rows[0];
      const instructor = createInstructor({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        displayName: row.display_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        tagline: row.tagline,
        bioSummary: row.bio_summary,
        bioFull: row.bio_full,
        achievements: row.achievements,
        education: row.education,
        profileImageUrl: row.profile_image_url,
        heroImageUrl: row.hero_image_url,
        videoUrl: row.video_url,
        showOnWeb: row.show_on_web,
        showInTeamPage: row.show_in_team_page,
        isFeatured: row.is_featured,
        isActive: row.is_active,
        displayOrder: row.display_order,
        seniorityLevel: row.seniority_level,
        slug: row.slug,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });

      return Ok(instructor);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating instructor'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      const isAssignedResult = await this.isAssignedToActivePrograms(id);
      if (!isAssignedResult.ok) {
        return isAssignedResult;
      }
      if (isAssignedResult.value) {
        return Err(new Error('Cannot delete instructor: they are currently assigned to one or more active programs'));
      }

      await pool.query('DELETE FROM instructor_specialties WHERE instructor_id = $1', [id]);

      const result = await pool.query('DELETE FROM instructors WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Instructor not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting instructor'));
    }
  }

  async isAssignedToActivePrograms(id: string): Promise<Result<boolean, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT EXISTS(
          SELECT 1 FROM schedules 
          WHERE instructor_id = $1 
          AND is_active = true
        ) as exists`,
        [id]
      );
      return Ok(result.rows[0].exists);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error checking instructor assignment'));
    }
  }

  async assignSpecialties(instructorId: string, specialtyIds: string[]): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      for (const specialtyId of specialtyIds) {
        await pool.query(
          `INSERT INTO instructor_specialties (id, instructor_id, specialty_id, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (instructor_id, specialty_id) DO NOTHING`,
          [randomUUID(), instructorId, specialtyId, new Date()]
        );
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error assigning specialties to instructor'));
    }
  }

  async removeSpecialties(instructorId: string, specialtyIds: string[]): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      if (specialtyIds.length === 0) {
        return Ok(undefined);
      }

      const placeholders = specialtyIds.map((_, i) => `$${i + 2}`).join(', ');
      await pool.query(
        `DELETE FROM instructor_specialties 
         WHERE instructor_id = $1 AND specialty_id IN (${placeholders})`,
        [instructorId, ...specialtyIds]
      );

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error removing specialties from instructor'));
    }
  }
}
