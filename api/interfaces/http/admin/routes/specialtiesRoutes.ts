import { FastifyInstance } from 'fastify';
import { SpecialtiesController } from '../controllers/index.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerSpecialtiesRoutes(
  fastify: FastifyInstance,
  controller: SpecialtiesController
) {
  fastify.get('/specialties', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/specialties/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.post('/specialties', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/specialties/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.update.bind(controller),
  });

  fastify.delete('/specialties/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
