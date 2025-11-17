import { IPricingTierRepository, PricingTierFilters } from '../../application/ports/IPricingTierRepository.js';
import { PricingTier, createPricingTier } from '../../domain/pricing-tiers/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';

export class PostgresPricingTierRepository implements IPricingTierRepository {
  async listPublished(filters: PricingTierFilters): Promise<Result<PricingTier[], Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE pt.is_active = true';
      
      if (filters.programSlug) {
        whereClause += ` AND p.slug = $${paramIndex}`;
        queryParams.push(filters.programSlug);
        paramIndex++;
      }
      
      if (filters.businessModelSlug) {
        whereClause += ` AND bm.slug = $${paramIndex}`;
        queryParams.push(filters.businessModelSlug);
        paramIndex++;
      }
      
      const query = `
        SELECT 
          pt.id, pt.program_id as "programId", pt.name, pt.description,
          pt.price, pt.original_price as "originalPrice",
          pt.sessions_included as "sessionsIncluded",
          pt.validity_days as "validityDays", pt.max_students as "maxStudents",
          pt.conditions, pt.display_order as "displayOrder",
          pt.is_active as "isActive", pt.is_featured as "isFeatured",
          pt.created_at as "createdAt", pt.updated_at as "updatedAt"
        FROM pricing_tiers pt
        LEFT JOIN programs p ON pt.program_id = p.id
        LEFT JOIN business_models bm ON p.business_model_id = bm.id
        ${whereClause}
        ORDER BY pt.display_order, pt.name
      `;
      
      const result = await pool.query(query, queryParams);
      
      const pricingTiers = result.rows.map((row: any) => createPricingTier({
        id: row.id,
        programId: row.programId,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : undefined,
        sessionsIncluded: row.sessionsIncluded,
        validityDays: row.validityDays,
        maxStudents: row.maxStudents,
        conditions: row.conditions,
        displayOrder: row.displayOrder,
        isActive: row.isActive,
        isFeatured: row.isFeatured,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));

      return Ok(pricingTiers);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing pricing tiers'));
    }
  }
}
