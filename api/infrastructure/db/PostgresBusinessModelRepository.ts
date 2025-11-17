import { IBusinessModelRepository } from '../../application/ports/IBusinessModelRepository.js';
import { BusinessModel, createBusinessModel } from '../../domain/business-models/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';

export class PostgresBusinessModelRepository implements IBusinessModelRepository {
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

      const businessModels = result.rows.map((row: any) => createBusinessModel({
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
      }));

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
      const businessModel = createBusinessModel({
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

      return Ok(businessModel);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding business model'));
    }
  }
}
