import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerAdminRoutes } from '../../../api/interfaces/http/admin/routes/index.js';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';
import { randomUUID } from 'crypto';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Admin Business Models API - CRUD Integration', () => {
  let server: FastifyInstance;
  let publicServer: FastifyInstance;
  const createdIds: string[] = [];
  const adminSecret = 'test-admin-secret';

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(registerAdminRoutes, { prefix: '/api/admin' });
    await server.ready();

    publicServer = Fastify({ logger: false });
    publicServer.register(publicRoutes, { prefix: '/api/public' });
    await publicServer.ready();
  });

  afterAll(async () => {
    const pool = getDbPool();
    for (const id of createdIds) {
      try {
        await pool.query('DELETE FROM business_models WHERE id = $1', [id]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await server.close();
    await publicServer.close();
  });

  describe('POST /api/admin/business-models - Create', () => {
    it('should create a new business model with required fields', async () => {
      const slug = `test-model-${Date.now()}`;
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: `test_${randomUUID().substring(0, 8)}`,
          name: 'Test Business Model',
          description: 'This is a test business model for integration testing',
          slug,
          displayOrder: 10,
          isActive: true,
          showOnWeb: false,
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.name).toBe('Test Business Model');
      expect(body.slug).toBe(slug);
      expect(body.isActive).toBe(true);
      expect(body.showOnWeb).toBe(false);

      createdIds.push(body.id);
    });

    it('should reject creation without required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          name: 'Incomplete Model'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject creation without admin authentication', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'content-type': 'application/json'
        },
        payload: {
          internalCode: 'test',
          name: 'Test',
          description: 'Test',
          slug: 'test'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/admin/business-models/:id - Read', () => {
    it('should retrieve a business model by ID', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: `test_${randomUUID().substring(0, 8)}`,
          name: 'Model to Retrieve',
          description: 'Test description',
          slug: `test-retrieve-${Date.now()}`,
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/business-models/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(getResponse.statusCode).toBe(200);
      const body = JSON.parse(getResponse.body);
      expect(body.id).toBe(created.id);
      expect(body.name).toBe('Model to Retrieve');
    });

    it('should return 404 for non-existent business model', async () => {
      const fakeId = randomUUID();
      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/business-models/${fakeId}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/admin/business-models/:id - Update', () => {
    it('should update an existing business model', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: `test_${randomUUID().substring(0, 8)}`,
          name: 'Original Name',
          description: 'Original description',
          slug: `test-update-${Date.now()}`,
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const updateResponse = await server.inject({
        method: 'PUT',
        url: `/api/admin/business-models/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          name: 'Updated Name',
          description: 'Updated description',
          isActive: false
        }
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.name).toBe('Updated Name');
      expect(body.description).toBe('Updated description');
      expect(body.isActive).toBe(false);
    });
  });

  describe('DELETE /api/admin/business-models/:id - Delete', () => {
    it('should delete a non-critical business model', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: `deletable_${randomUUID().substring(0, 8)}`,
          name: 'Deletable Model',
          description: 'This model can be deleted',
          slug: `test-delete-${Date.now()}`,
        }
      });

      const created = JSON.parse(createResponse.body);

      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: `/api/admin/business-models/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(deleteResponse.statusCode).toBe(204);

      const verifyResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/business-models/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(verifyResponse.statusCode).toBe(404);
    });

    it('should prevent deletion of critical business model (elite_on_demand)', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: 'elite_on_demand',
          name: 'Elite On Demand Test',
          description: 'Critical model',
          slug: `test-elite-${Date.now()}`,
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: `/api/admin/business-models/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(deleteResponse.statusCode).toBe(400);
      const body = JSON.parse(deleteResponse.body);
      expect(body.error).toContain('Cannot delete critical business model');
      expect(body.error).toContain('elite_on_demand');
    });
  });

  describe('GET /api/admin/business-models - List All', () => {
    it('should list all business models including inactive ones', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('businessModels');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.businessModels)).toBe(true);
    });

    it('should filter business models by isActive status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/business-models?isActive=true',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.businessModels)).toBe(true);
    });
  });

  describe('Public API compatibility after admin operations', () => {
    it('should make published business model visible on public API', async () => {
      const slug = `test-public-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: `public_test_${randomUUID().substring(0, 8)}`,
          name: 'Public Business Model',
          description: 'This should be visible on public API',
          slug,
          isActive: true,
          showOnWeb: true,
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const publicResponse = await publicServer.inject({
        method: 'GET',
        url: '/api/public/business-models'
      });

      expect(publicResponse.statusCode).toBe(200);
      const publicBody = JSON.parse(publicResponse.body);
      const foundModel = publicBody.data.find((m: any) => m.slug === slug);
      expect(foundModel).toBeDefined();
      expect(foundModel.name).toBe('Public Business Model');
    });

    it('should hide inactive business model from public API', async () => {
      const slug = `test-hidden-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/business-models',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          internalCode: `hidden_test_${randomUUID().substring(0, 8)}`,
          name: 'Hidden Business Model',
          description: 'This should NOT be visible on public API',
          slug,
          isActive: false,
          showOnWeb: false,
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const publicResponse = await publicServer.inject({
        method: 'GET',
        url: '/api/public/business-models'
      });

      expect(publicResponse.statusCode).toBe(200);
      const publicBody = JSON.parse(publicResponse.body);
      const foundModel = publicBody.data.find((m: any) => m.slug === slug);
      expect(foundModel).toBeUndefined();
    });
  });
});
