import { FastifyInstance } from 'fastify';
import { listPricingTiers } from '../controllers/pricing-tiers.controller.js';

export async function pricingTiersRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', listPricingTiers);
}
