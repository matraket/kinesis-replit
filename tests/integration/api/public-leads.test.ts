import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Public Leads API - Form Submissions Integration', () => {
  let server: FastifyInstance;
  const createdIds: string[] = [];

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(publicRoutes, { prefix: '/api/public' });
    await server.ready();
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
  });

  describe('POST /api/public/leads/contact - Contact Form', () => {
    it('should submit a contact form with required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/contact',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: `john.doe.${Date.now()}@example.com`,
          message: 'I am interested in learning salsa dancing',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('successfully');

      createdIds.push(body.id);
    });

    it('should accept optional phone and marketing consent', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/contact',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Maria',
          lastName: 'Garcia',
          email: `maria.${Date.now()}@example.com`,
          phone: '+1234567890',
          message: 'Question about pricing',
          acceptsMarketing: true,
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      createdIds.push(body.id);
    });

    it('should capture UTM parameters', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/contact',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'UTM',
          lastName: 'Test',
          email: `utm.test.${Date.now()}@example.com`,
          message: 'Testing UTM tracking',
          utmSource: 'facebook',
          utmMedium: 'social',
          utmCampaign: 'summer_2025',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      createdIds.push(body.id);
    });

    it('should reject submission without required fields', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/contact',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Incomplete',
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject submission without message', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/contact',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'No',
          lastName: 'Message',
          email: 'no.message@example.com',
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/public/leads/pre-enrollment - Pre-Enrollment Form', () => {
    it('should submit a pre-enrollment form with student details', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/pre-enrollment',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Parent',
          lastName: 'Smith',
          email: `parent.${Date.now()}@example.com`,
          studentName: 'Child Smith',
          studentAge: 8,
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');

      createdIds.push(body.id);
    });

    it('should accept optional previous experience and program interests', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/pre-enrollment',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Ana',
          lastName: 'Rodriguez',
          email: `ana.${Date.now()}@example.com`,
          studentName: 'Sofia Rodriguez',
          studentAge: 10,
          previousExperience: '2 years of ballet at another studio',
          interestedInPrograms: ['ballet', 'contemporary'],
          preferredSchedule: 'Weekday afternoons',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      createdIds.push(body.id);
    });

    it('should reject submission without student name', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/pre-enrollment',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Parent',
          lastName: 'Test',
          email: 'parent.test@example.com',
          studentAge: 7,
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject submission without student age', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/pre-enrollment',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Parent',
          lastName: 'Test',
          email: 'parent.test@example.com',
          studentName: 'Child Test',
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/public/leads/elite-booking - Elite Booking Form', () => {
    it('should submit an elite booking with date and time', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/elite-booking',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Carlos',
          lastName: 'Martinez',
          email: `carlos.${Date.now()}@example.com`,
          preferredDate: '2025-12-15',
          preferredTime: '18:00',
          sessionType: 'individual',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');

      createdIds.push(body.id);
    });

    it('should accept all session types', async () => {
      const sessionTypes = ['individual', 'couple', 'group'];

      for (const sessionType of sessionTypes) {
        const response = await server.inject({
          method: 'POST',
          url: '/api/public/leads/elite-booking',
          headers: { 'content-type': 'application/json' },
          payload: {
            firstName: 'Test',
            lastName: sessionType,
            email: `test.${sessionType}.${Date.now()}@example.com`,
            preferredDate: '2025-12-20',
            preferredTime: '19:00',
            sessionType,
          }
        });

        expect(response.statusCode).toBe(201);
        const body = JSON.parse(response.body);
        createdIds.push(body.id);
      }
    });

    it('should accept optional message', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/elite-booking',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Luis',
          lastName: 'Fernandez',
          email: `luis.${Date.now()}@example.com`,
          preferredDate: '2025-12-25',
          preferredTime: '20:00',
          message: 'Preparing for competition, need intensive training',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      createdIds.push(body.id);
    });

    it('should reject invalid time format', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/elite-booking',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Invalid',
          lastName: 'Time',
          email: 'invalid.time@example.com',
          preferredDate: '2025-12-01',
          preferredTime: '25:99',
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/public/leads/wedding - Wedding Choreography Form', () => {
    it('should submit a wedding choreography request', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/wedding',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Bride',
          lastName: 'Groom',
          email: `wedding.${Date.now()}@example.com`,
          preferredDate: '2026-06-15',
          preferredTime: '14:00',
          message: 'Looking for first dance choreography',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.message).toContain('Wedding choreography');

      createdIds.push(body.id);
    });

    it('should auto-tag as couple session type', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/wedding',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Future',
          lastName: 'Couple',
          email: `couple.${Date.now()}@example.com`,
          preferredDate: '2026-07-20',
          preferredTime: '15:00',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      createdIds.push(body.id);
    });

    it('should accept optional phone and UTM parameters', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/wedding',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Wedding',
          lastName: 'Lead',
          email: `wedding.utm.${Date.now()}@example.com`,
          phone: '+9876543210',
          preferredDate: '2026-08-10',
          preferredTime: '16:00',
          utmSource: 'google',
          utmCampaign: 'wedding_season',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      createdIds.push(body.id);
    });
  });

  describe('Input validation', () => {
    it('should reject invalid email format', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/contact',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Invalid',
          lastName: 'Email',
          email: 'not-an-email',
          message: 'Test',
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should enforce minimum age for pre-enrollment', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/pre-enrollment',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Parent',
          lastName: 'Test',
          email: 'parent@example.com',
          studentName: 'Too Young',
          studentAge: 2,
        }
      });

      expect(response.statusCode).toBe(400);
    });

    it('should enforce maximum age for pre-enrollment', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/public/leads/pre-enrollment',
        headers: { 'content-type': 'application/json' },
        payload: {
          firstName: 'Parent',
          lastName: 'Test',
          email: 'parent@example.com',
          studentName: 'Too Old',
          studentAge: 150,
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
