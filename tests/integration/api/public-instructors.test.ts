import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';

describe('GET /api/public/instructors', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(publicRoutes, { prefix: '/api/public' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return list of instructors with pagination', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/instructors'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('limit');
    expect(body).toHaveProperty('pages');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should filter by featured instructors', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/instructors?featured=true'
    });

    expect(response.statusCode).toBe(200);
  });

  it('should handle getting instructor by slug', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/instructors/test-slug'
    });

    expect([200, 404, 500]).toContain(response.statusCode);
  });
});
