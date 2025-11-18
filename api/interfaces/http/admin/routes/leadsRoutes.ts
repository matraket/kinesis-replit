import { FastifyInstance } from 'fastify';
import { LeadsController } from '../controllers/LeadsController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerLeadsRoutes(
  fastify: FastifyInstance,
  controller: LeadsController
) {
  fastify.get('/leads', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/leads/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.patch('/leads/:id/status', {
    preHandler: adminAuthMiddleware,
    handler: controller.updateStatus.bind(controller),
  });

  fastify.patch('/leads/:id/notes', {
    preHandler: adminAuthMiddleware,
    handler: controller.updateNotes.bind(controller),
  });
}
