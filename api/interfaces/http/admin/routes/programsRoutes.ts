import { FastifyInstance } from 'fastify';
import { ProgramsController } from '../controllers/index.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerProgramsRoutes(
  fastify: FastifyInstance,
  controller: ProgramsController
) {
  fastify.get('/programs', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/programs/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.post('/programs', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/programs/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.update.bind(controller),
  });

  fastify.delete('/programs/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
