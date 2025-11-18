import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PostgresContentRepository } from '../../../../api/infrastructure/db/PostgresContentRepository.js';
import { getDbPool } from '../../../../api/infrastructure/db/client.js';

describe('PostgresContentRepository - Domain Rules', () => {
  let repository: PostgresContentRepository;
  let createdIds: string[] = [];

  beforeEach(() => {
    repository = new PostgresContentRepository();
    createdIds = [];
  });

  afterEach(async () => {
    const pool = getDbPool();
    for (const id of createdIds) {
      try {
        await pool.query('DELETE FROM page_content WHERE id = $1', [id]);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  describe('Critical page deletion protection', () => {
    const criticalPageKeys = [
      'home',
      'about-us',
      'business-models'
    ];

    for (const criticalKey of criticalPageKeys) {
      it(`should prevent deletion of critical page: ${criticalKey}`, async () => {
        const pool = getDbPool();
        const existingCheck = await pool.query(
          'SELECT id FROM page_content WHERE page_key = $1 LIMIT 1',
          [criticalKey]
        );

        let id: string;
        if (existingCheck.rows.length > 0) {
          id = existingCheck.rows[0].id;
        } else {
          const createResult = await repository.create({
            pageKey: criticalKey,
            pageTitle: `Test ${criticalKey}`,
            slug: `test-${criticalKey}-${Date.now()}`,
            status: 'published',
          });

          expect(createResult.ok).toBe(true);
          if (!createResult.ok) return;

          id = createResult.value.id;
          createdIds.push(id);
        }

        const deleteResult = await repository.delete(id);

        expect(deleteResult.ok).toBe(false);
        if (deleteResult.ok) return;

        expect(deleteResult.error.message).toContain('Cannot delete critical page');
        expect(deleteResult.error.message).toContain(criticalKey);
        expect(deleteResult.error.message).toContain("Set status='archived' or status='draft' instead");

        const verifyResult = await repository.findById(id);
        expect(verifyResult.ok).toBe(true);
        if (!verifyResult.ok) return;
        expect(verifyResult.value).not.toBeNull();
      });
    }

    it('should allow deletion of non-critical pages', async () => {
      const nonCriticalKey = `test-page-${Date.now()}`;
      
      const createResult = await repository.create({
        pageKey: nonCriticalKey,
        pageTitle: 'Test Non-Critical Page',
        slug: `test-non-critical-${Date.now()}`,
        status: 'draft',
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

    it('should suggest alternative to deletion for critical pages', async () => {
      const pool = getDbPool();
      const existingCheck = await pool.query(
        'SELECT id FROM page_content WHERE page_key = $1 LIMIT 1',
        ['home']
      );

      let id: string;
      if (existingCheck.rows.length > 0) {
        id = existingCheck.rows[0].id;
      } else {
        const createResult = await repository.create({
          pageKey: 'home',
          pageTitle: 'Home Page Test',
          slug: `test-home-${Date.now()}`,
          status: 'published',
        });

        expect(createResult.ok).toBe(true);
        if (!createResult.ok) return;

        id = createResult.value.id;
        createdIds.push(id);
      }

      const deleteResult = await repository.delete(id);

      expect(deleteResult.ok).toBe(false);
      if (deleteResult.ok) return;
      expect(deleteResult.error.message).toMatch(/status='archived'.*status='draft'/);
    });
  });

  describe('Page content CRUD operations', () => {
    it('should create page with all required fields', async () => {
      const slug = `test-page-${Date.now()}`;
      const result = await repository.create({
        pageKey: `test-key-${Date.now()}`,
        pageTitle: 'Test Page',
        slug,
        contentHtml: '<p>Test content</p>',
        status: 'draft',
        metaTitle: 'Test Meta Title',
        metaDescription: 'Test Meta Description'
      });

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      createdIds.push(result.value.id);

      expect(result.value).toHaveProperty('id');
      expect(result.value.pageTitle).toBe('Test Page');
      expect(result.value.slug).toBe(slug);
      expect(result.value.status).toBe('draft');
    });

    it('should update page content', async () => {
      const createResult = await repository.create({
        pageKey: `test-key-${Date.now()}`,
        pageTitle: 'Original Title',
        slug: `test-update-${Date.now()}`,
        status: 'draft',
      });

      expect(createResult.ok).toBe(true);
      if (!createResult.ok) return;

      const id = createResult.value.id;
      createdIds.push(id);

      const updateResult = await repository.update(id, {
        pageTitle: 'Updated Title',
        contentHtml: '<p>Updated content</p>',
        status: 'published'
      });

      expect(updateResult.ok).toBe(true);
      if (!updateResult.ok) return;

      expect(updateResult.value.pageTitle).toBe('Updated Title');
      expect(updateResult.value.contentHtml).toBe('<p>Updated content</p>');
      expect(updateResult.value.status).toBe('published');
    });
  });
});
