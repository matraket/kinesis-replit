import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { publicRoutes } from '../../../api/interfaces/http/public/routes/index.js';

describe('GET /api/public/programs', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(publicRoutes, { prefix: '/api/public' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return list of programs with pagination', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/programs'
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

  it('should accept and validate query filters', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/programs?difficulty=beginner&page=1&limit=10'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(10);
  });

  it('should return 400 for invalid query parameters', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/public/programs?page=invalid'
    });

    expect(response.statusCode).toBe(400);
  });
});
