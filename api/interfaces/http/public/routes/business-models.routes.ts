import { FastifyInstance } from 'fastify';
import { listBusinessModels, getBusinessModelBySlug } from '../controllers/business-models.controller.js';

export async function businessModelsRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', listBusinessModels);
  server.get('/:slug', getBusinessModelBySlug);
}
