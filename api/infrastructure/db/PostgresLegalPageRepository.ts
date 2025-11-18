import { randomUUID } from 'crypto';
import { ILegalPageRepository } from '../../application/ports/ILegalPageRepository.js';
import { LegalPage, CreateLegalPageInput, UpdateLegalPageInput, createLegalPage, updateLegalPage } from '../../domain/legal-pages/index.js';
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

      const legalPages = result.rows.map((row: any) => createLegalPage(row.id, {
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
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
      const legalPage = createLegalPage(row.id, {
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
      });

      return Ok(legalPage);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding legal page'));
    }
  }

  async list(pageType?: string): Promise<Result<LegalPage[], Error>> {
    try {
      const pool = getDbPool();
      
      let query = `
        SELECT 
          id, page_type as "pageType", title, content, version,
          effective_date as "effectiveDate", is_current as "isCurrent",
          slug, created_at as "createdAt", approved_at as "approvedAt"
        FROM legal_pages
      `;
      
      const params: any[] = [];
      
      if (pageType) {
        query += ` WHERE page_type = $1`;
        params.push(pageType);
      }
      
      query += ` ORDER BY page_type, created_at DESC`;
      
      const result = await pool.query(query, params);

      const legalPages = result.rows.map((row: any) => createLegalPage(row.id, {
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
      }));

      return Ok(legalPages);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing legal pages'));
    }
  }

  async findById(id: string): Promise<Result<LegalPage | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_type as "pageType", title, content, version,
          effective_date as "effectiveDate", is_current as "isCurrent",
          slug, created_at as "createdAt", approved_at as "approvedAt"
        FROM legal_pages
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const legalPage = createLegalPage(row.id, {
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
      });

      return Ok(legalPage);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding legal page by ID'));
    }
  }

  async findByType(pageType: string): Promise<Result<LegalPage | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_type as "pageType", title, content, version,
          effective_date as "effectiveDate", is_current as "isCurrent",
          slug, created_at as "createdAt", approved_at as "approvedAt"
        FROM legal_pages
        WHERE page_type = $1
        ORDER BY is_current DESC, created_at DESC
        LIMIT 1`,
        [pageType]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const legalPage = createLegalPage(row.id, {
        pageType: row.pageType,
        title: row.title,
        content: row.content,
        version: row.version,
        effectiveDate: new Date(row.effectiveDate),
        isCurrent: row.isCurrent,
        slug: row.slug,
      });

      return Ok(legalPage);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding legal page by type'));
    }
  }

  async create(input: CreateLegalPageInput): Promise<Result<LegalPage, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const legalPage = createLegalPage(id, input);

      if (legalPage.isCurrent) {
        await pool.query(
          `UPDATE legal_pages SET is_current = false WHERE page_type = $1`,
          [legalPage.pageType]
        );
      }

      await pool.query(
        `INSERT INTO legal_pages (
          id, page_type, title, content, version, effective_date,
          is_current, slug, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          legalPage.id,
          legalPage.pageType,
          legalPage.title,
          legalPage.content,
          legalPage.version,
          legalPage.effectiveDate,
          legalPage.isCurrent,
          legalPage.slug,
          legalPage.createdAt,
        ]
      );

      return Ok(legalPage);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating legal page'));
    }
  }

  async update(id: string, input: UpdateLegalPageInput): Promise<Result<LegalPage, Error>> {
    try {
      const pool = getDbPool();
      
      const existingResult = await this.findById(id);
      if (existingResult.isErr()) {
        return existingResult;
      }
      
      const existing = existingResult.value;
      if (!existing) {
        return Err(new Error(`Legal page with id ${id} not found`));
      }

      const updated = updateLegalPage(existing, input);

      if (updated.isCurrent && !existing.isCurrent) {
        await pool.query(
          `UPDATE legal_pages SET is_current = false WHERE page_type = $1 AND id != $2`,
          [updated.pageType, id]
        );
      }

      await pool.query(
        `UPDATE legal_pages 
        SET title = $1, content = $2, version = $3, effective_date = $4,
            is_current = $5, slug = $6
        WHERE id = $7`,
        [
          updated.title,
          updated.content,
          updated.version,
          updated.effectiveDate,
          updated.isCurrent,
          updated.slug,
          id,
        ]
      );

      return Ok(updated);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating legal page'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      const existingResult = await this.findById(id);
      if (existingResult.isErr()) {
        return existingResult;
      }
      
      const existing = existingResult.value;
      if (!existing) {
        return Err(new Error(`Legal page with id ${id} not found`));
      }

      const standardTypes = ['legal', 'privacy', 'cookies', 'terms'];
      if (standardTypes.includes(existing.pageType)) {
        return Err(new Error(`Cannot delete standard legal page type: ${existing.pageType}`));
      }

      await pool.query(`DELETE FROM legal_pages WHERE id = $1`, [id]);

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting legal page'));
    }
  }
}
