import { FastifyInstance } from 'fastify';
import { SettingsController } from '../controllers/SettingsController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerSettingsRoutes(
  fastify: FastifyInstance,
  controller: SettingsController
) {
  fastify.get('/settings', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/settings/:key', {
    preHandler: adminAuthMiddleware,
    handler: controller.getByKey.bind(controller),
  });

  fastify.post('/settings', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/settings/:key', {
    preHandler: adminAuthMiddleware,
    handler: controller.updateByKey.bind(controller),
  });
}
