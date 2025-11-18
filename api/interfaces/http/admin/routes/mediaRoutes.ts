import { FastifyInstance } from 'fastify';
import { MediaController } from '../controllers/MediaController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerMediaRoutes(
  fastify: FastifyInstance,
  controller: MediaController
) {
  fastify.get('/media', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/media/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.post('/media', {
    preHandler: adminAuthMiddleware,
    handler: controller.upload.bind(controller),
  });

  fastify.delete('/media/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
