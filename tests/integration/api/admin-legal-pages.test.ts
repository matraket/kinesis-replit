import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerAdminRoutes } from '../../../api/interfaces/http/admin/routes/index.js';
import { randomUUID } from 'crypto';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Admin Legal Pages API - CRUD Integration', () => {
  let server: FastifyInstance;
  const createdIds: string[] = [];
  const adminSecret = 'test-admin-secret';

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(registerAdminRoutes, { prefix: '/api/admin' });
    await server.ready();
  });

  afterAll(async () => {
    const pool = getDbPool();
    for (const id of createdIds) {
      try {
        await pool.query('DELETE FROM legal_pages WHERE id = $1', [id]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await server.close();
  });

  describe('POST /api/admin/legal-pages - Create', () => {
    it('should create a new legal page with required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType: 'test_policy',
          title: 'Test Policy Document',
          content: 'This is a test policy for integration testing',
          version: '1.0',
          effectiveDate: '2025-01-01',
          isCurrent: false,
          slug: `test-policy-${Date.now()}`,
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.title).toBe('Test Policy Document');
      expect(body.pageType).toBe('test_policy');
      expect(body.version).toBe('1.0');

      createdIds.push(body.id);
    });

    it('should set isCurrent to true and unset others of same type', async () => {
      const pageType = `auto_current_${Date.now()}`;
      
      // Create first page as current
      const firstResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType,
          title: 'First Current Page',
          content: 'First version',
          version: '1.0',
          effectiveDate: '2025-01-01',
          isCurrent: true,
        }
      });

      const first = JSON.parse(firstResponse.body);
      createdIds.push(first.id);
      expect(first.isCurrent).toBe(true);

      // Create second page as current - should unset first
      const secondResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType,
          title: 'Second Current Page',
          content: 'Second version',
          version: '2.0',
          effectiveDate: '2025-02-01',
          isCurrent: true,
        }
      });

      const second = JSON.parse(secondResponse.body);
      createdIds.push(second.id);
      expect(second.isCurrent).toBe(true);

      // Verify first is no longer current
      const checkFirst = await server.inject({
        method: 'GET',
        url: `/api/admin/legal-pages/${first.id}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      const updatedFirst = JSON.parse(checkFirst.body);
      expect(updatedFirst.isCurrent).toBe(false);
    });

    it('should reject creation without authentication', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: { 'content-type': 'application/json' },
        payload: {
          pageType: 'test',
          title: 'Test',
          content: 'Test',
          version: '1.0',
          effectiveDate: '2025-01-01',
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/admin/legal-pages - List', () => {
    it('should list all legal pages', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/legal-pages',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('count');
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('should filter legal pages by type', async () => {
      const filterType = `filtered_${Date.now()}`;
      
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType: filterType,
          title: 'Filtered Page',
          content: 'Content',
          version: '1.0',
          effectiveDate: '2025-01-01',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/legal-pages?pageType=${filterType}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.every((page: any) => page.pageType === filterType)).toBe(true);
    });
  });

  describe('GET /api/admin/legal-pages/:id - Get by ID', () => {
    it('should retrieve a legal page by ID', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType: 'retrieve_test',
          title: 'Page to Retrieve',
          content: 'Content for retrieval',
          version: '1.0',
          effectiveDate: '2025-01-01',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/legal-pages/${created.id}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(getResponse.statusCode).toBe(200);
      const body = JSON.parse(getResponse.body);
      expect(body.id).toBe(created.id);
      expect(body.title).toBe('Page to Retrieve');
    });

    it('should return 404 for non-existent legal page', async () => {
      const fakeId = randomUUID();
      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/legal-pages/${fakeId}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/admin/legal-pages/type/:pageType - Get by Type', () => {
    it('should retrieve latest legal page by type', async () => {
      const pageType = `type_lookup_${Date.now()}`;
      
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType,
          title: 'Latest by Type',
          content: 'Latest content',
          version: '2.5',
          effectiveDate: '2025-03-01',
          isCurrent: true,
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/legal-pages/type/${pageType}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(getResponse.statusCode).toBe(200);
      const body = JSON.parse(getResponse.body);
      expect(body.pageType).toBe(pageType);
      expect(body.title).toBe('Latest by Type');
    });
  });

  describe('PUT /api/admin/legal-pages/:id - Update', () => {
    it('should update an existing legal page', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType: 'update_test',
          title: 'Original Title',
          content: 'Original content',
          version: '1.0',
          effectiveDate: '2025-01-01',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const updateResponse = await server.inject({
        method: 'PUT',
        url: `/api/admin/legal-pages/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          title: 'Updated Title',
          content: 'Updated content',
          version: '1.1',
        }
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.title).toBe('Updated Title');
      expect(body.content).toBe('Updated content');
      expect(body.version).toBe('1.1');
    });
  });

  describe('DELETE /api/admin/legal-pages/:id - Delete', () => {
    it('should delete a non-standard legal page', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/legal-pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageType: 'deletable_test',
          title: 'Deletable Page',
          content: 'This can be deleted',
          version: '1.0',
          effectiveDate: '2025-01-01',
        }
      });

      const created = JSON.parse(createResponse.body);

      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: `/api/admin/legal-pages/${created.id}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(deleteResponse.statusCode).toBe(204);

      const verifyResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/legal-pages/${created.id}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(verifyResponse.statusCode).toBe(404);
    });

    it('should prevent deletion of standard legal page types', async () => {
      const standardTypes = ['legal', 'privacy', 'cookies', 'terms'];
      
      for (const pageType of standardTypes) {
        const createResponse = await server.inject({
          method: 'POST',
          url: '/api/admin/legal-pages',
          headers: {
            'x-admin-secret': adminSecret,
            'content-type': 'application/json'
          },
          payload: {
            pageType,
            title: `Test ${pageType}`,
            content: 'Test content',
            version: '1.0',
            effectiveDate: '2025-01-01',
          }
        });

        const created = JSON.parse(createResponse.body);
        createdIds.push(created.id);

        const deleteResponse = await server.inject({
          method: 'DELETE',
          url: `/api/admin/legal-pages/${created.id}`,
          headers: { 'x-admin-secret': adminSecret }
        });

        expect(deleteResponse.statusCode).toBe(403);
        const body = JSON.parse(deleteResponse.body);
        expect(body.error).toContain('Cannot delete standard legal page type');
      }
    });
  });
});
