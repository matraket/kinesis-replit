import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PostgresBusinessModelRepository } from '../../../../api/infrastructure/db/PostgresBusinessModelRepository.js';
import { getDbPool } from '../../../../api/infrastructure/db/client.js';
import { randomUUID } from 'crypto';

describe('PostgresBusinessModelRepository - Domain Rules', () => {
  let repository: PostgresBusinessModelRepository;
  let createdIds: string[] = [];

  beforeEach(() => {
    repository = new PostgresBusinessModelRepository();
    createdIds = [];
  });

  afterEach(async () => {
    const pool = getDbPool();
    for (const id of createdIds) {
      try {
        await pool.query('DELETE FROM business_models WHERE id = $1', [id]);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  describe('Critical business model deletion protection', () => {
    const criticalInternalCodes = [
      'elite_on_demand',
      'ritmo_constante',
      'generacion_dance',
      'si_quiero_bailar'
    ];

    for (const criticalCode of criticalInternalCodes) {
      it(`should prevent deletion of critical business model: ${criticalCode}`, async () => {
        const pool = getDbPool();
        const existingCheck = await pool.query(
          'SELECT id FROM business_models WHERE internal_code = $1 LIMIT 1',
          [criticalCode]
        );

        let id: string;
        if (existingCheck.rows.length > 0) {
          id = existingCheck.rows[0].id;
        } else {
          const createResult = await repository.create({
            internalCode: criticalCode,
            name: `Test ${criticalCode}`,
            description: 'Test description',
            slug: `test-${criticalCode}-${Date.now()}`,
            isActive: true,
            showOnWeb: true,
          });

          expect(createResult.ok).toBe(true);
          if (!createResult.ok) return;

          id = createResult.value.id;
          createdIds.push(id);
        }

        const deleteResult = await repository.delete(id);

        expect(deleteResult.ok).toBe(false);
        if (deleteResult.ok) return;

        expect(deleteResult.error.message).toContain('Cannot delete critical business model');
        expect(deleteResult.error.message).toContain(criticalCode);
        expect(deleteResult.error.message).toContain('Set is_active=false or show_on_web=false instead');

        const verifyResult = await repository.findById(id);
        expect(verifyResult.ok).toBe(true);
        if (!verifyResult.ok) return;
        expect(verifyResult.value).not.toBeNull();
      });
    }

    it('should allow deletion of non-critical business models', async () => {
      const nonCriticalCode = `test_model_${randomUUID().substring(0, 8)}`;
      
      const createResult = await repository.create({
        internalCode: nonCriticalCode,
        name: 'Test Non-Critical Model',
        description: 'This model can be deleted',
        slug: `test-non-critical-${Date.now()}`,
        isActive: true,
        showOnWeb: false,
      });

      expect(createResult.ok).toBe(true);
      if (!createResult.ok) return;

      const id = createResult.value.id;

      const deleteResult = await repository.delete(id);

      expect(deleteResult.ok).toBe(true);

      const verifyResult = await repository.findById(id);
      expect(verifyResult.ok).toBe(true);
      if (!verifyResult.ok) return;
      expect(verifyResult.value).toBeNull();
    });

    it('should suggest alternative to deletion for critical models', async () => {
      const pool = getDbPool();
      const existingCheck = await pool.query(
        'SELECT id FROM business_models WHERE internal_code = $1 LIMIT 1',
        ['elite_on_demand']
      );

      let id: string;
      if (existingCheck.rows.length > 0) {
        id = existingCheck.rows[0].id;
      } else {
        const createResult = await repository.create({
          internalCode: 'elite_on_demand',
          name: 'Elite On Demand Test',
          description: 'Test',
          slug: `test-elite-${Date.now()}`,
          isActive: true,
          showOnWeb: true,
        });

        expect(createResult.ok).toBe(true);
        if (!createResult.ok) return;

        id = createResult.value.id;
        createdIds.push(id);
      }

      const deleteResult = await repository.delete(id);

      expect(deleteResult.ok).toBe(false);
      if (deleteResult.ok) return;
      expect(deleteResult.error.message).toMatch(/is_active=false.*show_on_web=false/);
    });
  });

  describe('Business model CRUD operations', () => {
    it('should create business model with all required fields', async () => {
      const slug = `test-model-${Date.now()}`;
      const result = await repository.create({
        internalCode: `test_${randomUUID().substring(0, 8)}`,
        name: 'Test Business Model',
        description: 'Test description for business model',
        slug,
        scheduleInfo: 'Monday to Friday',
        targetAudience: 'Adults',
        displayOrder: 1,
        isActive: true,
        showOnWeb: true,
        metaTitle: 'Test Meta Title',
        metaDescription: 'Test Meta Description'
      });

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      createdIds.push(result.value.id);

      expect(result.value).toHaveProperty('id');
      expect(result.value.name).toBe('Test Business Model');
      expect(result.value.slug).toBe(slug);
      expect(result.value.isActive).toBe(true);
    });

    it('should update business model', async () => {
      const createResult = await repository.create({
        internalCode: `test_${randomUUID().substring(0, 8)}`,
        name: 'Original Name',
        description: 'Original description',
        slug: `test-update-${Date.now()}`,
      });

      expect(createResult.ok).toBe(true);
      if (!createResult.ok) return;

      const id = createResult.value.id;
      createdIds.push(id);

      const updateResult = await repository.update(id, {
        name: 'Updated Name',
        description: 'Updated description'
      });

      expect(updateResult.ok).toBe(true);
      if (!updateResult.ok) return;

      expect(updateResult.value.name).toBe('Updated Name');
      expect(updateResult.value.description).toBe('Updated description');
    });
  });
});
