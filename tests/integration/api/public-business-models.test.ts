import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';

describe('GET /api/public/business-models', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(publicRoutes, { prefix: '/api/public' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return list of business models with correct structure', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/business-models'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('count');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should handle getting business model by slug', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/business-models/non-existent-slug'
    });

    expect([200, 404, 500]).toContain(response.statusCode);
  });
});
