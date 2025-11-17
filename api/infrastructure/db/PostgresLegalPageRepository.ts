import { ILegalPageRepository } from '../../application/ports/ILegalPageRepository.js';
import { LegalPage, createLegalPage } from '../../domain/legal-pages/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';

export class PostgresLegalPageRepository implements ILegalPageRepository {
  async listCurrent(): Promise<Result<LegalPage[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_type as "pageType", title, content, version,
          effective_date as "effectiveDate", is_current as "isCurrent",
          slug, created_at as "createdAt", approved_at as "approvedAt"
         FROM legal_pages
         WHERE is_current = true
         ORDER BY page_type`
      );

      const legalPages = result.rows.map((row: any) => createLegalPage({
        id: row.id,
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
        createdAt: new Date(row.createdAt),
        approvedAt: row.approvedAt ? new Date(row.approvedAt) : undefined,
      }));

      return Ok(legalPages);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing legal pages'));
    }
  }

  async findBySlug(slug: string): Promise<Result<LegalPage | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_type as "pageType", title, content, version,
          effective_date as "effectiveDate", is_current as "isCurrent",
          slug, created_at as "createdAt", approved_at as "approvedAt"
         FROM legal_pages
         WHERE slug = $1 AND is_current = true
         LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const legalPage = createLegalPage({
        id: row.id,
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
        createdAt: new Date(row.createdAt),
        approvedAt: row.approvedAt ? new Date(row.approvedAt) : undefined,
      });

      return Ok(legalPage);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding legal page'));
    }
  }
}
