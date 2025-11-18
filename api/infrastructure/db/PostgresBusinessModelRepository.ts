import { 
  IBusinessModelRepository,
  BusinessModelFilters,
  CreateBusinessModelInput,
  UpdateBusinessModelInput
} from '../../application/ports/IBusinessModelRepository.js';
import { BusinessModel, createBusinessModel } from '../../domain/business-models/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresBusinessModelRepository implements IBusinessModelRepository {
  private readonly CRITICAL_INTERNAL_CODES = [
    'elite_on_demand',
    'ritmo_constante',
    'generacion_dance',
    'si_quiero_bailar'
  ];

  private mapRowToBusinessModel(row: any): BusinessModel {
    return createBusinessModel({
      id: row.id,
      internalCode: row.internalCode,
      name: row.name,
      subtitle: row.subtitle,
      description: row.description,
      scheduleInfo: row.scheduleInfo,
      targetAudience: row.targetAudience,
      format: row.format,
      featureTitle: row.featureTitle,
      featureContent: row.featureContent,
      advantageTitle: row.advantageTitle,
      advantageContent: row.advantageContent,
      benefitTitle: row.benefitTitle,
      benefitContent: row.benefitContent,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
      showOnWeb: row.showOnWeb,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      slug: row.slug,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async listPublished(): Promise<Result<BusinessModel[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, internal_code as "internalCode", name, subtitle, description,
          schedule_info as "scheduleInfo", target_audience as "targetAudience", 
          format, feature_title as "featureTitle", feature_content as "featureContent",
          advantage_title as "advantageTitle", advantage_content as "advantageContent",
          benefit_title as "benefitTitle", benefit_content as "benefitContent",
          display_order as "displayOrder", is_active as "isActive", 
          show_on_web as "showOnWeb", meta_title as "metaTitle", 
          meta_description as "metaDescription", slug, 
          created_at as "createdAt", updated_at as "updatedAt"
         FROM business_models
         WHERE is_active = true AND show_on_web = true
         ORDER BY display_order ASC, name ASC`
      );

      const businessModels = result.rows.map((row: any) => this.mapRowToBusinessModel(row));

      return Ok(businessModels);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing business models'));
    }
  }

  async findBySlug(slug: string): Promise<Result<BusinessModel | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, internal_code as "internalCode", name, subtitle, description,
          schedule_info as "scheduleInfo", target_audience as "targetAudience", 
          format, feature_title as "featureTitle", feature_content as "featureContent",
          advantage_title as "advantageTitle", advantage_content as "advantageContent",
          benefit_title as "benefitTitle", benefit_content as "benefitContent",
          display_order as "displayOrder", is_active as "isActive", 
          show_on_web as "showOnWeb", meta_title as "metaTitle", 
          meta_description as "metaDescription", slug, 
          created_at as "createdAt", updated_at as "updatedAt"
         FROM business_models
         WHERE slug = $1 AND is_active = true AND show_on_web = true
         LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const businessModel = this.mapRowToBusinessModel(row);

      return Ok(businessModel);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding business model'));
    }
  }

  async listAll(filters: BusinessModelFilters): Promise<Result<{ businessModels: BusinessModel[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.isActive !== undefined) {
        whereClause += ` AND is_active = $${paramIndex}`;
        queryParams.push(filters.isActive);
        paramIndex++;
      }
      
      if (filters.showOnWeb !== undefined) {
        whereClause += ` AND show_on_web = $${paramIndex}`;
        queryParams.push(filters.showOnWeb);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM business_models ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          id, internal_code as "internalCode", name, subtitle, description,
          schedule_info as "scheduleInfo", target_audience as "targetAudience", 
          format, feature_title as "featureTitle", feature_content as "featureContent",
          advantage_title as "advantageTitle", advantage_content as "advantageContent",
          benefit_title as "benefitTitle", benefit_content as "benefitContent",
          display_order as "displayOrder", is_active as "isActive", 
          show_on_web as "showOnWeb", meta_title as "metaTitle", 
          meta_description as "metaDescription", slug, 
          created_at as "createdAt", updated_at as "updatedAt"
        FROM business_models
        ${whereClause}
        ORDER BY display_order, name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      const businessModels = dataResult.rows.map((row: any) => this.mapRowToBusinessModel(row));
      
      return Ok({ businessModels, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing business models'));
    }
  }

  async findById(id: string): Promise<Result<BusinessModel | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, internal_code as "internalCode", name, subtitle, description,
          schedule_info as "scheduleInfo", target_audience as "targetAudience", 
          format, feature_title as "featureTitle", feature_content as "featureContent",
          advantage_title as "advantageTitle", advantage_content as "advantageContent",
          benefit_title as "benefitTitle", benefit_content as "benefitContent",
          display_order as "displayOrder", is_active as "isActive", 
          show_on_web as "showOnWeb", meta_title as "metaTitle", 
          meta_description as "metaDescription", slug, 
          created_at as "createdAt", updated_at as "updatedAt"
         FROM business_models
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const businessModel = this.mapRowToBusinessModel(row);

      return Ok(businessModel);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding business model by ID'));
    }
  }

  async findByInternalCode(internalCode: string): Promise<Result<BusinessModel | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, internal_code as "internalCode", name, subtitle, description,
          schedule_info as "scheduleInfo", target_audience as "targetAudience", 
          format, feature_title as "featureTitle", feature_content as "featureContent",
          advantage_title as "advantageTitle", advantage_content as "advantageContent",
          benefit_title as "benefitTitle", benefit_content as "benefitContent",
          display_order as "displayOrder", is_active as "isActive", 
          show_on_web as "showOnWeb", meta_title as "metaTitle", 
          meta_description as "metaDescription", slug, 
          created_at as "createdAt", updated_at as "updatedAt"
         FROM business_models
         WHERE internal_code = $1
         LIMIT 1`,
        [internalCode]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const businessModel = this.mapRowToBusinessModel(row);

      return Ok(businessModel);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding business model by internal code'));
    }
  }

  async create(input: CreateBusinessModelInput): Promise<Result<BusinessModel, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO business_models (
          id, internal_code, name, subtitle, description,
          schedule_info, target_audience, format,
          feature_title, feature_content,
          advantage_title, advantage_content,
          benefit_title, benefit_content,
          display_order, is_active, show_on_web,
          meta_title, meta_description, slug,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12,
          $13, $14,
          $15, $16, $17,
          $18, $19, $20,
          $21, $22
        ) RETURNING *`,
        [
          id,
          input.internalCode,
          input.name,
          input.subtitle,
          input.description,
          input.scheduleInfo,
          input.targetAudience,
          input.format,
          input.featureTitle,
          input.featureContent,
          input.advantageTitle,
          input.advantageContent,
          input.benefitTitle,
          input.benefitContent,
          input.displayOrder ?? 0,
          input.isActive ?? true,
          input.showOnWeb ?? true,
          input.metaTitle,
          input.metaDescription,
          input.slug,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const businessModel = this.mapRowToBusinessModel({
        id: row.id,
        internalCode: row.internal_code,
        name: row.name,
        subtitle: row.subtitle,
        description: row.description,
        scheduleInfo: row.schedule_info,
        targetAudience: row.target_audience,
        format: row.format,
        featureTitle: row.feature_title,
        featureContent: row.feature_content,
        advantageTitle: row.advantage_title,
        advantageContent: row.advantage_content,
        benefitTitle: row.benefit_title,
        benefitContent: row.benefit_content,
        displayOrder: row.display_order,
        isActive: row.is_active,
        showOnWeb: row.show_on_web,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        slug: row.slug,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      return Ok(businessModel);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating business model'));
    }
  }

  async update(id: string, input: UpdateBusinessModelInput): Promise<Result<BusinessModel, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.internalCode !== undefined) {
        updates.push(`internal_code = $${paramIndex++}`);
        values.push(input.internalCode);
      }
      if (input.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.subtitle !== undefined) {
        updates.push(`subtitle = $${paramIndex++}`);
        values.push(input.subtitle);
      }
      if (input.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.scheduleInfo !== undefined) {
        updates.push(`schedule_info = $${paramIndex++}`);
        values.push(input.scheduleInfo);
      }
      if (input.targetAudience !== undefined) {
        updates.push(`target_audience = $${paramIndex++}`);
        values.push(input.targetAudience);
      }
      if (input.format !== undefined) {
        updates.push(`format = $${paramIndex++}`);
        values.push(input.format);
      }
      if (input.featureTitle !== undefined) {
        updates.push(`feature_title = $${paramIndex++}`);
        values.push(input.featureTitle);
      }
      if (input.featureContent !== undefined) {
        updates.push(`feature_content = $${paramIndex++}`);
        values.push(input.featureContent);
      }
      if (input.advantageTitle !== undefined) {
        updates.push(`advantage_title = $${paramIndex++}`);
        values.push(input.advantageTitle);
      }
      if (input.advantageContent !== undefined) {
        updates.push(`advantage_content = $${paramIndex++}`);
        values.push(input.advantageContent);
      }
      if (input.benefitTitle !== undefined) {
        updates.push(`benefit_title = $${paramIndex++}`);
        values.push(input.benefitTitle);
      }
      if (input.benefitContent !== undefined) {
        updates.push(`benefit_content = $${paramIndex++}`);
        values.push(input.benefitContent);
      }
      if (input.displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        values.push(input.displayOrder);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }
      if (input.showOnWeb !== undefined) {
        updates.push(`show_on_web = $${paramIndex++}`);
        values.push(input.showOnWeb);
      }
      if (input.metaTitle !== undefined) {
        updates.push(`meta_title = $${paramIndex++}`);
        values.push(input.metaTitle);
      }
      if (input.metaDescription !== undefined) {
        updates.push(`meta_description = $${paramIndex++}`);
        values.push(input.metaDescription);
      }
      if (input.slug !== undefined) {
        updates.push(`slug = $${paramIndex++}`);
        values.push(input.slug);
      }

      if (updates.length === 0) {
        const existingResult = await this.findById(id);
        if (!existingResult.ok) {
          return existingResult;
        }
        if (!existingResult.value) {
          return Err(new Error('Business model not found'));
        }
        return Ok(existingResult.value);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const query = `
        UPDATE business_models
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('Business model not found'));
      }

      const row = result.rows[0];
      const businessModel = this.mapRowToBusinessModel({
        id: row.id,
        internalCode: row.internal_code,
        name: row.name,
        subtitle: row.subtitle,
        description: row.description,
        scheduleInfo: row.schedule_info,
        targetAudience: row.target_audience,
        format: row.format,
        featureTitle: row.feature_title,
        featureContent: row.feature_content,
        advantageTitle: row.advantage_title,
        advantageContent: row.advantage_content,
        benefitTitle: row.benefit_title,
        benefitContent: row.benefit_content,
        displayOrder: row.display_order,
        isActive: row.is_active,
        showOnWeb: row.show_on_web,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        slug: row.slug,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      return Ok(businessModel);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating business model'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      const businessModelResult = await this.findById(id);
      if (!businessModelResult.ok) {
        return businessModelResult;
      }
      
      if (!businessModelResult.value) {
        return Err(new Error('Business model not found'));
      }
      
      const businessModel = businessModelResult.value;
      if (this.CRITICAL_INTERNAL_CODES.includes(businessModel.internalCode)) {
        return Err(new Error(
          `Cannot delete critical business model '${businessModel.internalCode}'. ` +
          `Set is_active=false or show_on_web=false instead.`
        ));
      }

      const result = await pool.query('DELETE FROM business_models WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Business model not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting business model'));
    }
  }
}
