import { 
  IPricingTierRepository, 
  PricingTierFilters, 
  AdminPricingTierFilters, 
  CreatePricingTierInput, 
  UpdatePricingTierInput 
} from '../../application/ports/IPricingTierRepository.js';
import { PricingTier, createPricingTier } from '../../domain/pricing-tiers/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

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

  async listAll(filters: AdminPricingTierFilters): Promise<Result<{ pricingTiers: PricingTier[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.programId) {
        whereClause += ` AND pt.program_id = $${paramIndex}`;
        queryParams.push(filters.programId);
        paramIndex++;
      }
      
      if (filters.isActive !== undefined) {
        whereClause += ` AND pt.is_active = $${paramIndex}`;
        queryParams.push(filters.isActive);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM pricing_tiers pt ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          pt.id, pt.program_id as "programId", pt.name, pt.description,
          pt.price, pt.original_price as "originalPrice",
          pt.sessions_included as "sessionsIncluded",
          pt.validity_days as "validityDays", pt.max_students as "maxStudents",
          pt.conditions, pt.display_order as "displayOrder",
          pt.is_active as "isActive", pt.is_featured as "isFeatured",
          pt.created_at as "createdAt", pt.updated_at as "updatedAt"
        FROM pricing_tiers pt
        ${whereClause}
        ORDER BY pt.display_order, pt.name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const pricingTiers = dataResult.rows.map((row: any) => createPricingTier({
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

      return Ok({ pricingTiers, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing all pricing tiers'));
    }
  }

  async findById(id: string): Promise<Result<PricingTier | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, program_id as "programId", name, description,
          price, original_price as "originalPrice",
          sessions_included as "sessionsIncluded",
          validity_days as "validityDays", max_students as "maxStudents",
          conditions, display_order as "displayOrder",
          is_active as "isActive", is_featured as "isFeatured",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM pricing_tiers
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const pricingTier = createPricingTier({
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
      });

      return Ok(pricingTier);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding pricing tier'));
    }
  }

  async create(input: CreatePricingTierInput): Promise<Result<PricingTier, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO pricing_tiers (
          id, program_id, name, description, price, original_price,
          sessions_included, validity_days, max_students, conditions,
          display_order, is_active, is_featured,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15
        ) RETURNING *`,
        [
          id,
          input.programId,
          input.name,
          input.description,
          input.price,
          input.originalPrice,
          input.sessionsIncluded,
          input.validityDays,
          input.maxStudents,
          input.conditions,
          input.displayOrder ?? 0,
          input.isActive ?? true,
          input.isFeatured ?? false,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const pricingTier = createPricingTier({
        id: row.id,
        programId: row.program_id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
        sessionsIncluded: row.sessions_included,
        validityDays: row.validity_days,
        maxStudents: row.max_students,
        conditions: row.conditions,
        displayOrder: row.display_order,
        isActive: row.is_active,
        isFeatured: row.is_featured,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });

      return Ok(pricingTier);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating pricing tier'));
    }
  }

  async update(id: string, input: UpdatePricingTierInput): Promise<Result<PricingTier, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.programId !== undefined) {
        updates.push(`program_id = $${paramIndex++}`);
        values.push(input.programId);
      }
      if (input.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.price !== undefined) {
        updates.push(`price = $${paramIndex++}`);
        values.push(input.price);
      }
      if (input.originalPrice !== undefined) {
        updates.push(`original_price = $${paramIndex++}`);
        values.push(input.originalPrice);
      }
      if (input.sessionsIncluded !== undefined) {
        updates.push(`sessions_included = $${paramIndex++}`);
        values.push(input.sessionsIncluded);
      }
      if (input.validityDays !== undefined) {
        updates.push(`validity_days = $${paramIndex++}`);
        values.push(input.validityDays);
      }
      if (input.maxStudents !== undefined) {
        updates.push(`max_students = $${paramIndex++}`);
        values.push(input.maxStudents);
      }
      if (input.conditions !== undefined) {
        updates.push(`conditions = $${paramIndex++}`);
        values.push(input.conditions);
      }
      if (input.displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        values.push(input.displayOrder);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }
      if (input.isFeatured !== undefined) {
        updates.push(`is_featured = $${paramIndex++}`);
        values.push(input.isFeatured);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const query = `
        UPDATE pricing_tiers
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('Pricing tier not found'));
      }

      const row = result.rows[0];
      const pricingTier = createPricingTier({
        id: row.id,
        programId: row.program_id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
        sessionsIncluded: row.sessions_included,
        validityDays: row.validity_days,
        maxStudents: row.max_students,
        conditions: row.conditions,
        displayOrder: row.display_order,
        isActive: row.is_active,
        isFeatured: row.is_featured,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });

      return Ok(pricingTier);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating pricing tier'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('DELETE FROM pricing_tiers WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Pricing tier not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting pricing tier'));
    }
  }
}
