import { 
  IFAQRepository, 
  FAQFilters,
  AdminFAQFilters,
  CreateFAQInput,
  UpdateFAQInput
} from '../../application/ports/IFAQRepository.js';
import { FAQ, createFAQ } from '../../domain/faqs/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresFAQRepository implements IFAQRepository {
  private mapRowToFAQ(row: any): FAQ {
    return createFAQ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      tags: row.tags,
      programId: row.programId,
      businessModelId: row.businessModelId,
      displayOrder: row.displayOrder,
      isFeatured: row.isFeatured,
      isActive: row.isActive,
      viewCount: row.viewCount,
      helpfulCount: row.helpfulCount,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
  async listPublishedWithFilters(filters: FAQFilters): Promise<Result<{ faqs: FAQ[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE f.is_active = true';
      
      if (filters.category) {
        whereClause += ` AND f.category = $${paramIndex}`;
        queryParams.push(filters.category);
        paramIndex++;
      }
      
      if (filters.businessModelSlug) {
        whereClause += ` AND bm.slug = $${paramIndex}`;
        queryParams.push(filters.businessModelSlug);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `
        SELECT COUNT(*)
        FROM faqs f
        LEFT JOIN business_models bm ON f.business_model_id = bm.id
        ${whereClause}
      `;
      
      const dataQuery = `
        SELECT 
          f.id, f.question, f.answer, f.category, f.tags,
          f.program_id as "programId", f.business_model_id as "businessModelId",
          f.display_order as "displayOrder", f.is_featured as "isFeatured",
          f.is_active as "isActive", f.view_count as "viewCount",
          f.helpful_count as "helpfulCount",
          f.created_at as "createdAt", f.updated_at as "updatedAt"
        FROM faqs f
        LEFT JOIN business_models bm ON f.business_model_id = bm.id
        ${whereClause}
        ORDER BY f.display_order, f.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const faqs = dataResult.rows.map((row: any) => this.mapRowToFAQ(row));

      return Ok({ faqs, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing FAQs'));
    }
  }

  async listAll(filters: AdminFAQFilters): Promise<Result<{ faqs: FAQ[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.isActive !== undefined) {
        whereClause += ` AND f.is_active = $${paramIndex}`;
        queryParams.push(filters.isActive);
        paramIndex++;
      }
      
      if (filters.category) {
        whereClause += ` AND f.category = $${paramIndex}`;
        queryParams.push(filters.category);
        paramIndex++;
      }
      
      if (filters.businessModelId) {
        whereClause += ` AND f.business_model_id = $${paramIndex}`;
        queryParams.push(filters.businessModelId);
        paramIndex++;
      }
      
      if (filters.programId) {
        whereClause += ` AND f.program_id = $${paramIndex}`;
        queryParams.push(filters.programId);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM faqs f ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          f.id, f.question, f.answer, f.category, f.tags,
          f.program_id as "programId", f.business_model_id as "businessModelId",
          f.display_order as "displayOrder", f.is_featured as "isFeatured",
          f.is_active as "isActive", f.view_count as "viewCount",
          f.helpful_count as "helpfulCount",
          f.created_at as "createdAt", f.updated_at as "updatedAt"
        FROM faqs f
        ${whereClause}
        ORDER BY f.display_order, f.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      const faqs = dataResult.rows.map((row: any) => this.mapRowToFAQ(row));
      
      return Ok({ faqs, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing all FAQs'));
    }
  }

  async findById(id: string): Promise<Result<FAQ | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, question, answer, category, tags,
          program_id as "programId", business_model_id as "businessModelId",
          display_order as "displayOrder", is_featured as "isFeatured",
          is_active as "isActive", view_count as "viewCount",
          helpful_count as "helpfulCount",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM faqs
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const faq = this.mapRowToFAQ(row);

      return Ok(faq);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding FAQ by ID'));
    }
  }

  async create(input: CreateFAQInput): Promise<Result<FAQ, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO faqs (
          id, question, answer, category, tags,
          program_id, business_model_id,
          display_order, is_featured, is_active,
          view_count, helpful_count,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7,
          $8, $9, $10,
          $11, $12,
          $13, $14
        ) RETURNING *`,
        [
          id,
          input.question,
          input.answer,
          input.category,
          input.tags,
          input.programId,
          input.businessModelId,
          input.displayOrder ?? 0,
          input.isFeatured ?? false,
          input.isActive ?? true,
          0,
          0,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const faq = this.mapRowToFAQ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        programId: row.program_id,
        businessModelId: row.business_model_id,
        displayOrder: row.display_order,
        isFeatured: row.is_featured,
        isActive: row.is_active,
        viewCount: row.view_count,
        helpfulCount: row.helpful_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      return Ok(faq);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating FAQ'));
    }
  }

  async update(id: string, input: UpdateFAQInput): Promise<Result<FAQ, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.question !== undefined) {
        updates.push(`question = $${paramIndex++}`);
        values.push(input.question);
      }
      if (input.answer !== undefined) {
        updates.push(`answer = $${paramIndex++}`);
        values.push(input.answer);
      }
      if (input.category !== undefined) {
        updates.push(`category = $${paramIndex++}`);
        values.push(input.category);
      }
      if (input.tags !== undefined) {
        updates.push(`tags = $${paramIndex++}`);
        values.push(input.tags);
      }
      if (input.programId !== undefined) {
        updates.push(`program_id = $${paramIndex++}`);
        values.push(input.programId);
      }
      if (input.businessModelId !== undefined) {
        updates.push(`business_model_id = $${paramIndex++}`);
        values.push(input.businessModelId);
      }
      if (input.displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        values.push(input.displayOrder);
      }
      if (input.isFeatured !== undefined) {
        updates.push(`is_featured = $${paramIndex++}`);
        values.push(input.isFeatured);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const query = `
        UPDATE faqs
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('FAQ not found'));
      }

      const row = result.rows[0];
      const faq = this.mapRowToFAQ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        programId: row.program_id,
        businessModelId: row.business_model_id,
        displayOrder: row.display_order,
        isFeatured: row.is_featured,
        isActive: row.is_active,
        viewCount: row.view_count,
        helpfulCount: row.helpful_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      return Ok(faq);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating FAQ'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('DELETE FROM faqs WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('FAQ not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting FAQ'));
    }
  }
}
