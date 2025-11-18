import { 
  ISpecialtyRepository, 
  SpecialtyFilters, 
  CreateSpecialtyInput, 
  UpdateSpecialtyInput 
} from '../../application/ports/ISpecialtyRepository.js';
import { Specialty, createSpecialty } from '../../domain/specialties/index.js';
import { Result, Ok, Err } from '../../../shared/types/Result.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresSpecialtyRepository implements ISpecialtyRepository {
  async listAll(filters: SpecialtyFilters): Promise<Result<{ specialties: Specialty[]; total: number }, Error>> {
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
      
      if (filters.category) {
        whereClause += ` AND category = $${paramIndex}`;
        queryParams.push(filters.category);
        paramIndex++;
      }
      
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      
      const countQuery = `SELECT COUNT(*) FROM specialties ${whereClause}`;
      
      const dataQuery = `
        SELECT 
          id, code, name, description, category,
          icon, color, image_url as "imageUrl",
          is_active as "isActive", display_order as "displayOrder",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM specialties
        ${whereClause}
        ORDER BY display_order, name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery, queryParams),
        pool.query(dataQuery, [...queryParams, limit, offset])
      ]);
      
      const total = parseInt(countResult.rows[0].count, 10);
      
      const specialties = dataResult.rows.map((row: any) => createSpecialty({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        category: row.category,
        icon: row.icon,
        color: row.color,
        imageUrl: row.imageUrl,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));
      
      return Ok({ specialties, total });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing specialties'));
    }
  }

  async findById(id: string): Promise<Result<Specialty | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, description, category,
          icon, color, image_url as "imageUrl",
          is_active as "isActive", display_order as "displayOrder",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM specialties
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const specialty = createSpecialty({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        category: row.category,
        icon: row.icon,
        color: row.color,
        imageUrl: row.imageUrl,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      });

      return Ok(specialty);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding specialty'));
    }
  }

  async findByCode(code: string): Promise<Result<Specialty | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, code, name, description, category,
          icon, color, image_url as "imageUrl",
          is_active as "isActive", display_order as "displayOrder",
          created_at as "createdAt", updated_at as "updatedAt"
         FROM specialties
         WHERE code = $1
         LIMIT 1`,
        [code]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const specialty = createSpecialty({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        category: row.category,
        icon: row.icon,
        color: row.color,
        imageUrl: row.imageUrl,
        isActive: row.isActive,
        displayOrder: row.displayOrder,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      });

      return Ok(specialty);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error finding specialty by code'));
    }
  }

  async create(input: CreateSpecialtyInput): Promise<Result<Specialty, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const now = new Date();

      const result = await pool.query(
        `INSERT INTO specialties (
          id, code, name, description, category,
          icon, color, image_url,
          is_active, display_order,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12
        ) RETURNING *`,
        [
          id,
          input.code,
          input.name,
          input.description,
          input.category,
          input.icon,
          input.color,
          input.imageUrl,
          input.isActive ?? true,
          input.displayOrder ?? 0,
          now,
          now
        ]
      );

      const row = result.rows[0];
      const specialty = createSpecialty({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        category: row.category,
        icon: row.icon,
        color: row.color,
        imageUrl: row.image_url,
        isActive: row.is_active,
        displayOrder: row.display_order,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });

      return Ok(specialty);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating specialty'));
    }
  }

  async update(id: string, input: UpdateSpecialtyInput): Promise<Result<Specialty, Error>> {
    try {
      const pool = getDbPool();
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.code !== undefined) {
        updates.push(`code = $${paramIndex++}`);
        values.push(input.code);
      }
      if (input.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(input.name);
      }
      if (input.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(input.description);
      }
      if (input.category !== undefined) {
        updates.push(`category = $${paramIndex++}`);
        values.push(input.category);
      }
      if (input.icon !== undefined) {
        updates.push(`icon = $${paramIndex++}`);
        values.push(input.icon);
      }
      if (input.color !== undefined) {
        updates.push(`color = $${paramIndex++}`);
        values.push(input.color);
      }
      if (input.imageUrl !== undefined) {
        updates.push(`image_url = $${paramIndex++}`);
        values.push(input.imageUrl);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }
      if (input.displayOrder !== undefined) {
        updates.push(`display_order = $${paramIndex++}`);
        values.push(input.displayOrder);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      updates.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      values.push(id);

      const query = `
        UPDATE specialties
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return Err(new Error('Specialty not found'));
      }

      const row = result.rows[0];
      const specialty = createSpecialty({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        category: row.category,
        icon: row.icon,
        color: row.color,
        imageUrl: row.image_url,
        isActive: row.is_active,
        displayOrder: row.display_order,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });

      return Ok(specialty);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error updating specialty'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const pool = getDbPool();
      
      const isUsedByProgramsResult = await this.isUsedByPrograms(id);
      if (!isUsedByProgramsResult.ok) {
        return isUsedByProgramsResult;
      }
      if (isUsedByProgramsResult.value) {
        return Err(new Error('Cannot delete specialty: it is currently assigned to one or more programs'));
      }

      const isUsedByInstructorsResult = await this.isUsedByInstructors(id);
      if (!isUsedByInstructorsResult.ok) {
        return isUsedByInstructorsResult;
      }
      if (isUsedByInstructorsResult.value) {
        return Err(new Error('Cannot delete specialty: it is currently assigned to one or more instructors'));
      }

      const result = await pool.query('DELETE FROM specialties WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return Err(new Error('Specialty not found'));
      }

      return Ok(undefined);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error deleting specialty'));
    }
  }

  async isUsedByPrograms(id: string): Promise<Result<boolean, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM programs WHERE specialty_id = $1) as exists',
        [id]
      );
      return Ok(result.rows[0].exists);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error checking specialty usage by programs'));
    }
  }

  async isUsedByInstructors(id: string): Promise<Result<boolean, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM instructor_specialties WHERE specialty_id = $1) as exists',
        [id]
      );
      return Ok(result.rows[0].exists);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error checking specialty usage by instructors'));
    }
  }
}
