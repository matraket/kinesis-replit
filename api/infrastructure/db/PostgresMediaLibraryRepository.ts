import { randomUUID } from 'crypto';
import { Ok, Err, Result } from '../../../shared/types/Result.js';
import { getDbPool } from './index.js';
import { MediaLibrary, CreateMediaInput, MediaFilters, createMedia } from '../../domain/entities/MediaLibrary.js';
import { IMediaLibraryRepository } from '../../domain/repositories/IMediaLibraryRepository.js';

export class PostgresMediaLibraryRepository implements IMediaLibraryRepository {
  async list(filters: MediaFilters): Promise<Result<{ media: MediaLibrary[]; total: number }, Error>> {
    try {
      const pool = getDbPool();
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      let whereClause = 'WHERE 1=1';
      
      if (filters.folder) {
        whereClause += ` AND folder = $${paramIndex}`;
        queryParams.push(filters.folder);
        paramIndex++;
      }
      
      if (filters.search) {
        whereClause += ` AND (filename ILIKE $${paramIndex} OR original_name ILIKE $${paramIndex} OR alt_text ILIKE $${paramIndex})`;
        queryParams.push(`%${filters.search}%`);
        paramIndex++;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        whereClause += ` AND tags && $${paramIndex}`;
        queryParams.push(filters.tags);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 50;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM media_library ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          id, filename, original_name as "originalName",
          mime_type as "mimeType", size_bytes as "sizeBytes",
          url, thumbnail_url as "thumbnailUrl",
          alt_text as "altText", caption, tags, folder,
          uploaded_at as "uploadedAt", uploaded_by as "uploadedBy",
          updated_at as "updatedAt"
        FROM media_library
        ${whereClause}
        ORDER BY uploaded_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const media = dataResult.rows.map((row: any) => ({
        id: row.id,
        filename: row.filename,
        originalName: row.originalName,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        url: row.url,
        thumbnailUrl: row.thumbnailUrl,
        altText: row.altText,
        caption: row.caption,
        tags: row.tags,
        folder: row.folder,
        uploadedAt: new Date(row.uploadedAt),
        uploadedBy: row.uploadedBy,
        updatedAt: new Date(row.updatedAt),
      }));
      
      return Ok({ media, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing media'));
    }
  }

  async findById(id: string): Promise<Result<MediaLibrary | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, filename, original_name as "originalName",
          mime_type as "mimeType", size_bytes as "sizeBytes",
          url, thumbnail_url as "thumbnailUrl",
          alt_text as "altText", caption, tags, folder,
          uploaded_at as "uploadedAt", uploaded_by as "uploadedBy",
          updated_at as "updatedAt"
        FROM media_library
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const media: MediaLibrary = {
        id: row.id,
        filename: row.filename,
        originalName: row.originalName,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        url: row.url,
        thumbnailUrl: row.thumbnailUrl,
        altText: row.altText,
        caption: row.caption,
        tags: row.tags,
        folder: row.folder,
        uploadedAt: new Date(row.uploadedAt),
        uploadedBy: row.uploadedBy,
        updatedAt: new Date(row.updatedAt),
      };

      return Ok(media);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding media'));
    }
  }

  async create(input: CreateMediaInput): Promise<Result<MediaLibrary, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const media = createMedia(id, input);

      await pool.query(
        `INSERT INTO media_library (
          id, filename, original_name, mime_type, size_bytes,
          url, thumbnail_url, alt_text, caption, tags, folder,
          uploaded_at, uploaded_by, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          media.id,
          media.filename,
          media.originalName,
          media.mimeType,
          media.sizeBytes,
          media.url,
          media.thumbnailUrl,
          media.altText,
          media.caption,
          media.tags,
          media.folder,
          media.uploadedAt,
          media.uploadedBy,
          media.updatedAt,
        ]
      );

      return Ok(media);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating media'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query('DELETE FROM media_library WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Media not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting media'));
    }
  }
}
