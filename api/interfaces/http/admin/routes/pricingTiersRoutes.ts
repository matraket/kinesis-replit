import { FastifyInstance } from 'fastify';
import { PricingTiersController } from '../controllers/index.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

export async function registerPricingTiersRoutes(
  fastify: FastifyInstance,
  controller: PricingTiersController
) {
  fastify.get('/pricing-tiers', {
    preHandler: adminAuthMiddleware,
    handler: controller.list.bind(controller),
  });

  fastify.get('/pricing-tiers/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.getById.bind(controller),
  });

  fastify.post('/pricing-tiers', {
    preHandler: adminAuthMiddleware,
    handler: controller.create.bind(controller),
  });

  fastify.put('/pricing-tiers/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.update.bind(controller),
  });

  fastify.delete('/pricing-tiers/:id', {
    preHandler: adminAuthMiddleware,
    handler: controller.delete.bind(controller),
  });
}
