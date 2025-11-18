import { FastifyInstance } from 'fastify';
import { PageContentController } from '../controllers/index.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerPageContentRoutes(
  fastify: FastifyInstance,
  controller: PageContentController
) {
  fastify.get('/pages', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/pages/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.get('/pages/by-key/:pageKey', {
    preHandler: adminAuthMiddleware,
    handler: controller.getByKey.bind(controller),
  });

  fastify.post('/pages', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/pages/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.update.bind(controller),
  });

  fastify.delete('/pages/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
