import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerAdminRoutes } from '../../../api/interfaces/http/admin/routes/index.js';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Admin Leads API - Management Integration', () => {
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
        await pool.query('DELETE FROM leads WHERE id = $1', [id]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await server.close();
    await publicServer.close();
  });

  async function createTestLead(type: string, additionalData = {}) {
    const response = await publicServer.inject({
      method: 'POST',
      url: `/api/public/leads/${type}`,
      headers: { 'content-type': 'application/json' },
      payload: {
        firstName: 'Test',
        lastName: 'User',
        email: `test.${type}.${Date.now()}@example.com`,
        message: 'Test message',
        ...additionalData,
      }
    });

    const body = JSON.parse(response.body);
    if (body.id) {
      createdIds.push(body.id);
    }
    return body;
  }

  describe('GET /api/admin/leads - List with Filters', () => {
    it('should list all leads', async () => {
      await createTestLead('contact');

      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/leads',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('limit');
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('should filter leads by type', async () => {
      await createTestLead('contact');

      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/leads?leadType=contact',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.every((lead: any) => lead.leadType === 'contact')).toBe(true);
    });

    it('should filter leads by status', async () => {
      const lead = await createTestLead('contact');

      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/leads?status=new',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.every((lead: any) => lead.leadStatus === 'new')).toBe(true);
    });

    it('should paginate results', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/leads?page=1&limit=5',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.page).toBe(1);
      expect(body.limit).toBe(5);
      expect(body.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter by date range', async () => {
      const from = new Date('2025-01-01').toISOString();
      const to = new Date('2025-12-31').toISOString();

      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/leads?from=${from}&to=${to}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
    });

    it('should reject request without authentication', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/leads'
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/admin/leads/:id - Get by ID', () => {
    it('should retrieve a lead by ID', async () => {
      const lead = await createTestLead('contact');

      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/leads/${lead.id}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(lead.id);
      expect(body.firstName).toBe('Test');
      expect(body.lastName).toBe('User');
      expect(body.leadType).toBe('contact');
    });

    it('should return 404 for non-existent lead', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/leads/00000000-0000-0000-0000-000000000000',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/admin/leads/:id/status - Update Status', () => {
    it('should update lead status', async () => {
      const lead = await createTestLead('contact');

      const response = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/status`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          leadStatus: 'contacted',
          notes: 'Called and left voicemail',
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.leadStatus).toBe('contacted');
      expect(body.notes).toContain('Called and left voicemail');
    });

    it('should accept all valid status values', async () => {
      const statuses: Array<'new' | 'contacted' | 'qualified' | 'converted' | 'lost'> = 
        ['contacted', 'qualified', 'converted', 'lost'];

      for (const status of statuses) {
        const lead = await createTestLead('contact');

        const response = await server.inject({
          method: 'PATCH',
          url: `/api/admin/leads/${lead.id}/status`,
          headers: {
            'x-admin-secret': adminSecret,
            'content-type': 'application/json'
          },
          payload: {
            leadStatus: status,
          }
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.leadStatus).toBe(status);
      }
    });

    it('should track contactedBy when provided', async () => {
      const lead = await createTestLead('contact');

      const response = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/status`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          leadStatus: 'contacted',
          contactedBy: 'admin-user-123',
          notes: 'First contact made',
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.contactedBy).toBe('admin-user-123');
    });

    it('should return 404 for non-existent lead', async () => {
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/admin/leads/00000000-0000-0000-0000-000000000000/status',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          leadStatus: 'contacted',
        }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/admin/leads/:id/notes - Update Notes', () => {
    it('should update lead notes', async () => {
      const lead = await createTestLead('contact');

      const response = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/notes`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          notes: 'Follow-up scheduled for next week. Customer interested in salsa classes.',
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.notes).toBe('Follow-up scheduled for next week. Customer interested in salsa classes.');
    });

    it('should append to existing notes', async () => {
      const lead = await createTestLead('contact');

      // First update
      await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/notes`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          notes: 'Initial contact made.',
        }
      });

      // Second update
      const response = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/notes`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          notes: 'Follow-up completed.',
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.notes).toBe('Follow-up completed.');
    });

    it('should return 404 for non-existent lead', async () => {
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/admin/leads/00000000-0000-0000-0000-000000000000/notes',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          notes: 'Test notes',
        }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Lead workflow scenarios', () => {
    it('should handle complete lead lifecycle', async () => {
      // 1. Create lead via public endpoint
      const lead = await createTestLead('pre-enrollment', {
        studentName: 'Sofia Test',
        studentAge: 10,
        interestedInPrograms: ['ballet'],
      });

      expect(lead.id).toBeDefined();

      // 2. Admin views the lead
      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/leads/${lead.id}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(getResponse.statusCode).toBe(200);

      // 3. Admin contacts the lead
      const contactResponse = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/status`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          leadStatus: 'contacted',
          notes: 'Parent interested in ballet program',
          contactedBy: 'admin-123',
        }
      });

      expect(contactResponse.statusCode).toBe(200);

      // 4. Lead qualifies
      const qualifyResponse = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/status`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          leadStatus: 'qualified',
        }
      });

      expect(qualifyResponse.statusCode).toBe(200);

      // 5. Lead converts
      const convertResponse = await server.inject({
        method: 'PATCH',
        url: `/api/admin/leads/${lead.id}/status`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          leadStatus: 'converted',
          notes: 'Enrolled in ballet program',
        }
      });

      expect(convertResponse.statusCode).toBe(200);
      const finalLead = JSON.parse(convertResponse.body);
      expect(finalLead.leadStatus).toBe('converted');
    });
  });
});
