import { FastifyInstance } from 'fastify';
import { listLegalPages, getLegalPageBySlug } from '../controllers/legal-pages.controller.js';

export async function legalPagesRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', listLegalPages);
  server.get('/:slug', getLegalPageBySlug);
}
