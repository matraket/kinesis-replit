import type { PageContent, PublicationStatus, PageSection } from '../../domain/content/index.js';
import { createPageContent } from '../../domain/content/index.js';
import type { ContentRepository } from '../../application/ports/index.js';
import type { 
  IPageContentRepository,
  PageContentFilters,
  CreatePageContentInput,
  UpdatePageContentInput
} from '../../application/ports/IPageContentRepository.js';
import type { Result } from '../../../shared/types/index.js';
import { Ok, Err } from '../../../shared/types/index.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresContentRepository implements ContentRepository, IPageContentRepository {
  private readonly CRITICAL_PAGE_KEYS = [
    'home',
    'about-us',
    'business-models'
  ];

  private mapRowToPageContent(row: any): PageContent {
    return {
      id: row.id,
      pageKey: row.pageKey,
      pageTitle: row.pageTitle,
      contentHtml: row.contentHtml,
      contentJson: row.contentJson,
      sections: row.sections as PageSection[] | undefined,
      heroImageUrl: row.heroImageUrl,
      galleryImages: row.galleryImages,
      videoUrl: row.videoUrl,
      status: row.status as PublicationStatus,
      slug: row.slug,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      ogImageUrl: row.ogImageUrl,
      version: row.version,
      publishedVersion: row.publishedVersion,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
    };
  }

  async findBySlug(slug: string): Promise<Result<PageContent | null, Error>> {
    return this.getPageBySlug(slug);
  }

  async getPageBySlug(slug: string): Promise<Result<PageContent | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        WHERE slug = $1 AND status = 'published'`,
        [slug]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const page: PageContent = {
        ...row,
        status: row.status as PublicationStatus,
        sections: row.sections as PageSection[] | undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      };

      return Ok(page);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting page by slug'));
    }
  }

  async getPageByKey(pageKey: string): Promise<Result<PageContent | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        WHERE page_key = $1 AND status = 'published'`,
        [pageKey]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const page: PageContent = {
        ...row,
        status: row.status as PublicationStatus,
        sections: row.sections as PageSection[] | undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      };

      return Ok(page);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting page by key'));
    }
  }

  async listPublishedPages(): Promise<Result<PageContent[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        WHERE status = 'published'
        ORDER BY page_title`
      );

      const pages: PageContent[] = result.rows.map((row) => ({
        ...row,
        status: row.status as PublicationStatus,
        sections: row.sections as PageSection[] | undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      }));

      return Ok(pages);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing published pages'));
    }
  }

  async listMainNavigationItems(): Promise<Result<PageContent[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        WHERE status = 'published'
          AND page_key IN ('about', 'mission', 'values', 'team', 'contact')
        ORDER BY 
          CASE page_key
            WHEN 'about' THEN 1
            WHEN 'mission' THEN 2
            WHEN 'values' THEN 3
            WHEN 'team' THEN 4
            WHEN 'contact' THEN 5
          END`
      );

      const pages: PageContent[] = result.rows.map((row) => ({
        ...row,
        status: row.status as PublicationStatus,
        sections: row.sections as PageSection[] | undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : undefined,
      }));

      return Ok(pages);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing navigation items'));
    }
  }

  async listAll(filters: PageContentFilters): Promise<Result<{ pages: PageContent[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.status) {
        whereClause += ` AND status = $${paramIndex}`;
        queryParams.push(filters.status);
        paramIndex++;
      }
      
      if (filters.pageKey) {
        whereClause += ` AND page_key = $${paramIndex}`;
        queryParams.push(filters.pageKey);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM page_content ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        ${whereClause}
        ORDER BY page_title
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      const pages = dataResult.rows.map((row: any) => this.mapRowToPageContent(row));
      
      return Ok({ pages, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing pages'));
    }
  }

  async findById(id: string): Promise<Result<PageContent | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        WHERE id = $1
        LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const page = this.mapRowToPageContent(row);

      return Ok(page);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding page by ID'));
    }
  }

  async findByPageKey(pageKey: string): Promise<Result<PageContent | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, page_key as "pageKey",
          page_title as "pageTitle",
          content_html as "contentHtml",
          content_json as "contentJson",
          sections,
          hero_image_url as "heroImageUrl",
          gallery_images as "galleryImages",
          video_url as "videoUrl",
          status,
          slug,
          meta_title as "metaTitle",
          meta_description as "metaDescription",
          og_image_url as "ogImageUrl",
          version,
          published_version as "publishedVersion",
          created_at as "createdAt",
          updated_at as "updatedAt",
          published_at as "publishedAt"
        FROM page_content
        WHERE page_key = $1
        LIMIT 1`,
        [pageKey]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const page = this.mapRowToPageContent(row);

      return Ok(page);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding page by key'));
    }
  }

  async create(input: CreatePageContentInput): Promise<Result<PageContent, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO page_content (
          id, page_key, page_title,
          content_html, content_json, sections,
          hero_image_url, gallery_images, video_url,
          status, slug,
          meta_title, meta_description, og_image_url,
          version, created_at, updated_at
        ) VALUES (
          $1, $2, $3,
          $4, $5, $6,
          $7, $8, $9,
          $10, $11,
          $12, $13, $14,
          $15, $16, $17
        ) RETURNING *`,
        [
          id,
          input.pageKey,
          input.pageTitle,
          input.contentHtml,
          input.contentJson ? JSON.stringify(input.contentJson) : null,
          input.sections ? JSON.stringify(input.sections) : null,
          input.heroImageUrl,
          input.galleryImages,
          input.videoUrl,
          input.status ?? 'draft',
          input.slug,
          input.metaTitle,
          input.metaDescription,
          input.ogImageUrl,
          1,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const page = this.mapRowToPageContent({
        id: row.id,
        pageKey: row.page_key,
        pageTitle: row.page_title,
        contentHtml: row.content_html,
        contentJson: row.content_json,
        sections: row.sections,
        heroImageUrl: row.hero_image_url,
        galleryImages: row.gallery_images,
        videoUrl: row.video_url,
        status: row.status,
        slug: row.slug,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        ogImageUrl: row.og_image_url,
        version: row.version,
        publishedVersion: row.published_version,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        publishedAt: row.published_at,
      });

      return Ok(page);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating page'));
    }
  }

  async update(id: string, input: UpdatePageContentInput): Promise<Result<PageContent, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.pageKey !== undefined) {
        updates.push(`page_key = $${paramIndex++}`);
        values.push(input.pageKey);
      }
      if (input.pageTitle !== undefined) {
        updates.push(`page_title = $${paramIndex++}`);
        values.push(input.pageTitle);
      }
      if (input.contentHtml !== undefined) {
        updates.push(`content_html = $${paramIndex++}`);
        values.push(input.contentHtml);
      }
      if (input.contentJson !== undefined) {
        updates.push(`content_json = $${paramIndex++}`);
        values.push(input.contentJson ? JSON.stringify(input.contentJson) : null);
      }
      if (input.sections !== undefined) {
        updates.push(`sections = $${paramIndex++}`);
        values.push(input.sections ? JSON.stringify(input.sections) : null);
      }
      if (input.heroImageUrl !== undefined) {
        updates.push(`hero_image_url = $${paramIndex++}`);
        values.push(input.heroImageUrl);
      }
      if (input.galleryImages !== undefined) {
        updates.push(`gallery_images = $${paramIndex++}`);
        values.push(input.galleryImages);
      }
      if (input.videoUrl !== undefined) {
        updates.push(`video_url = $${paramIndex++}`);
        values.push(input.videoUrl);
      }
      if (input.status !== undefined) {
        updates.push(`status = $${paramIndex++}`);
        values.push(input.status);
        
        if (input.status === 'published') {
          updates.push(`published_at = $${paramIndex++}`);
          values.push(new Date());
        }
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
      if (input.ogImageUrl !== undefined) {
        updates.push(`og_image_url = $${paramIndex++}`);
        values.push(input.ogImageUrl);
      }

      if (updates.length === 0) {
        const existingResult = await this.findById(id);
        if (!existingResult.ok) {
          return existingResult;
        }
        if (!existingResult.value) {
          return Err(new Error('Page not found'));
        }
        return Ok(existingResult.value);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      updates.push(`version = version + 1`);

      values.push(id);

      const query = `
        UPDATE page_content
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('Page not found'));
      }

      const row = result.rows[0];
      const page = this.mapRowToPageContent({
        id: row.id,
        pageKey: row.page_key,
        pageTitle: row.page_title,
        contentHtml: row.content_html,
        contentJson: row.content_json,
        sections: row.sections,
        heroImageUrl: row.hero_image_url,
        galleryImages: row.gallery_images,
        videoUrl: row.video_url,
        status: row.status,
        slug: row.slug,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        ogImageUrl: row.og_image_url,
        version: row.version,
        publishedVersion: row.published_version,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        publishedAt: row.published_at,
      });

      return Ok(page);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating page'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      const pageResult = await this.findById(id);
      if (!pageResult.ok) {
        return pageResult;
      }
      
      if (!pageResult.value) {
        return Err(new Error('Page not found'));
      }
      
      const page = pageResult.value;
      if (this.CRITICAL_PAGE_KEYS.includes(page.pageKey)) {
        return Err(new Error(
          `Cannot delete critical page '${page.pageKey}'. ` +
          `Set status='archived' or status='draft' instead.`
        ));
      }

      const result = await pool.query('DELETE FROM page_content WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Page not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting page'));
    }
  }
}
