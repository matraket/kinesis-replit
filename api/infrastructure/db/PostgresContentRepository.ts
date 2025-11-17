import type { PageContent, PublicationStatus, PageSection } from '../../domain/content/index.js';
import type { ContentRepository } from '../../application/ports/index.js';
import type { Result } from '../../../shared/types/index.js';
import { Ok, Err } from '../../../shared/types/index.js';
import { getDbPool } from './client.js';

export class PostgresContentRepository implements ContentRepository {
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
}
