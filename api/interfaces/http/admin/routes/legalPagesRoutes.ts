import { FastifyInstance } from 'fastify';
import { LegalPagesController } from '../controllers/LegalPagesController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerLegalPagesRoutes(
  fastify: FastifyInstance,
  controller: LegalPagesController
) {
  fastify.get('/legal-pages', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/legal-pages/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.get('/legal-pages/type/:pageType', {
    preHandler: adminAuthMiddleware,
    handler: controller.getByType.bind(controller),
  });

  fastify.post('/legal-pages', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/legal-pages/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.update.bind(controller),
  });

  fastify.delete('/legal-pages/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
