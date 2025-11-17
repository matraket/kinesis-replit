import { IInstructorRepository, InstructorFilters } from '../../application/ports/IInstructorRepository.js';
import { Instructor, createInstructor } from '../../domain/instructors/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';

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
}
