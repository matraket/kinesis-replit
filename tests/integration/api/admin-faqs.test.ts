import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerAdminRoutes } from '../../../api/interfaces/http/admin/routes/index.js';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Admin FAQs API - CRUD Integration', () => {
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
        await pool.query('DELETE FROM faqs WHERE id = $1', [id]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await server.close();
    await publicServer.close();
  });

  describe('Complete CRUD Flow for FAQs', () => {
    it('should perform complete CRUD cycle: CREATE → READ → UPDATE → DELETE', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/faqs',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          question: 'What are the class schedules?',
          answer: 'Our classes run Monday through Friday from 6 AM to 9 PM',
          category: 'schedules',
          displayOrder: 1,
          isActive: true
        }
      });

      expect(createResponse.statusCode).toBe(201);
      const created = JSON.parse(createResponse.body);
      expect(created).toHaveProperty('id');
      expect(created.question).toBe('What are the class schedules?');
      expect(created.answer).toBe('Our classes run Monday through Friday from 6 AM to 9 PM');
      expect(created.category).toBe('schedules');
      expect(created.isActive).toBe(true);

      const faqId = created.id;
      createdIds.push(faqId);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/faqs/${faqId}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(getResponse.statusCode).toBe(200);
      const retrieved = JSON.parse(getResponse.body);
      expect(retrieved.id).toBe(faqId);
      expect(retrieved.question).toBe('What are the class schedules?');

      const updateResponse = await server.inject({
        method: 'PUT',
        url: `/api/admin/faqs/${faqId}`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          answer: 'Updated: Our classes run Monday through Sunday from 6 AM to 10 PM',
          category: 'schedules-updated',
          isActive: false
        }
      });

      expect(updateResponse.statusCode).toBe(200);
      const updated = JSON.parse(updateResponse.body);
      expect(updated.answer).toBe('Updated: Our classes run Monday through Sunday from 6 AM to 10 PM');
      expect(updated.category).toBe('schedules-updated');
      expect(updated.isActive).toBe(false);

      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: `/api/admin/faqs/${faqId}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(deleteResponse.statusCode).toBe(204);

      const verifyDeleteResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/faqs/${faqId}`,
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(verifyDeleteResponse.statusCode).toBe(404);

      createdIds.pop();
    });
  });

  describe('POST /api/admin/faqs - Create', () => {
    it('should create a new FAQ with required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/faqs',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          question: 'How do I register?',
          answer: 'You can register through our website or mobile app',
          category: 'registration',
          isActive: true
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.question).toBe('How do I register?');

      createdIds.push(body.id);
    });

    it('should reject creation without required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/faqs',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          question: 'Incomplete FAQ'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject creation without admin authentication', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/faqs',
        headers: {
          'content-type': 'application/json'
        },
        payload: {
          question: 'Test',
          answer: 'Test',
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/admin/faqs - List All', () => {
    it('should list all FAQs including inactive ones', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/faqs',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('faqs');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.faqs)).toBe(true);
    });

    it('should filter FAQs by category', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/faqs?category=schedules',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.faqs)).toBe(true);
    });

    it('should filter FAQs by isActive status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/faqs?isActive=true',
        headers: {
          'x-admin-secret': adminSecret
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.faqs)).toBe(true);
    });
  });

  describe('Public API compatibility after admin operations', () => {
    it('should make active FAQ visible on public API', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/faqs',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          question: 'Public FAQ Question',
          answer: 'Public FAQ Answer',
          category: 'general',
          displayOrder: 1,
          isActive: true
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const publicResponse = await publicServer.inject({
        method: 'GET',
        url: '/api/public/faqs'
      });

      expect(publicResponse.statusCode).toBe(200);
      const publicBody = JSON.parse(publicResponse.body);
      const foundFaq = publicBody.data.find((f: any) => f.id === created.id);
      expect(foundFaq).toBeDefined();
      expect(foundFaq.question).toBe('Public FAQ Question');
    });

    it('should hide inactive FAQ from public API', async () => {
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/faqs',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          question: 'Hidden FAQ Question',
          answer: 'Hidden FAQ Answer',
          category: 'general',
          isActive: false
        }
      });

      const created = JSON.parse(createResponse.body);
      createdIds.push(created.id);

      const publicResponse = await publicServer.inject({
        method: 'GET',
        url: '/api/public/faqs'
      });

      expect(publicResponse.statusCode).toBe(200);
      const publicBody = JSON.parse(publicResponse.body);
      const foundFaq = publicBody.data.find((f: any) => f.id === created.id);
      expect(foundFaq).toBeUndefined();
    });
  });
});
