import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerAdminRoutes } from '../../../api/interfaces/http/admin/routes/index.js';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Admin Page Content API - CRUD Integration', () => {
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
        await pool.query('DELETE FROM page_content WHERE id = $1', [id]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await server.close();
    await publicServer.close();
  });

  describe('POST /api/admin/pages - Create', () => {
    it('should create a new page with required fields', async () => {
      const pageKey = `test-page-${Date.now()}`;
      const slug = `test-slug-${Date.now()}`;
      
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey,
          pageTitle: 'Test Page',
          slug,
          contentHtml: '<h1>Test Content</h1>',
          status: 'draft',
          metaTitle: 'Test Meta Title',
          metaDescription: 'Test Meta Description'
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.pageKey).toBe(pageKey);
      expect(body.pageTitle).toBe('Test Page');
      expect(body.slug).toBe(slug);
      expect(body.status).toBe('draft');

      createdIds.push(body.id);
    });

    it('should reject creation without required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageTitle: 'Incomplete Page'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject creation without admin authentication', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'content-type': 'application/json'
        },
        payload: {
          pageKey: 'test',
          pageTitle: 'Test',
          slug: 'test'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/admin/pages/:id - Read', () => {
    it('should retrieve a page by ID', async () => {
      const pageKey = `test-retrieve-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey,
          pageTitle: 'Page to Retrieve',
          slug: `slug-${Date.now()}`,
          status: 'draft',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/pages/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(getResponse.statusCode).toBe(200);
      const body = JSON.parse(getResponse.body);
      expect(body.id).toBe(created.id);
      expect(body.pageTitle).toBe('Page to Retrieve');
    });

    it('should retrieve a page by pageKey', async () => {
      const pageKey = `test-key-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey,
          pageTitle: 'Page to Retrieve by Key',
          slug: `slug-key-${Date.now()}`,
          status: 'draft',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/pages/by-key/${pageKey}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(getResponse.statusCode).toBe(200);
      const body = JSON.parse(getResponse.body);
      expect(body.pageKey).toBe(pageKey);
      expect(body.pageTitle).toBe('Page to Retrieve by Key');
    });
  });

  describe('PUT /api/admin/pages/:id - Update', () => {
    it('should update an existing page', async () => {
      const pageKey = `test-update-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey,
          pageTitle: 'Original Title',
          slug: `slug-update-${Date.now()}`,
          contentHtml: '<p>Original content</p>',
          status: 'draft',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const updateResponse = await server.inject({
        method: 'PUT',
        url: `/api/admin/pages/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageTitle: 'Updated Title',
          contentHtml: '<p>Updated content</p>',
          status: 'published'
        }
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.pageTitle).toBe('Updated Title');
      expect(body.contentHtml).toBe('<p>Updated content</p>');
      expect(body.status).toBe('published');
    });
  });

  describe('DELETE /api/admin/pages/:id - Delete', () => {
    it('should delete a non-critical page', async () => {
      const pageKey = `deletable-page-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey,
          pageTitle: 'Deletable Page',
          slug: `slug-delete-${Date.now()}`,
          status: 'draft',
        }
      });

      const created = JSON.parse(createResponse.body);

      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: `/api/admin/pages/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(deleteResponse.statusCode).toBe(204);

      const verifyResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/pages/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(verifyResponse.statusCode).toBe(404);
    });

    it('should prevent deletion of critical page (home)', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey: 'home',
          pageTitle: 'Home Page Test',
          slug: `home-test-${Date.now()}`,
          status: 'published',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: `/api/admin/pages/${created.id}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(deleteResponse.statusCode).toBe(400);
      const body = JSON.parse(deleteResponse.body);
      expect(body.error).toContain('Cannot delete critical page');
      expect(body.error).toContain('home');
    });
  });

  describe('GET /api/admin/pages - List All', () => {
    it('should list all pages including drafts and archived', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('pages');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.pages)).toBe(true);
    });

    it('should filter pages by status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/pages?status=published',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.pages)).toBe(true);
    });
  });

  describe('Public API compatibility after admin operations', () => {
    it('should make published page visible on public API', async () => {
      const slug = `public-page-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey: `public-test-${Date.now()}`,
          pageTitle: 'Public Page',
          slug,
          contentHtml: '<h1>Public Content</h1>',
          status: 'published',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const publicResponse = await publicServer.inject({
        method: 'GET',
        url: `/api/public/pages/${slug}`
      });

      expect(publicResponse.statusCode).toBe(200);
      const publicBody = JSON.parse(publicResponse.body);
      expect(publicBody.slug).toBe(slug);
      expect(publicBody.pageTitle).toBe('Public Page');
    });

    it('should hide draft page from public API', async () => {
      const slug = `draft-page-${Date.now()}`;
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/pages',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          pageKey: `draft-test-${Date.now()}`,
          pageTitle: 'Draft Page',
          slug,
          contentHtml: '<h1>Draft Content</h1>',
          status: 'draft',
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const publicResponse = await publicServer.inject({
        method: 'GET',
        url: `/api/public/pages/${slug}`
      });

      expect(publicResponse.statusCode).toBe(404);
    });
  });
});
