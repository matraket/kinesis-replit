import { FastifyInstance } from 'fastify';
import { InstructorsController } from '../controllers/index.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerInstructorsRoutes(
  fastify: FastifyInstance,
  controller: InstructorsController
) {
  fastify.get('/instructors', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/instructors/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.post('/instructors', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/instructors/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.update.bind(controller),
  });

  fastify.delete('/instructors/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
