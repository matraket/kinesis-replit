import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerAdminRoutes } from '../../../api/interfaces/http/admin/routes/index.js';
import { getDbPool } from '../../../api/infrastructure/db/client.js';

describe('Admin Settings API - CRUD Integration', () => {
  let server: FastifyInstance;
  const createdKeys: string[] = [];
  const adminSecret = 'test-admin-secret';

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.register(registerAdminRoutes, { prefix: '/api/admin' });
    await server.ready();
  });

  afterAll(async () => {
    const pool = getDbPool();
    for (const key of createdKeys) {
      try {
        await pool.query('DELETE FROM settings WHERE setting_key = $1', [key]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await server.close();
  });

  describe('POST /api/admin/settings - Create', () => {
    it('should create a new setting with JSON value', async () => {
      const settingKey = `test.setting.${Date.now()}`;
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingKey,
          settingValue: { enabled: true, maxCount: 10, features: ['A', 'B'] },
          settingType: 'site',
          description: 'Test setting for integration tests',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.settingKey).toBe(settingKey);
      expect(body.settingValue).toEqual({ enabled: true, maxCount: 10, features: ['A', 'B'] });
      expect(body.settingType).toBe('site');
      expect(body.description).toBe('Test setting for integration tests');

      createdKeys.push(settingKey);
    });

    it('should create settings with different types', async () => {
      const types: Array<'site' | 'email' | 'social' | 'analytics'> = ['site', 'email', 'social', 'analytics'];

      for (const type of types) {
        const settingKey = `test.${type}.${Date.now()}`;
        const response = await server.inject({
          method: 'POST',
          url: '/api/admin/settings',
          headers: {
            'x-admin-secret': adminSecret,
            'content-type': 'application/json'
          },
          payload: {
            settingKey,
            settingValue: { type, value: 'test' },
            settingType: type,
          }
        });

        expect(response.statusCode).toBe(201);
        const body = JSON.parse(response.body);
        expect(body.settingType).toBe(type);

        createdKeys.push(settingKey);
      }
    });

    it('should reject creation without authentication', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: { 'content-type': 'application/json' },
        payload: {
          settingKey: 'test.unauthorized',
          settingValue: { test: true },
          settingType: 'site',
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/admin/settings - List', () => {
    it('should list all settings', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/settings',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('count');
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('should filter settings by type', async () => {
      const settingKey = `test.email.filter.${Date.now()}`;
      
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingKey,
          settingValue: { smtp: 'test.smtp.com' },
          settingType: 'email',
        }
      });

      createdKeys.push(settingKey);

      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/settings?type=email',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.every((setting: any) => setting.settingType === 'email')).toBe(true);
    });
  });

  describe('GET /api/admin/settings/:key - Get by Key', () => {
    it('should retrieve a setting by key', async () => {
      const settingKey = `test.retrieve.${Date.now()}`;
      
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingKey,
          settingValue: { data: 'to retrieve' },
          settingType: 'site',
          description: 'Setting to retrieve',
        }
      });

      createdKeys.push(settingKey);

      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/admin/settings/${settingKey}`,
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(getResponse.statusCode).toBe(200);
      const body = JSON.parse(getResponse.body);
      expect(body.settingKey).toBe(settingKey);
      expect(body.settingValue).toEqual({ data: 'to retrieve' });
      expect(body.description).toBe('Setting to retrieve');
    });

    it('should return 404 for non-existent setting', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/admin/settings/non.existent.key',
        headers: { 'x-admin-secret': adminSecret }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/admin/settings/:key - Update', () => {
    it('should update an existing setting value', async () => {
      const settingKey = `test.update.${Date.now()}`;
      
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingKey,
          settingValue: { version: 1, enabled: false },
          settingType: 'site',
          description: 'Original description',
        }
      });

      createdKeys.push(settingKey);

      const updateResponse = await server.inject({
        method: 'PUT',
        url: `/api/admin/settings/${settingKey}`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingValue: { version: 2, enabled: true, newField: 'added' },
          description: 'Updated description',
        }
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.settingValue).toEqual({ version: 2, enabled: true, newField: 'added' });
      expect(body.description).toBe('Updated description');
    });

    it('should update only settingValue and preserve description when not provided', async () => {
      const settingKey = `test.partial.${Date.now()}`;
      
      const createResponse = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingKey,
          settingValue: { original: true },
          settingType: 'site',
          description: 'Keep this description',
        }
      });

      createdKeys.push(settingKey);

      const updateResponse = await server.inject({
        method: 'PUT',
        url: `/api/admin/settings/${settingKey}`,
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingValue: { updated: true },
        }
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.settingValue).toEqual({ updated: true });
      expect(body.description).toBe('Keep this description');
    });

    it('should return 404 when updating non-existent setting', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/api/admin/settings/non.existent.key',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingValue: { test: true },
        }
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Complex JSON value handling', () => {
    it('should handle nested JSON structures', async () => {
      const settingKey = `test.complex.${Date.now()}`;
      const complexValue = {
        theme: {
          colors: {
            primary: '#FF5733',
            secondary: '#33FF57',
          },
          fonts: ['Roboto', 'Arial'],
        },
        features: {
          darkMode: true,
          notifications: {
            email: true,
            push: false,
          },
        },
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/admin/settings',
        headers: {
          'x-admin-secret': adminSecret,
          'content-type': 'application/json'
        },
        payload: {
          settingKey,
          settingValue: complexValue,
          settingType: 'site',
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.settingValue).toEqual(complexValue);

      createdKeys.push(settingKey);
    });
  });
});
