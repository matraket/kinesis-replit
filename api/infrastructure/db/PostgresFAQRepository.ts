import { IFAQRepository, FAQFilters } from '../../application/ports/IFAQRepository.js';
import { FAQ, createFAQ } from '../../domain/faqs/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';

export class PostgresFAQRepository implements IFAQRepository {
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
      
      const faqs = dataResult.rows.map((row: any) => createFAQ({
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
      }));

      return Ok({ faqs, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing FAQs'));
    }
  }
}
